import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { normalizeRollNumber, determineApplicantYear, getTodayBoundaries } from '@/lib/attendance-utils';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { rollNumber, session } = await req.json();
    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number is required.' }, { status: 400 });
    }

    const normalizedRoll = normalizeRollNumber(rollNumber);

    // 1.5 Fetch candidate profile first to verify registration slot
    const applicant = await db.applicant.findUnique({
      where: { rollNumber: normalizedRoll },
    });

    if (!applicant) {
      return NextResponse.json({ error: `Roll number ${normalizedRoll} is not registered.` }, { status: 404 });
    }

    // Verify session match to prevent overlaps
    if (session && applicant.interviewSlot !== session) {
      return NextResponse.json({ 
        error: `This student is registered for "${applicant.interviewSlot || 'No Slot'}", not the selected "${session}" slot.`
      }, { status: 400 });
    }

    // 2. Atomic Database Update (prevents race conditions)
    const scanTime = new Date();
    const updateResult = await db.applicant.updateMany({
      where: {
        rollNumber: normalizedRoll,
        interviewPresented: false,
        ...(session ? { interviewSlot: session } : {}),
      },
      data: {
        interviewPresented: true,
        attendanceScannedAt: scanTime,
      },
    });

    const resolvedYear = determineApplicantYear(applicant.year, applicant.rollNumber);

    if (updateResult.count === 1) {
      return NextResponse.json({
        success: true,
        status: 'checked_in',
        isNew: true,
        applicant: {
          id: applicant.id,
          applicationId: applicant.applicationId,
          name: applicant.name,
          rollNumber: applicant.rollNumber,
          year: resolvedYear,
          section: applicant.section,
          scannedAt: scanTime.toISOString(),
        },
      });
    }

    // 3. Candidate already checked in
    return NextResponse.json({
      success: true,
      status: 'already_checked_in',
      isNew: false,
      applicant: {
        id: applicant.id,
        applicationId: applicant.applicationId,
        name: applicant.name,
        rollNumber: applicant.rollNumber,
        year: resolvedYear,
        section: applicant.section,
        scannedAt: applicant.attendanceScannedAt ? applicant.attendanceScannedAt.toISOString() : null,
      },
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal server error during check-in.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // 2. Parse session parameter and query check-ins
    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session'); // e.g. "13th August - Forenoon Session"

    const whereClause: any = {
      interviewPresented: true,
    };
    if (session) {
      whereClause.interviewSlot = session;
    } else {
      const { start, end } = getTodayBoundaries();
      whereClause.attendanceScannedAt = {
        gte: start,
        lte: end,
      };
    }

    const checkedInToday = await db.applicant.findMany({
      where: whereClause,
      orderBy: {
        attendanceScannedAt: 'desc',
      },
    });

    // 3. Group by Option A (DB-First) Year Determination
    const secondYear: any[] = [];
    const thirdYear: any[] = [];
    const unknown: any[] = [];

    for (const app of checkedInToday) {
      const resolvedYear = determineApplicantYear(app.year, app.rollNumber);
      const appData = {
        id: app.id,
        applicationId: app.applicationId,
        name: app.name,
        rollNumber: app.rollNumber,
        section: app.section,
        scannedAt: app.attendanceScannedAt ? app.attendanceScannedAt.toISOString() : null,
      };

      if (resolvedYear === '2nd Year') {
        secondYear.push(appData);
      } else if (resolvedYear === '3rd Year') {
        thirdYear.push(appData);
      } else {
        unknown.push({ ...appData, rawYear: app.year });
      }
    }

    return NextResponse.json({
      secondYear,
      thirdYear,
      unknown,
    });

  } catch (error) {
    console.error('Fetch attendance error:', error);
    return NextResponse.json({ error: 'Internal server error fetching attendance list.' }, { status: 500 });
  }
}
