import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toUpperCase().trim();
    const filter = searchParams.get('filter') || 'All'; // All, NotPresented, Presented, Rated, NotRated
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const skip = (page - 1) * limit;

    // 2. Build Where Conditions
    const where: any = {};

    // Enforce Roll Number search ONLY
    if (search) {
      where.rollNumber = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Apply Quick Filters
    if (filter === 'NotPresented') {
      where.interviewPresented = false;
    } else if (filter === 'Presented') {
      where.interviewPresented = true;
    } else if (filter === 'Rated') {
      where.interviewPresented = true;
      where.interviewRating = { not: null };
    } else if (filter === 'NotRated') {
      where.interviewPresented = true;
      where.interviewRating = null;
    }

    // 3. Query Database
    const [applications, total] = await db.$transaction([
      db.applicant.findMany({
        where,
        orderBy: { applicationId: 'asc' },
        skip,
        take: limit,
      }),
      db.applicant.count({ where }),
    ]);

    // 4. Calculate Aggregate Stats for Dashboard Info (Independent of search/filter)
    const [
      totalCount,
      presentedCount,
      notPresentedCount,
      ratedCount,
      notRatedCount,
      technicalCount,
      nonTechnicalCount,
    ] = await Promise.all([
      db.applicant.count(),
      db.applicant.count({ where: { interviewPresented: true } }),
      db.applicant.count({ where: { interviewPresented: false } }),
      db.applicant.count({ where: { interviewPresented: true, interviewRating: { not: null } } }),
      db.applicant.count({ where: { interviewPresented: true, interviewRating: null } }),
      db.applicant.count({
        where: {
          interestedFields: {
            hasSome: ['Technical', 'Development', 'Coding', 'AI/ML', 'Web Development', 'Competitive Programming'],
          },
        },
      }),
      db.applicant.count({
        where: {
          interestedFields: {
            hasSome: ['Non-Technical', 'Event Management', 'Design', 'Content', 'Social Media', 'Public Relations', 'Marketing', 'Photography/Videography'],
          },
        },
      }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalCount,
        presentedCount,
        notPresentedCount,
        ratedCount,
        notRatedCount,
        technicalCount,
        nonTechnicalCount,
      },
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
