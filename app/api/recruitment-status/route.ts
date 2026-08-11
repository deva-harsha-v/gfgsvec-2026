import { NextResponse } from 'next/server';

const TARGET_UTC_TIME = '2026-08-12T14:00:00.000Z'; // 7:30 PM IST (Asia/Kolkata)

export async function GET() {
  const now = new Date();
  const target = new Date(TARGET_UTC_TIME);
  const isOpen = now.getTime() >= target.getTime();

  return NextResponse.json({
    isOpen,
    serverTime: now.toISOString(),
    targetTime: TARGET_UTC_TIME,
  });
}
export const dynamic = 'force-dynamic';
