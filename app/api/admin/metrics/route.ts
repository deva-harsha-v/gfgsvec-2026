import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let targetCycleId = searchParams.get('cycleId');

    // If no cycleId passed, target the currently published cycle
    if (!targetCycleId) {
      const activeCycle = await db.recruitmentCycle.findFirst({
        where: { status: 'PUBLISHED' },
      });
      if (activeCycle) {
        targetCycleId = activeCycle.id;
      }
    }

    if (!targetCycleId) {
      return NextResponse.json({
        hasActiveCycle: false,
        stats: {
          totalCount: 0,
          targetCount: 200,
          secondYearCount: 0,
          thirdYearCount: 0,
          todayCount: 0,
          yesterdayCount: 0,
          trendPercentage: 0,
          conversionRate: 0,
          interviewedCount: 0,
          selectedCount: 0,
          rejectedCount: 0,
          underReviewCount: 0,
          newCount: 0,
        },
        domainCounts: {},
        branchCounts: {},
        slotCounts: {},
        slotCapacity: 50,
        recentApplicants: [],
        systemStatus: {
          database: 'HEALTHY',
          databaseEngine: 'Supabase PostgreSQL (PgBouncer Pooled)',
          pingMs: 0,
          totalRecords: 0,
        },
      });
    }

    const startTime = Date.now();
    const cycle = await db.recruitmentCycle.findUnique({
      where: { id: targetCycleId },
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

    const cycleWhere = { cycleId: targetCycleId };

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
      db.applicant.count({ where: cycleWhere }),
      db.applicant.count({ where: { ...cycleWhere, year: '2nd Year' } }),
      db.applicant.count({ where: { ...cycleWhere, year: '3rd Year' } }),
      db.applicant.count({ where: { ...cycleWhere, createdAt: { gte: startOfToday } } }),
      db.applicant.count({
        where: {
          ...cycleWhere,
          createdAt: { gte: startOfYesterday, lt: startOfToday },
        },
      }),
      db.applicant.count({ where: { ...cycleWhere, applicationStatus: 'INTERVIEWED' } }),
      db.applicant.count({ where: { ...cycleWhere, applicationStatus: 'SELECTED' } }),
      db.applicant.count({ where: { ...cycleWhere, applicationStatus: 'REJECTED' } }),
      db.applicant.count({ where: { ...cycleWhere, applicationStatus: 'UNDER_REVIEW' } }),
      db.applicant.count({ where: { ...cycleWhere, applicationStatus: 'NEW' } }),
      db.applicant.findMany({
        where: cycleWhere,
        select: {
          interestedFields: true,
          branch: true,
          interviewSlot: true,
          responses: true,
        },
      }),
      db.applicant.findMany({
        where: cycleWhere,
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

    const domainCounts: Record<string, number> = {};
    const branchCounts: Record<string, number> = {};
    const slotCounts: Record<string, number> = {};

    allApplicants.forEach((app) => {
      // Tally domains from interestedFields array or responses JSON
      const domains = app.interestedFields.length > 0
        ? app.interestedFields
        : Array.isArray((app.responses as any)?.interestedFields)
        ? (app.responses as any).interestedFields
        : [];

      domains.forEach((field: string) => {
        domainCounts[field] = (domainCounts[field] || 0) + 1;
      });

      // Tally branches
      const b = (app.branch || (app.responses as any)?.branch || 'UNSPECIFIED').toUpperCase().trim();
      branchCounts[b] = (branchCounts[b] || 0) + 1;

      // Tally slots
      const slot = app.interviewSlot || (app.responses as any)?.interviewSlot;
      if (slot) {
        slotCounts[slot] = (slotCounts[slot] || 0) + 1;
      }
    });

    const conversionRate = totalCount > 0 ? Math.round(((interviewedCount + selectedCount) / totalCount) * 100) : 0;
    const todayDiff = todayCount - yesterdayCount;
    const trendPercentage = yesterdayCount > 0 ? Math.round((todayDiff / yesterdayCount) * 100) : todayCount > 0 ? 100 : 0;

    return NextResponse.json({
      hasActiveCycle: true,
      cycle,
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
    console.error('Fetch metrics error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
