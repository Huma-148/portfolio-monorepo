import type { Request } from "express";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "../config/db";
import { UNAUTHENTICATED } from "../middlewares/auth";
import { AuthContext } from "../types/infrastructure";

/**
 * GraphQL context: database access plus the caller's identity.
 * `auth` is always defined; resolvers check `auth.isAuthenticated` / `auth.role`.
 */
export type GraphQLContext = {
  prisma: PrismaClient;
  auth: AuthContext;
};

/**
 * Builds the per-request GraphQL context. Reads the identity that `attachAuth`
 * placed on `req.auth`, falling back to the unauthenticated identity if the
 * middleware did not run.
 */
export function createContext(req: Request): GraphQLContext {
  return { prisma, auth: req.auth ?? UNAUTHENTICATED };
}

export default createContext;
