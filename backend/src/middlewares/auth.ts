import type { NextFunction, Request, Response } from "express";
import jwt, {
  type Algorithm,
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { Role } from "@prisma/client";
import { AuthContext, AuthenticatedContext, TokenPayload } from "../types/infrastructure";
import { UNAUTHENTICATED } from "../utils/constant";

const JWT_ALGORITHM: Algorithm = "HS256";
const JWT_ISSUER: string = "portfolio-backend";
const JWT_AUDIENCE: string = "portfolio-clients";
const VALID_ROLES: readonly Role[] = ["ADMIN", "VISITOR"];


// Type augmentation: makes `req.auth` available (and typed) on every Express
// request. It is populated by the `attachAuth` middleware.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth: AuthContext;
    }
  }
}

/**
 * Type guard that checks an untrusted token claim is a valid Prisma `Role`
 * (`ADMIN` or `VISITOR`). Used by `verifyToken` to reject forged/unknown roles.
 */
function isRole(value: unknown): value is Role {
  return typeof value === "string" && VALID_ROLES.includes(value as Role);
}

/** Signs a short-lived access token carrying only the user id and role. */
export function signToken({ userId, role }: TokenPayload): string {
  return jwt.sign({ role }, env.jwtSecret, {
    algorithm: JWT_ALGORITHM,
    subject: userId,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

/**
 * Verifies a token and returns the identity it carries.
 * Throws on any failure (bad signature, expired, wrong alg/iss/aud, bad shape).
 */
export function verifyToken(token: string): AuthenticatedContext {
  const decoded: string | JwtPayload = jwt.verify(token, env.jwtSecret, {
    // Pinned: prevents "alg: none" and RS/HS algorithm-confusion attacks.
    algorithms: [JWT_ALGORITHM],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });

  if (typeof decoded === "string") {
    throw new Error("Unexpected token payload");
  }

  const { sub, role } = decoded;
  if (typeof sub !== "string" || sub.length === 0 || !isRole(role)) {
    throw new Error("Invalid token claims");
  }

  return { isAuthenticated: true, userId: sub, role };
}

const BEARER_PATTERN: RegExp = /^Bearer\s+(\S+)$/i;

/**
 * Pulls the raw JWT out of an `Authorization: Bearer <token>` header value.
 * Returns `null` when the header is missing or not in Bearer format, so the
 * caller can fall back to the unauthenticated identity.
 */
function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const match: RegExpExecArray | null = BEARER_PATTERN.exec(header.trim());
  return match?.[1] ?? null;
}

/**
 * Populates `req.auth` from `Authorization: Bearer <token>`.
 * Never throws and never rejects the request: missing or invalid credentials
 * yield the unauthenticated fallback, and resolvers decide what requires auth.
 */
export function attachAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.auth = UNAUTHENTICATED;

  const token: string | null = extractBearerToken(req.headers.authorization);
  if (token) {
    try {
      req.auth = verifyToken(token);
    } catch (error: unknown) {
      // Log the reason only; never the token itself.
      logger.debug("JWT verification failed", {
        reason: error instanceof Error ? error.name : "unknown",
        path: req.path,
      });
    }
  }

  next();
}
