import dotenv from "dotenv";

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "4000")),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: optional("JWT_SECRET", "dev-only-change-me"),
  corsOrigin: optional("CORS_ORIGIN", "http://localhost:3000"),
  isProduction: optional("NODE_ENV", "development") === "production",
} as const;

/** Call when a live DB connection is required (e.g. before migrations/runtime queries). */
export function assertDatabaseUrl(): string {
  return required("DATABASE_URL");
}
