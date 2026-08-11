import { NextRequest, NextResponse } from 'next/server';
import { getAdminTokenName } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Set expired cookie to clear it
  response.cookies.set(getAdminTokenName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
