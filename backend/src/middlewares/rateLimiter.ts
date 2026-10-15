import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { env } from "../config/env";
import { AppError, toErrorResponse } from "../utils/errors";
import { logger } from "../utils/logger";

/**
 * Caps requests per client to the /graphql endpoint to mitigate automated
 * scraping and brute-force attempts. Mount BEFORE body parsing / auth so
 * abusive clients are rejected before any expensive work.
 *
 * Relies on the default key generator (client IP, IPv6-subnet safe). Behind a
 * load balancer, set TRUST_PROXY so the real client IP is used.
 */
export const graphqlRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: env.rateLimitGraphqlWindowMs,
  limit: env.rateLimitGraphqlMax,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  // CORS preflights must never consume a client's budget.
  skip: (req) => req.method === "OPTIONS",
  // Runs when a client exceeds the limit: logs a warning for monitoring, then
  // replies 429 using the standard JSON error body.
  handler: (req, res, _next, options) => {
    logger.warn("GraphQL rate limit exceeded", {
      ip: req.ip,
      method: req.method,
      path: req.originalUrl,
      limit: options.limit,
      windowMs: options.windowMs,
    });

    res
      .status(options.statusCode)
      .json(
        toErrorResponse(
          new AppError("Too many requests, please try again later.", 429),
        ),
      );
  },
});

export default graphqlRateLimiter;
