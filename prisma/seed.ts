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

  // 2. Create Sample Applicants
  const applicants = [
    {
      applicationId: 'GFG-SVEC-2026-0001',
      name: 'Aditya Vardhan',
      rollNumber: '23A81A0501',
      year: '3rd Year',
      section: 'A',
      interestedFields: ['DIGITAL_DEVELOPMENT', 'COMPETITIVE_PROGRAMMING'],
      hasPastExperience: true,
      pastExperience: 'Built a portfolio website and won a local college hackathon.',
      previousWorkLinks: ['https://github.com/aditya-vardhan', 'https://linkedin.com/in/aditya-vardhan'],
      reasonForJoining: 'I want to improve my data structures and algorithms (DSA) skills and collaborate with peer developers in SVEC.',
      contribution: 'I can organize coding contests, write editorials, and mentor junior students in web development.',
      clubKnowledge: 'It is a national-level developer community that focuses on technical skills, coding contests, and placement prep.',
      interviewSlot: '13th August - Forenoon Session',
      resumePath: null,
      interviewPresented: true,
      interviewTechnicalRating: 5,
      interviewNonTechnicalRating: 4,
      interviewNotes: 'Strong DSA foundation, communication is excellent. Clear selection.',
      applicationStatus: 'UNDER_REVIEW' as const,
    },
    {
      applicationId: 'GFG-SVEC-2026-0002',
      name: 'Bhavana Sri',
      rollNumber: '23A81A0502',
      year: '3rd Year',
      section: 'B',
      interestedFields: ['DESIGN', 'SOCIAL_MEDIA_MARKETING'],
      hasPastExperience: true,
      pastExperience: 'Managed social media handles for the annual college fest.',
      previousWorkLinks: ['https://instagram.com/bhavana_designs', 'https://linkedin.com/in/bhavana-sri'],
      reasonForJoining: 'I want to build my leadership and marketing skills by managing GFG SVEC social handles.',
      contribution: 'I will design attractive posters on Figma and run promotional campaigns.',
      clubKnowledge: 'GeeksforGeeks is a major resource for technical prep, and the campus chapter promotes tech culture.',
      interviewSlot: '13th August - Afternoon Session',
      resumePath: null,
      interviewPresented: true,
      interviewTechnicalRating: null,
      interviewNonTechnicalRating: null,
      interviewNotes: 'Good UI/UX portfolio shown, interview ongoing.',
      applicationStatus: 'NEW' as const,
    },
    {
      applicationId: 'GFG-SVEC-2026-0003',
      name: 'Charan Kumar',
      rollNumber: '24A81A0503',
      year: '2nd Year',
      section: 'C',
      interestedFields: ['DIGITAL_DEVELOPMENT'],
      hasPastExperience: false,
      pastExperience: '',
      previousWorkLinks: [],
      reasonForJoining: 'I am a beginner in web development and want to learn under the guidance of seniors in GFG.',
      contribution: 'I am highly enthusiastic and will volunteer in all workshops and maintain the club logs.',
      clubKnowledge: 'I know it is a coding community that helps students transition from academic subjects to actual industry tech.',
      interviewSlot: '14th August - Forenoon Session',
      resumePath: null,
      interviewPresented: false,
      interviewTechnicalRating: null,
      interviewNonTechnicalRating: null,
      interviewNotes: 'Absent on first call.',
      applicationStatus: 'NEW' as const,
    },
    {
      applicationId: 'GFG-SVEC-2026-0004',
      name: 'Dinesh Reddy',
      rollNumber: '24A81A0504',
      year: '2nd Year',
      section: 'A',
      interestedFields: ['COMPETITIVE_PROGRAMMING'],
      hasPastExperience: false,
      pastExperience: '',
      previousWorkLinks: ['https://github.com/dinesh-reddy'],
      reasonForJoining: 'To build AI projects and participate in hackathons with a core team.',
      contribution: 'Help organize AI/ML workshops and support administrative coding tasks.',
      clubKnowledge: 'GFG is the largest coding platform in India, and SVEC chapter drives active student coding engagement.',
      interviewSlot: '14th August - Afternoon Session',
      resumePath: null,
      interviewPresented: false,
      interviewTechnicalRating: null,
      interviewNonTechnicalRating: null,
      interviewNotes: null,
      applicationStatus: 'NEW' as const,
    }
  ];

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
