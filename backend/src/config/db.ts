import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Shared Prisma client (single instance). Import this everywhere instead of
 * calling `new PrismaClient()`. Outside production it is cached on `globalThis`
 * so hot reloads in dev don't open a new connection pool on every restart.
 *
 * The connection URL and log level come strictly from the validated `env`
 * object (never raw `process.env`), so the client always uses the exact value
 * that passed startup validation.
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: env.databaseUrl } },
    log:
      env.nodeEnv === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
