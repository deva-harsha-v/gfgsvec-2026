import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { EvaluationSchema } from '@/lib/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = params;

    // 2. Fetch applicant
    const applicant = await db.applicant.findUnique({
      where: { id },
    });

    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found.' }, { status: 404 });
    }

    return NextResponse.json(applicant);
  } catch (error) {
    console.error('Fetch applicant detail error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // 2. Schema Validation
    const validation = EvaluationSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map(e => e.message).join(', ');
      return NextResponse.json({ error: `Validation error: ${errorMsg}` }, { status: 400 });
    }

    const { interviewPresented, interviewRating, interviewNotes, applicationStatus } = validation.data;

    // 3. Strict Rating/Presented Constraint Logic
    let ratingToSave: number | null = null;
    if (interviewPresented) {
      // Must be null or a valid number between 1 and 5
      if (interviewRating !== undefined && interviewRating !== null) {
        if (interviewRating < 1 || interviewRating > 5) {
          return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
        }
        ratingToSave = interviewRating;
      }
    } else {
      // If not presented, rating MUST be null
      ratingToSave = null;
    }

    // 4. Update Database
    const updatedApplicant = await db.applicant.update({
      where: { id },
      data: {
        interviewPresented,
        interviewRating: ratingToSave,
        interviewNotes,
        applicationStatus,
      },
    });

    return NextResponse.json({
      success: true,
      applicant: updatedApplicant,
    });
  } catch (error) {
    console.error('Update evaluation error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
