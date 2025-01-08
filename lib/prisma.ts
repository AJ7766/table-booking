import { PrismaClient } from '@prisma/client';

// Create a prisma client
const globalForPrisma = global as unknown as {
  prisma: PrismaClient
};
// Use cached client OR create new
const prisma =
  globalForPrisma.prisma || new PrismaClient();
// If in development use cached prisma, prevents bugs and multiple instances during hot-reloading
if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;

export { prisma };
