import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = "postgresql://postgres@localhost:5433/gfg_svec_hiring";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    console.log('Testing connection & sequence...');
    const seqResult = await prisma.$queryRawUnsafe<any[]>(
      "SELECT nextval('application_id_seq');"
    );
    console.log('Raw Seq Result:', seqResult);
    console.log('Parsed value:', Number(seqResult[0].nextval));
  } catch (err) {
    console.error('Database query threw error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
