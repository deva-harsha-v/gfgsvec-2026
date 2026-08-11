import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = params;

    // 2. Retrieve Applicant
    const applicant = await db.applicant.findUnique({
      where: { id },
    });

    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found.' }, { status: 404 });
    }

    if (!applicant.resumePath) {
      return NextResponse.json({ error: 'No resume uploaded for this applicant.' }, { status: 404 });
    }

    // 3. Resolve private path
    const storageDir = process.env.VERCEL
      ? path.join('/tmp', 'resumes')
      : path.join(process.cwd(), 'storage', 'resumes');
    const filePath = path.join(storageDir, applicant.resumePath);

    try {
      // Check if file exists
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'Resume file not found on storage server.' }, { status: 404 });
    }

    // 4. Stream private file
    const fileBuffer = await fs.readFile(filePath);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${applicant.name}_Resume.pdf"`,
      },
    });
  } catch (error) {
    console.error('Download resume error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
