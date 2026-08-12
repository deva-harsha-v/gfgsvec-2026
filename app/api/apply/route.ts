import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApplicantSchema } from '@/lib/schemas';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const START_UTC_TIME = '2026-08-12T13:30:00.000Z'; // 7:00 PM IST (Asia/Kolkata)
const CLOSE_UTC_TIME = '2026-08-12T16:30:00.000Z'; // 10:00 PM IST (Asia/Kolkata)
const STORAGE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'resumes')
  : path.join(process.cwd(), 'storage', 'resumes');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    // 1. Time Check (with dev/admin bypass)
    const { searchParams } = new URL(req.url);
    const bypass = searchParams.get('bypass');
    const isBypassed = bypass === 'adminTest';
    const now = new Date();
    const start = new Date(START_UTC_TIME);
    const close = new Date(CLOSE_UTC_TIME);
    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev && !isBypassed) {
      if (now.getTime() < start.getTime()) {
        return NextResponse.json(
          { error: 'Applications are not open yet.' },
          { status: 403 }
        );
      }
      if (now.getTime() >= close.getTime()) {
        return NextResponse.json(
          { error: 'Applications are now closed.' },
          { status: 403 }
        );
      }
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
    const interviewSlot = formData.get('interviewSlot') as string || '';
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
      interviewSlot,
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
    let nextSeq: number;
    try {
      const seqResult = await db.$queryRawUnsafe<{ nextval: bigint }[]>(
        "SELECT nextval('application_id_seq');"
      );
      nextSeq = Number(seqResult[0].nextval);
    } catch (err: any) {
      // If sequence doesn't exist, create it dynamically and retry nextval
      if (err.message?.includes('relation "application_id_seq" does not exist') || err.code === 'P2010') {
        await db.$executeRawUnsafe(
          "CREATE SEQUENCE IF NOT EXISTS application_id_seq START WITH 5;"
        );
        const seqResult = await db.$queryRawUnsafe<{ nextval: bigint }[]>(
          "SELECT nextval('application_id_seq');"
        );
        nextSeq = Number(seqResult[0].nextval);
      } else {
        throw err;
      }
    }

    const paddedNum = String(nextSeq).padStart(4, '0');
    const applicationId = `GFG-SVEC-2026-${paddedNum}`;

    // Insert applicant in a transaction with Serializable isolation level to guarantee slot limit is strictly obeyed under high concurrency
    try {
      const result = await db.$transaction(async (tx) => {
        // A. Verify the interview slot is not full (limit 50)
        if (interviewSlot) {
          const slotCount = await tx.applicant.count({
            where: { interviewSlot }
          });
          if (slotCount >= 50) {
            throw new Error('SLOT_FULL');
          }
        }

        // B. Create candidate record
        return await tx.applicant.create({
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
            interviewSlot,
            reasonForJoining,
            contribution,
            clubKnowledge,
            resumePath,
          },
        });
      }, {
        isolationLevel: 'Serializable'
      });

      return NextResponse.json({
        success: true,
        applicationId: result.applicationId,
      });
    } catch (err: any) {
      if (err.message === 'SLOT_FULL') {
        return NextResponse.json(
          { error: 'The selected interview slot is fully booked. Please select a different session.' },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
