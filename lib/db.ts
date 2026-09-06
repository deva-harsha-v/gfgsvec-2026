import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function createPool() {
  const rawUrl = process.env.DATABASE_URL || '';
  if (!rawUrl) return new Pool();
  try {
    const parsed = new URL(rawUrl);
    return new Pool({
      host: parsed.hostname,
      port: parseInt(parsed.port || '6543', 10),
      database: parsed.pathname.slice(1) || 'postgres',
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      ssl: { rejectUnauthorized: false },
    });
  } catch {
    return new Pool({ connectionString: rawUrl, ssl: { rejectUnauthorized: false } });
  }
}

const pool = createPool();
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
