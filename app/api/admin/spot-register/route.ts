import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { normalizeRollNumber } from '@/lib/attendance-utils';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { name, rollNumber, year, section, interviewSlot } = await req.json();

    if (!name || !rollNumber || !year || !section || !interviewSlot) {
      return NextResponse.json({ error: 'All fields (Name, Roll Number, Year, Section, Slot) are required.' }, { status: 400 });
    }

    const normalizedRoll = normalizeRollNumber(rollNumber);

    // 2. Check if applicant already exists
    const existing = await db.applicant.findUnique({
      where: { rollNumber: normalizedRoll },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Roll number ${normalizedRoll} is already registered.` },
        { status: 409 }
      );
    }

    // 3. Generate Application ID from database sequence
    let nextSeq: number;
    try {
      const seqResult = await db.$queryRawUnsafe<{ nextval: bigint }[]>(
        "SELECT nextval('application_id_seq');"
      );
      nextSeq = Number(seqResult[0].nextval);
    } catch (err: any) {
      // Create sequence if missing
      await db.$executeRawUnsafe("CREATE SEQUENCE IF NOT EXISTS application_id_seq START WITH 1;");
      const seqResult = await db.$queryRawUnsafe<{ nextval: bigint }[]>(
        "SELECT nextval('application_id_seq');"
      );
      nextSeq = Number(seqResult[0].nextval);
    }

    const padNum = String(nextSeq).padStart(4, '0');
    const newApplicationId = `GFG-SVEC-2026-${padNum}`;

    // 4. Create and automatically check-in candidate
    const scanTime = new Date();
    const applicant = await db.applicant.create({
      data: {
        applicationId: newApplicationId,
        name: name.trim(),
        rollNumber: normalizedRoll,
        year,
        section: section.toUpperCase().trim(),
        interviewSlot,
        interestedFields: [],
        hasPastExperience: false,
        pastExperience: 'Spot Registered Candidate',
        previousWorkLinks: [],
        reasonForJoining: 'Spot registration at the desk',
        contribution: 'Spot registration at the desk',
        clubKnowledge: 'Spot registration at the desk',
        resumePath: null,
        interviewPresented: true,
        attendanceScannedAt: scanTime,
        applicationStatus: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      applicant: {
        id: applicant.id,
        applicationId: applicant.applicationId,
        name: applicant.name,
        rollNumber: applicant.rollNumber,
        year: applicant.year,
        section: applicant.section,
        scannedAt: scanTime.toISOString(),
      },
    });

  } catch (error) {
    console.error('Spot registration error:', error);
    return NextResponse.json({ error: 'Internal server error during spot registration.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
