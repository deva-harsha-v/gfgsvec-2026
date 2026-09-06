import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const startTime = Date.now();

    // Calculate Today and Yesterday boundaries in UTC / IST
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalCount,
      secondYearCount,
      thirdYearCount,
      todayCount,
      yesterdayCount,
      interviewedCount,
      selectedCount,
      rejectedCount,
      underReviewCount,
      newCount,
      allApplicants,
      recentApplicants,
    ] = await Promise.all([
      db.applicant.count(),
      db.applicant.count({ where: { year: '2nd Year' } }),
      db.applicant.count({ where: { year: '3rd Year' } }),
      db.applicant.count({ where: { createdAt: { gte: startOfToday } } }),
      db.applicant.count({
        where: {
          createdAt: { gte: startOfYesterday, lt: startOfToday },
        },
      }),
      db.applicant.count({ where: { applicationStatus: 'INTERVIEWED' } }),
      db.applicant.count({ where: { applicationStatus: 'SELECTED' } }),
      db.applicant.count({ where: { applicationStatus: 'REJECTED' } }),
      db.applicant.count({ where: { applicationStatus: 'UNDER_REVIEW' } }),
      db.applicant.count({ where: { applicationStatus: 'NEW' } }),
      db.applicant.findMany({
        select: {
          interestedFields: true,
          branch: true,
          interviewSlot: true,
        },
      }),
      db.applicant.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          applicationId: true,
          name: true,
          rollNumber: true,
          year: true,
          branch: true,
          section: true,
          interestedFields: true,
          applicationStatus: true,
          createdAt: true,
        },
      }),
    ]);

    const pingDuration = Date.now() - startTime;

    // Domain Breakdown
    const domainCounts: Record<string, number> = {
      DIGITAL_DEVELOPMENT: 0,
      COMPETITIVE_PROGRAMMING: 0,
      DESIGN: 0,
      SOCIAL_MEDIA_MARKETING: 0,
      PUBLIC_RELATIONS_OUTREACH: 0,
      EVENT_MANAGEMENT: 0,
      PHOTOGRAPHY_VIDEOGRAPHY: 0,
    };

    // Branch Breakdown
    const branchCounts: Record<string, number> = {};

    // Slot Counts
    const slotCounts: Record<string, number> = {
      '13th August - Forenoon Session': 0,
      '13th August - Afternoon Session': 0,
      '14th August - Forenoon Session': 0,
      '14th August - Afternoon Session': 0,
    };

    allApplicants.forEach((app) => {
      // Domain tally
      app.interestedFields.forEach((field) => {
        domainCounts[field] = (domainCounts[field] || 0) + 1;
      });

      // Branch tally
      if (app.branch) {
        const b = app.branch.toUpperCase().trim();
        branchCounts[b] = (branchCounts[b] || 0) + 1;
      } else {
        branchCounts['UNSPECIFIED'] = (branchCounts['UNSPECIFIED'] || 0) + 1;
      }

      // Slot tally
      if (app.interviewSlot && slotCounts[app.interviewSlot] !== undefined) {
        slotCounts[app.interviewSlot] += 1;
      }
    });

    const conversionRate = totalCount > 0 ? Math.round(((interviewedCount + selectedCount) / totalCount) * 100) : 0;
    const todayDiff = todayCount - yesterdayCount;
    const trendPercentage = yesterdayCount > 0 ? Math.round((todayDiff / yesterdayCount) * 100) : todayCount > 0 ? 100 : 0;

    return NextResponse.json({
      stats: {
        totalCount,
        targetCount: 200,
        secondYearCount,
        thirdYearCount,
        todayCount,
        yesterdayCount,
        trendPercentage,
        conversionRate,
        interviewedCount,
        selectedCount,
        rejectedCount,
        underReviewCount,
        newCount,
      },
      domainCounts,
      branchCounts,
      slotCounts,
      slotCapacity: 50,
      recentApplicants,
      systemStatus: {
        database: 'HEALTHY',
        databaseEngine: 'Supabase PostgreSQL (PgBouncer Pooled)',
        pingMs: pingDuration,
        totalRecords: totalCount,
      },
    });
  } catch (error) {
    console.error('Fetch dashboard metrics error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
