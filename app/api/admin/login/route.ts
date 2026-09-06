import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken, getAdminTokenName } from '@/lib/auth';
import { AdminLoginSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not defined on server.');
      return NextResponse.json({ error: 'Database environment variables not configured on Vercel.' }, { status: 500 });
    }

    const body = await req.json();
    const validation = AdminLoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input fields.' }, { status: 400 });
    }

    const { email, password } = validation.data;

    const admin = await db.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = signToken({ id: admin.id, email: admin.email });
    const isProduction = process.env.NODE_ENV === 'production';
    
    const response = NextResponse.json({ success: true, message: 'Login successful' });
    
    response.cookies.set(getAdminTokenName(), token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error.' }, { status: 500 });
  }
}
