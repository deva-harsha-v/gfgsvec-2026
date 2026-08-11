import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApplicantSchema } from '@/lib/schemas';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const TARGET_UTC_TIME = '2026-08-10T14:00:00.000Z'; // 7:30 PM IST (Asia/Kolkata)
const STORAGE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'resumes')
  : path.join(process.cwd(), 'storage', 'resumes');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    // 1. Time Check
    const now = new Date();
    const target = new Date(TARGET_UTC_TIME);
    if (now.getTime() < target.getTime()) {
      return NextResponse.json(
        { error: 'Applications are not open yet.' },
        { status: 403 }
      );
    }

    // 2. Parse Form Data
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const rollNumber = (formData.get('rollNumber') as string || '').toUpperCase().trim();
    const year = formData.get('year') as string;
    const section = formData.get('section') as string;
    
    let interestedFields: string[] = [];
    try {
      interestedFields = JSON.parse(formData.get('interestedFields') as string || '[]');
    } catch {
      return NextResponse.json({ error: 'Invalid format for interested fields.' }, { status: 400 });
    }

    const hasPastExperience = formData.get('hasPastExperience') === 'true';
    const pastExperience = formData.get('pastExperience') as string || null;
    
    let previousWorkLinks: string[] = [];
    try {
      previousWorkLinks = JSON.parse(formData.get('previousWorkLinks') as string || '[]');
    } catch {
      return NextResponse.json({ error: 'Invalid format for portfolio links.' }, { status: 400 });
    }

    const reasonForJoining = formData.get('reasonForJoining') as string;
    const contribution = formData.get('contribution') as string;
    const clubKnowledge = formData.get('clubKnowledge') as string;
    const resumeFile = formData.get('resume') as File | null;

    // 3. Schema Validation
    const validationResult = ApplicantSchema.safeParse({
      name,
      rollNumber,
      year,
      section,
      interestedFields,
      hasPastExperience,
      pastExperience,
      previousWorkLinks,
      reasonForJoining,
      contribution,
      clubKnowledge,
    });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map(e => e.message).join(', ');
      return NextResponse.json({ error: `Validation error: ${errorMsg}` }, { status: 400 });
    }

    // 4. Duplicate Check
    const existingApplicant = await db.applicant.findUnique({
      where: { rollNumber },
    });

    if (existingApplicant) {
      return NextResponse.json(
        { error: 'An application has already been submitted using this roll number.' },
        { status: 409 }
      );
    }

    // 5. Handle File Upload (Compulsory PDF)
    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json({ error: 'Resume PDF upload is required.' }, { status: 400 });
    }

    // Validate PDF type
    if (resumeFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Resume must be a PDF file.' }, { status: 400 });
    }

    // Validate File Size
    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Resume file size must not exceed 10MB.' }, { status: 400 });
    }

    // Create storage directory if it doesn't exist
    await fs.mkdir(STORAGE_DIR, { recursive: true });

    // Save file securely
    const fileName = `${crypto.randomUUID()}_${rollNumber}.pdf`;
    const filePath = path.join(STORAGE_DIR, fileName);
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);
    const resumePath = fileName;

    // 6. Transactional sequential Application ID generation
    const result = await db.$transaction(async (tx) => {
      // Fetch next sequence value atomically
      const seqResult = await tx.$queryRawUnsafe<{ nextval: bigint }[]>(
        "SELECT nextval('application_id_seq');"
      );
      
      const nextSeq = Number(seqResult[0].nextval);
      const paddedNum = String(nextSeq).padStart(4, '0');
      const applicationId = `GFG-SVEC-2026-${paddedNum}`;

      // Insert applicant
      return tx.applicant.create({
        data: {
          applicationId,
          name,
          rollNumber,
          year,
          section,
          interestedFields,
          hasPastExperience,
          pastExperience,
          previousWorkLinks,
          reasonForJoining,
          contribution,
          clubKnowledge,
          resumePath,
        },
      });
    });

    return NextResponse.json({
      success: true,
      applicationId: result.applicationId,
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
