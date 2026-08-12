import { NextResponse } from 'next/server';

const START_UTC_TIME = '2026-08-12T03:30:00.000Z'; // 9:00 AM IST (Asia/Kolkata)
const CLOSE_UTC_TIME = '2026-08-12T18:00:00.000Z'; // 11:30 PM IST (Asia/Kolkata)

export async function GET() {
  const now = new Date();
  const start = new Date(START_UTC_TIME);
  const close = new Date(CLOSE_UTC_TIME);

  const isDev = process.env.NODE_ENV === 'development';

  let isOpen = false;
  let isClosed = false;

  if (isDev) {
    // In local development, recruitment is always active for testing
    isOpen = true;
    isClosed = false;
  } else {
    isOpen = now.getTime() >= start.getTime() && now.getTime() < close.getTime();
    isClosed = now.getTime() >= close.getTime();
  }

  return NextResponse.json({
    isOpen,
    isClosed,
    serverTime: now.toISOString(),
    startTime: START_UTC_TIME,
    closeTime: CLOSE_UTC_TIME,
  });
}
export const dynamic = 'force-dynamic';
