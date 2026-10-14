import type { PrismaClient } from "@prisma/client";
import { prisma } from "../config/db";

/**
 * GraphQL context factory — auth/user injection added in a later phase.
 */
export type GraphQLContext = {
  prisma: PrismaClient;
};

export function createContext(): GraphQLContext {
  return { prisma };
}

export default createContext;
