import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const rawUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
const parsedUrl = new URL(rawUrl);

const pool = new Pool({
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port || '5432', 10),
  database: parsedUrl.pathname.slice(1) || 'postgres',
  user: decodeURIComponent(parsedUrl.username),
  password: decodeURIComponent(parsedUrl.password),
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeding...');

  // 1. Create / Update Default Admin with Secure Password
  const adminEmail = 'admin@gfgsvec.in';
  const securePassword = 'GFGSvec#Admin2026!Secure';
  const hashedPassword = await bcrypt.hash(securePassword, 10);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log(`Admin account created successfully: ${adminEmail}`);
  } else {
    await prisma.admin.update({
      where: { email: adminEmail },
      data: { password: hashedPassword },
    });
    console.log(`Admin account password updated successfully: ${adminEmail}`);
  }

  // 2. Initialize sequence application_id_seq safely even on an empty table
  try {
    await prisma.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS application_id_seq START WITH 1;`);

    const maxValResult = await prisma.$queryRawUnsafe<{ maxval: number }[]>(
      `SELECT COALESCE(MAX(CAST(SUBSTRING("applicationId", 15) AS INTEGER)), 0) as maxval FROM "Applicant"`
    );
    const maxVal = maxValResult[0]?.maxval || 0;
    const startVal = maxVal > 0 ? maxVal : 1;
    await prisma.$executeRawUnsafe(`SELECT setval('application_id_seq', ${startVal}, ${maxVal > 0});`);
    console.log(`Sequence application_id_seq initialized to ${startVal}.`);
  } catch (err) {
    console.warn('Sequence initialization note:', err);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
