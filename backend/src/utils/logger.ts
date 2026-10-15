import winston from "winston";
import { env } from "../config/env";

export type LogMeta = Record<string, unknown>;

const SERVICE_NAME: string = "portfolio-backend";
const MAX_DEPTH: number = 6;
const REDACTED: string = "[REDACTED]";

// Keys whose values must never reach a log aggregator.
const SENSITIVE_KEY: RegExp = /authorization|password|passwd|secret|token|jwt|cookie|api[-_]?key/i;

/**
 * Recursively sanitizes a value:
 * - Errors are serialized as { name, message, stack }.
 * - Circular references are replaced with "[Circular]".
 * - Deeply nested structures are truncated at `MAX_DEPTH`.
 * - Sensitive keys are replaced with "[REDACTED]".
 */
function sanitize(value: unknown, depth: number, seen: WeakSet<object>): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      errorMessage: value.message,
      stack: value.stack,
    };
  }

  if (value === null || typeof value !== "object") {
    return typeof value === "bigint" ? value.toString() : value;
  }

  if (seen.has(value)) return "[Circular]";
  if (depth >= MAX_DEPTH) return "[MaxDepth]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item, depth + 1, seen));
  }

  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    out[key] = SENSITIVE_KEY.test(key)
      ? REDACTED
      : sanitize(child, depth + 1, seen);
  }
  return out;
}

/**
 * Mutates the entry in place (rather than copying) so winston's internal
 * symbol keys (level, message, splat) survive.
 */
const sanitizeFormat: winston.Logform.FormatWrap = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (key === "level" || key === "message" || key === "timestamp") continue;
    info[key] = SENSITIVE_KEY.test(key)
      ? REDACTED
      : sanitize(info[key], 0, new WeakSet());
  }
  return info;
});

/** Routes each entry to exactly one transport, based on its raw level. */
const onlyLevels = (levels: readonly string[]): winston.Logform.Format =>
  winston.format((info) => {
    const raw: string = (info as unknown as Record<symbol, string>)[
      Symbol.for("level")
    ];
    return levels.includes(raw) ? info : false;
  })();

const INFO_STREAM_EXCLUDED: readonly string[] = ["warn", "error"];

/**
 * Filter for the stdout transport: lets every level through EXCEPT `warn` and
 * `error`, which have their own stderr transports. Prevents duplicate lines.
 */
function infoStreamFilter(): winston.Logform.Format {
  return winston.format((info) => {
    const raw: string = (info as unknown as Record<symbol, string>)[
      Symbol.for("level")
    ];
    return INFO_STREAM_EXCLUDED.includes(raw) ? false : info;
  })();
}

const baseFormat: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp(), // ISO 8601
  winston.format.errors({ stack: true }),
  sanitizeFormat(),
);

// One-line JSON in production for CloudWatch Logs Insights / any aggregator.
const productionOutput: winston.Logform.Format = winston.format.json();

const developmentOutput: winston.Logform.Format = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf((info) => {
    const {
      timestamp,
      level,
      message,
      service: _service,
      env: _env,
      ...meta
    } = info;
    const rest: string =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `${String(timestamp)} ${level}: ${String(message)}${rest}`;
  }),
);

const output: winston.Logform.Format = env.isProduction
  ? productionOutput
  : developmentOutput;

/**
 * Builds one console transport: entries first pass through `filter` (so each
 * level reaches exactly one transport), then through the environment-specific
 * output format (JSON in production, colorized text in development).
 * `options` selects the target stream, e.g. `stderrLevels` / `consoleWarnLevels`.
 */
function stream(
  filter: winston.Logform.Format,
  options: winston.transports.ConsoleTransportOptions = {},
): winston.transports.ConsoleTransportInstance {
  return new winston.transports.Console({
    ...options,
    format: winston.format.combine(filter, output),
  });
}

/**
 * Application-wide structured logger. Usage: `logger.info("message", { meta })`.
 * Output is routed by level (debug/info -> stdout, warn/error -> stderr) and
 * sensitive keys in the metadata are redacted automatically.
 */
export const logger: winston.Logger = winston.createLogger({
  level: env.logLevel,
  defaultMeta: { service: SERVICE_NAME, env: env.nodeEnv },
  format: baseFormat,
  exitOnError: false,
  transports: [
    // debug / info -> stdout
    stream(infoStreamFilter()),
    // warn -> console.warn (stderr)
    stream(onlyLevels(["warn"]), { consoleWarnLevels: ["warn"] }),
    // error -> stderr
    stream(onlyLevels(["error"]), { stderrLevels: ["error"] }),
  ],
});

export default logger;
