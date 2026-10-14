import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { toErrorResponse } from "./utils/errors";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const payload = toErrorResponse(err);
    logger.error("Unhandled error", payload.error);
    res.status(payload.error.statusCode).json(payload);
  },
);

app.listen(env.port, () => {
  logger.info(`Server listening on port ${env.port}`, {
    env: env.nodeEnv,
    corsOrigin: env.corsOrigin,
  });
});

export default app;
