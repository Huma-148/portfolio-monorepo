import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { toErrorResponse } from "./utils/errors";
import type { ErrorResponse } from "./types/infrastructure";
import { attachAuth, graphqlRateLimiter } from "./middlewares";

const app: express.Express = express();

// Required for accurate client IPs (and per-client rate limiting) behind a
// load balancer / reverse proxy. 0 disables proxy trust.
app.set("trust proxy", env.trustProxy);

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

// Coarse outer cap for the whole API. Headers are disabled so clients only see
// the limit that actually applies to /graphql (set by graphqlRateLimiter).
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: false,
    legacyHeaders: false,
  }),
);

// Strict cap for /graphql, placed before body parsing and JWT verification so
// abusive clients are rejected before any expensive work.
app.use("/graphql", graphqlRateLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(attachAuth);

// Liveness probe for load balancers / uptime checks. Always 200 while the
// process is up; it does not touch the database.
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

// Central error handler (must be registered after all routes). Logs the error
// and replies with the standard JSON error body from `toErrorResponse`.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ): void => {
    const payload: ErrorResponse = toErrorResponse(err);
    logger.error("Unhandled error", { ...payload.error, cause: err });
    res.status(payload.error.statusCode).json(payload);
  },
);

// Fail fast on programmer errors, but make sure the failure is logged first.
function crash(reason: string, error: unknown): void {
  logger.error(reason, { error });
  setTimeout(() => process.exit(1), 100);
}

process.on("unhandledRejection", (reason) =>
  crash("Unhandled promise rejection", reason),
);
process.on("uncaughtException", (error) =>
  crash("Uncaught exception", error),
);

app.listen(env.port, () => {
  logger.info(`Server listening on port ${env.port}`, {
    env: env.nodeEnv,
    corsOrigin: env.corsOrigin,
  });
});

export default app;
