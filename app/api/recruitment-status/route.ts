import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const now = new Date();
  const isDev = process.env.NODE_ENV === 'development';

  // Fetch the currently published recruitment cycle
  const activeCycle = await db.recruitmentCycle.findFirst({
    where: { status: 'PUBLISHED' },
    include: {
      formFields: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!activeCycle) {
    return NextResponse.json({
      hasActiveCycle: false,
      isOpen: false,
      isClosed: false,
      message: 'No recruitment cycle is currently active.',
      serverTime: now.toISOString(),
    });
  }

  const start = new Date(activeCycle.opensAt);
  const close = new Date(activeCycle.closesAt);

  let isOpen = false;
  let isClosed = false;

  if (isDev) {
    isOpen = true;
    isClosed = false;
  } else {
    isOpen = now.getTime() >= start.getTime() && now.getTime() < close.getTime();
    isClosed = now.getTime() >= close.getTime();
  }

  // Calculate slot counts for candidates under this active cycle
  const slotCountsMap: Record<string, number> = {};

  try {
    const counts = await db.applicant.groupBy({
      by: ['interviewSlot'],
      where: { cycleId: activeCycle.id },
      _count: {
        interviewSlot: true,
      },
    });

    counts.forEach((c) => {
      if (c.interviewSlot) {
        slotCountsMap[c.interviewSlot] = c._count.interviewSlot;
      }
    });
  } catch (error) {
    console.error('Error fetching slot counts for active cycle:', error);
  }

  return NextResponse.json({
    hasActiveCycle: true,
    cycle: {
      id: activeCycle.id,
      title: activeCycle.title,
      status: activeCycle.status,
      opensAt: activeCycle.opensAt,
      closesAt: activeCycle.closesAt,
    },
    isOpen,
    isClosed,
    serverTime: now.toISOString(),
    startTime: activeCycle.opensAt.toISOString(),
    closeTime: activeCycle.closesAt.toISOString(),
    slotCounts: slotCountsMap,
  });
}

export const dynamic = 'force-dynamic';
