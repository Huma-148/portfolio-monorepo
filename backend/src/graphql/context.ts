import type { Request } from "express";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "../config/db";
import { UNAUTHENTICATED } from "../utils/constant";
import type { GraphQLContext } from "../types/graphql";
import type { AuthContext, AuthenticatedContext } from "../types/infrastructure";

export type { GraphQLContext };

/**
 * Builds the GraphQL context for each incoming request.
 *
 * Single responsibility: turn "an Express request that already passed through
 * `attachAuth`" into the object every resolver receives. The database client is
 * injected through the constructor, so the factory can be tested with a fake
 * client and never reaches for global state itself.
 */
export class GraphQLContextFactory {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates the context for one request. Call once per request (the GraphQL
   * server's `context` hook). The result is frozen, so a resolver cannot
   * replace the database client or tamper with the caller's identity.
   */
  public create(req: Request): GraphQLContext {
    const context: GraphQLContext = {
      prisma: this.prisma,
      auth: this.resolveIdentity(req),
    };
    return Object.freeze(context);
  }

  /**
   * Reads the identity `attachAuth` placed on `req.auth` and rebuilds it field
   * by field, so only `isAuthenticated`, `userId` and `role` ever reach
   * resolvers. A missing or unauthenticated identity becomes the shared
   * `UNAUTHENTICATED` fallback.
   */
  private resolveIdentity(req: Request): AuthContext {
    const identity: AuthContext = req.auth ?? UNAUTHENTICATED;

    if (identity.isAuthenticated) {
      const authenticated: AuthenticatedContext = {
        isAuthenticated: true,
        userId: identity.userId,
        role: identity.role,
      };
      return Object.freeze(authenticated);
    }

    return UNAUTHENTICATED;
  }
}

/** Application-wide factory bound to the shared Prisma client. */
export const contextFactory: GraphQLContextFactory = new GraphQLContextFactory(
  prisma,
);

/**
 * Builds the per-request GraphQL context using the shared factory. This is the
 * function to pass to the GraphQL server as its `context` hook.
 */
export function createContext(req: Request): GraphQLContext {
  return contextFactory.create(req);
}

export default createContext;
