import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const emailParts = adminSession.email.split('@')[0].split(/[._-]/);
    let initials = 'AD';
    if (emailParts.length >= 2) {
      initials = (emailParts[0][0] + emailParts[1][0]).toUpperCase();
    } else if (emailParts[0].length >= 2) {
      initials = emailParts[0].substring(0, 2).toUpperCase();
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: adminSession.id,
        email: adminSession.email,
        initials,
        role: 'ADMIN',
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export const dynamic = 'force-dynamic';
