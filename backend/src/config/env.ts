import dotenv from "dotenv";
import { z } from "zod";

// In production, configuration must come strictly from the platform (ECS task
// definition, Secrets Manager, etc.), never from a stray .env file on disk.
// quiet: dotenv's startup banner would otherwise pollute structured log streams.
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ quiet: true });
}

/** Deployment modes the app recognises. Anything else is rejected at startup. */
export type NodeEnv = "development" | "test" | "production";

/** Log levels accepted for LOG_LEVEL (the winston npm levels). */
export type LogLevel =
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

/**
 * Validated application configuration. Every property is read-only, and the
 * object is frozen at runtime by `loadEnv`.
 */
export type Env = Readonly<{
  nodeEnv: NodeEnv;
  isProduction: boolean;
  port: number;
  databaseUrl: string;
  corsOrigin: string;

  // Auth
  jwtSecret: string;
  jwtExpiresIn: string;

  // Logging
  logLevel: LogLevel;

  // Networking: number of reverse-proxy hops (e.g. 1 behind an AWS ALB).
  trustProxy: number;

  // Rate limiting for /graphql
  rateLimitGraphqlWindowMs: number;
  rateLimitGraphqlMax: number;
}>;

/**
 * Shape of the environment variables AFTER schema validation (defaults applied,
 * numbers converted). `buildSchema` is typed to produce exactly this.
 */
type RawEnv = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  PORT: number;
  LOG_LEVEL: LogLevel;
  JWT_EXPIRES_IN: string;
  TRUST_PROXY: number;
  RATE_LIMIT_GRAPHQL_WINDOW_MS: number;
  RATE_LIMIT_GRAPHQL_MAX: number;
};

const NODE_ENVS: readonly [NodeEnv, ...NodeEnv[]] = [
  "development",
  "test",
  "production",
];
const LOG_LEVELS: readonly [LogLevel, ...LogLevel[]] = [
  "error",
  "warn",
  "info",
  "http",
  "verbose",
  "debug",
  "silly",
];

// Convenience fallbacks that exist ONLY outside production.
const DEV_JWT_SECRET: string = "dev-only-change-me";
const DEV_CORS_ORIGIN: string = "http://localhost:3000";

const MIN_PROD_JWT_SECRET_LENGTH: number = 32;
// Rejects the values shipped in .env.example / the dev fallback.
const PLACEHOLDER_SECRET: RegExp = /change-?me|dev-only/i;

/**
 * Thrown when the environment is misconfigured. The message lists EVERY
 * problem at once (not one per restart) and never includes secret values.
 */
export class EnvValidationError extends Error {
  constructor(public readonly problems: readonly string[]) {
    super(
      [
        "Invalid environment configuration:",
        ...problems.map((problem: string): string => `  - ${problem}`),
        "See backend/.env.example for the full list of variables.",
      ].join("\n"),
    );
    this.name = "EnvValidationError";
  }
}

/**
 * Builds a required string rule: the variable must be present and non-empty
 * (after trimming). Used for values that must never silently fall back.
 */
function requiredString(name: string): z.ZodString {
  return z
    .string({ error: `${name} is required` })
    .trim()
    .min(1, `${name} must not be empty`);
}

/**
 * Builds an integer rule for numeric knobs (PORT, rate limits, ...). Accepts
 * only plain digit strings, so "1e3", "-5" and "12abc" are rejected instead of
 * being coerced into surprising numbers. Input is the raw string, output is a
 * number.
 */
function integer(
  name: string,
  min: number,
  max: number = Number.MAX_SAFE_INTEGER,
): z.ZodType<number, string> {
  return z
    .string()
    .regex(/^\d+$/, `${name} must be a whole number`)
    .transform(Number)
    .pipe(
      z
        .number()
        .min(min, `${name} must be at least ${min}`)
        .max(max, `${name} must be at most ${max}`),
    );
}

/**
 * True only for an exact http(s) origin such as "https://app.example.com".
 * Rejects "*", paths and trailing slashes: those never match the browser's
 * `Origin` header, so they would silently break CORS.
 */
function isExactOrigin(value: string): boolean {
  try {
    const url: URL = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.origin === value
    );
  } catch {
    return false;
  }
}

/**
 * Builds the schema for the given mode.
 * Production: DATABASE_URL, JWT_SECRET and CORS_ORIGIN are required with no
 * fallback. Elsewhere: only DATABASE_URL is required; the other two get
 * development conveniences. Operational knobs always have safe defaults.
 */
