import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest, verifyPassword, hashPassword } from '@/lib/auth';
import { ChangePasswordSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // 2. Parse and Validate Request
    const body = await req.json();
    const validation = ChangePasswordSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.issues.map(e => e.message).join(', ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { currentPassword, newPassword } = validation.data;

    // 3. Fetch Admin from Database
    const admin = await db.admin.findUnique({
      where: { id: adminSession.id },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    // 4. Verify Current Password
    const isMatch = await verifyPassword(currentPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    // 5. Hash & Save New Password
    const hashedNewPassword = await hashPassword(newPassword);
    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
