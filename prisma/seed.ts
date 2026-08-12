import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres@localhost:5433/gfg_svec_hiring";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeding...');

  // 1. Create Default Admin
  const adminEmail = 'admin@gfgsvec.in';
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminpassword123', 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log(`Admin account created: ${adminEmail} (password: adminpassword123)`);
  } else {
    console.log(`Admin account already exists.`);
  }

  // 2. Create Sample Applicants (Disabled for production fresh start)
  const applicants: any[] = [];

  for (const app of applicants) {
    await prisma.applicant.upsert({
      where: { rollNumber: app.rollNumber },
      update: {},
      create: app,
    });
  }

  // 3. Set the database sequence to match the actual maximum ID in the database
  try {
    // Ensure the sequence exists
    await prisma.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS application_id_seq START WITH 5;`);

    const maxValResult = await prisma.$queryRawUnsafe<{ maxval: number }[]>(
      `SELECT COALESCE(MAX(CAST(SUBSTRING("applicationId", 15) AS INTEGER)), 4) as maxval FROM "Applicant"`
    );
    const maxVal = maxValResult[0]?.maxval || 4;
    await prisma.$executeRawUnsafe(`SELECT setval('application_id_seq', ${maxVal});`);
    console.log(`Sequence application_id_seq dynamically reset to ${maxVal}.`);
  } catch (err) {
    console.warn('Could not reset sequence application_id_seq (maybe database engine is not Postgres yet).', err);
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
  });