function buildSchema(isProduction: boolean): z.ZodType<RawEnv> {
  const corsOrigin: z.ZodString = z
    .string()
    .trim()
    .refine(
      isExactOrigin,
      "CORS_ORIGIN must be an exact origin like https://app.example.com (no '*', path or trailing slash)",
    );

  return z.object({
    // Required in every environment: no silent fallback.
    DATABASE_URL: requiredString("DATABASE_URL").refine(
      (value: string): boolean => /^postgres(ql)?:\/\//i.test(value),
      "DATABASE_URL must be a PostgreSQL connection string (postgresql://...)",
    ),

    // Required in production; development fallback otherwise.
    JWT_SECRET: isProduction
      ? requiredString("JWT_SECRET")
          .min(
            MIN_PROD_JWT_SECRET_LENGTH,
            `JWT_SECRET must be at least ${MIN_PROD_JWT_SECRET_LENGTH} characters in production`,
          )
          .refine(
            (value: string): boolean => !PLACEHOLDER_SECRET.test(value),
            "JWT_SECRET must not be a placeholder value in production",
          )
      : z.string().trim().min(1).default(DEV_JWT_SECRET),

    // Required in production; localhost fallback otherwise.
    CORS_ORIGIN: isProduction
      ? requiredString("CORS_ORIGIN").pipe(corsOrigin)
      : corsOrigin.default(DEV_CORS_ORIGIN),

    // Safe operational defaults.
    PORT: integer("PORT", 1, 65535).default(4000),
    LOG_LEVEL: z.enum(LOG_LEVELS).default(isProduction ? "info" : "debug"),
    JWT_EXPIRES_IN: z
      .string()
      .trim()
      // A unit is mandatory: jsonwebtoken reads a bare "3600" as 3600 ms.
      .regex(
        /^\d+\s*(ms|s|m|h|d|w|y)$/i,
        "JWT_EXPIRES_IN must include a unit, e.g. 15m, 1h, 7d",
      )
      .default("1h"),
    TRUST_PROXY: integer("TRUST_PROXY", 0, 32).default(0),
    RATE_LIMIT_GRAPHQL_WINDOW_MS: integer(
      "RATE_LIMIT_GRAPHQL_WINDOW_MS",
      1,
    ).default(60_000),
    RATE_LIMIT_GRAPHQL_MAX: integer("RATE_LIMIT_GRAPHQL_MAX", 1).default(60),
  });
}

/**
 * Trims every value and drops empty ones, so `PORT=` in a .env file behaves
 * like an unset variable (default applies; required variables report missing).
 */
function cleanSource(source: NodeJS.ProcessEnv): Record<string, string> {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    const trimmed: string | undefined = value?.trim();
    if (trimmed) cleaned[key] = trimmed;
  }
  return cleaned;
}

/**
 * Validates a raw environment object and returns the typed, frozen config.
 * Throws `EnvValidationError` listing all problems if anything is invalid.
 * Takes the source as a parameter (default: `process.env`) so tests can feed it
 * crafted values.
 */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const raw: Record<string, string> = cleanSource(source);

  // NODE_ENV decides which rules apply, so it is validated first.
  const nodeEnvResult: z.ZodSafeParseResult<NodeEnv> = z
    .enum(NODE_ENVS, {
      error: `NODE_ENV must be one of: ${NODE_ENVS.join(", ")}`,
    })
    .safeParse(raw.NODE_ENV ?? "development");

  if (!nodeEnvResult.success) {
    throw new EnvValidationError(
      nodeEnvResult.error.issues.map((issue): string => issue.message),
    );
  }

  const nodeEnv: NodeEnv = nodeEnvResult.data;
  const isProduction: boolean = nodeEnv === "production";

  const result: z.ZodSafeParseResult<RawEnv> =
    buildSchema(isProduction).safeParse(raw);
  if (!result.success) {
    throw new EnvValidationError(
      result.error.issues.map((issue): string => {
        const field: string = issue.path.join(".");
        // Messages already name their variable; prefix only when they don't.
        return field && !issue.message.includes(field)
          ? `${field}: ${issue.message}`
          : issue.message;
      }),
    );
  }

  const parsed: RawEnv = result.data;

  return Object.freeze({
    nodeEnv,
    isProduction,
    port: parsed.PORT,
    databaseUrl: parsed.DATABASE_URL,
    corsOrigin: parsed.CORS_ORIGIN,

    // Auth
    jwtSecret: parsed.JWT_SECRET,
    jwtExpiresIn: parsed.JWT_EXPIRES_IN,

    // Logging
    logLevel: parsed.LOG_LEVEL,

    // Networking: number of reverse-proxy hops (e.g. 1 behind an AWS ALB).
    trustProxy: parsed.TRUST_PROXY,

    // Rate limiting for /graphql
    rateLimitGraphqlWindowMs: parsed.RATE_LIMIT_GRAPHQL_WINDOW_MS,
    rateLimitGraphqlMax: parsed.RATE_LIMIT_GRAPHQL_MAX,
  });
}

/**
 * Validated application configuration, built once at startup. Import this
 * everywhere instead of reading `process.env` directly.
 */
export const env: Env = loadEnv();
