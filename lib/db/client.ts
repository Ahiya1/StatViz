/**
 * Prisma Client Singleton
 *
 * Fixes prepared statement errors in development by:
 * 1. Reusing a single Prisma client instance
 * 2. Disabling prepared statements to avoid hot-reload conflicts
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
  // Disable prepared statements to avoid hot-reload conflicts in development
  datasources: {
    db: {
      url: process.env.DATABASE_URL + (process.env.NODE_ENV === 'development' ? '?pgbouncer=true&prepared_statement_cache_size=0' : '')
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
