import 'dotenv/config';
import { db } from '../lib/db';

async function main() {
  console.log('Starting backfill for initial recruitment cycle...');

  // 1. Create or fetch default cycle
  let cycle = await db.recruitmentCycle.findUnique({
    where: { slug: 'gfg-svec-2026' },
  });

  if (!cycle) {
    cycle = await db.recruitmentCycle.create({
      data: {
        title: 'GFG SVEC Executive Board 2026',
        slug: 'gfg-svec-2026',
        posterImageUrl: '/college-building.png',
        shortDescription: 'Official campus recruitment drive for GFG SVEC Student Chapter Executive Committee 2026.',
        fullDescription: 'Join the lead executive team of GeeksforGeeks SVEC Student Chapter. Open for 2nd and 3rd year engineering students across all streams.',
        status: 'PUBLISHED',
        opensAt: new Date('2026-08-12T13:30:00.000Z'),
        closesAt: new Date('2026-08-12T16:30:00.000Z'),
      },
    });
    console.log(`Created default cycle: ${cycle.title} (${cycle.id})`);
  } else {
    console.log(`Default cycle already exists: ${cycle.title} (${cycle.id})`);
  }

  // 2. Create standard FormFields
  const fields = [
    {
      fieldKey: 'interestedFields',
      label: 'Interested Fields / Domains',
      fieldType: 'MULTI_SELECT' as const,
      options: [
        'DIGITAL_DEVELOPMENT',
        'COMPETITIVE_PROGRAMMING',
        'DESIGN',
        'SOCIAL_MEDIA_MARKETING',
        'PUBLIC_RELATIONS_OUTREACH',
        'EVENT_MANAGEMENT',
        'PHOTOGRAPHY_VIDEOGRAPHY',
      ],
      required: true,
      order: 1,
    },
    {
      fieldKey: 'hasPastExperience',
      label: 'Do you have previous experience?',
      fieldType: 'CHECKBOX' as const,
      options: [],
      required: false,
      order: 2,
    },
    {
      fieldKey: 'pastExperience',
      label: 'Describe relevant past experience',
      fieldType: 'LONG_TEXT' as const,
      options: [],
      required: false,
      order: 3,
    },
    {
      fieldKey: 'previousWorkLinks',
      label: 'Previous Work / Portfolio Links',
      fieldType: 'SHORT_TEXT' as const,
      options: [],
      required: false,
      order: 4,
    },
    {
      fieldKey: 'interviewSlot',
      label: 'Interview Availability Slot',
      fieldType: 'SINGLE_SELECT' as const,
      options: [
        '13th August - Forenoon Session',
        '13th August - Afternoon Session',
        '14th August - Forenoon Session',
        '14th August - Afternoon Session',
      ],
      required: true,
      order: 5,
    },
    {
      fieldKey: 'reasonForJoining',
      label: 'Why do you want to join GFG Club?',
      fieldType: 'LONG_TEXT' as const,
      options: [],
      required: true,
      order: 6,
    },
    {
      fieldKey: 'contribution',
      label: 'How do you want to contribute to GFG Club?',
      fieldType: 'LONG_TEXT' as const,
      options: [],
      required: true,
      order: 7,
    },
    {
      fieldKey: 'clubKnowledge',
      label: 'What do you know about GFG Club?',
      fieldType: 'LONG_TEXT' as const,
      options: [],
      required: true,
      order: 8,
    },
  ];

  for (const f of fields) {
    await db.formField.upsert({
      where: {
        cycleId_fieldKey: {
          cycleId: cycle.id,
          fieldKey: f.fieldKey,
        },
      },
      update: {
        label: f.label,
        fieldType: f.fieldType,
        options: f.options,
        required: f.required,
        order: f.order,
      },
      create: {
        cycleId: cycle.id,
        fieldKey: f.fieldKey,
        label: f.label,
        fieldType: f.fieldType,
        options: f.options,
        required: f.required,
        order: f.order,
      },
    });
  }
  console.log('Upserted default FormField definitions.');

  // 3. Backfill applicants with cycleId and responses JSON
  const unlinkedApplicants = await db.applicant.findMany({
    where: { cycleId: null },
  });

  console.log(`Found ${unlinkedApplicants.length} applicants to backfill with cycleId.`);

  for (const app of unlinkedApplicants) {
    const responsesJson = {
      interestedFields: app.interestedFields,
      hasPastExperience: app.hasPastExperience,
      pastExperience: app.pastExperience,
      previousWorkLinks: app.previousWorkLinks,
      interviewSlot: app.interviewSlot,
      reasonForJoining: app.reasonForJoining,
      contribution: app.contribution,
      clubKnowledge: app.clubKnowledge,
    };

    await db.applicant.update({
      where: { id: app.id },
      data: {
        cycleId: cycle.id,
        responses: responsesJson,
      },
    });
  }

  console.log('Backfill script completed successfully!');
}

main()
  .catch((e) => {
    console.error('Backfill error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
