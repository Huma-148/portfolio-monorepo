import type { PrismaClient } from "@prisma/client";
import type { AuthContext } from "./infrastructure";

/**
 * Per-request GraphQL execution context handed to every resolver.
 * - `prisma`: the shared database client.
 * - `auth`: the caller's identity. Always defined; check `auth.isAuthenticated`
 *   and `auth.role` to decide whether an operation is allowed.
 * Read-only: resolvers must not mutate the context or the identity.
 */
export type GraphQLContext = Readonly<{
  prisma: PrismaClient;
  auth: AuthContext;
}>;
