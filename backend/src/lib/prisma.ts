import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    const runtimeConnectionString = process.env.DATABASE_URL?.trim();

    if (!runtimeConnectionString) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    process.env.DATABASE_URL = runtimeConnectionString;

    const logLevels: Prisma.LogLevel[] =
        process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'];

    return new PrismaClient({
        log: logLevels,
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
