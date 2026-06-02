

// =============================================================================
// Prisma Client Singleton
// =============================================================================
// This file creates a singleton instance of the Prisma Client.
// In development, this prevents creating multiple instances when hot-reloading.
// In production, it ensures a single connection pool is used.
// =============================================================================

import { PrismaClient } from "@/generated/prisma/client";

// PrismaClient instance attached to globalThis in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create or reuse the Prisma client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  } as any);

// In development, attach to globalThis to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export a function for use in API routes and server components
export function getPrismaClient(): PrismaClient {
  return prisma;
}

export default prisma;