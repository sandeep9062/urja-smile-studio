
// =============================================================================
// Prisma Client Singleton
// =============================================================================
// This file creates a singleton instance of the Prisma Client.
// In development, this prevents creating multiple instances when hot-reloading.
// In production, it ensures a single connection pool is used.
//
// Prisma 7.x requires a driver adapter (e.g. @prisma/adapter-pg) to be
// provided to the PrismaClient constructor. See:
// https://pris.ly/d/client-constructor
// =============================================================================

import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// PrismaClient instance attached to globalThis in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Build the PostgreSQL adapter from the DATABASE_URL env variable.
// We avoid throwing at import-time so the build can succeed even when
// DATABASE_URL is not defined (e.g. on CI during the static analysis phase).
const connectionString = process.env.DATABASE_URL;

function createPrismaClient(): PrismaClient {
  const adapter = connectionString
    ? new PrismaPg({ connectionString })
    : new PrismaPg({
        connectionString:
          "postgresql://placeholder:placeholder@localhost:5432/placeholder",
      });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  } as any);
}

// Create or reuse the Prisma client instance
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, attach to globalThis to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export a function for use in API routes and server components
export function getPrismaClient(): PrismaClient {
  return prisma;
}

export default prisma;
