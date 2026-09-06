import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const POSTER_STORAGE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'posters')
  : path.join(process.cwd(), 'storage', 'posters');

const MAX_POSTER_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

export async function POST(req: NextRequest) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('poster') as File | null;

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'No poster image file provided.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WEBP, and SVG images are allowed for event posters.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_POSTER_SIZE) {
      return NextResponse.json(
        { error: 'Poster image file size must not exceed 5MB.' },
        { status: 400 }
      );
    }

    await fs.mkdir(POSTER_STORAGE_DIR, { recursive: true });

    const ext = path.extname(file.name) || '.png';
    const fileName = `poster_${crypto.randomUUID()}${ext}`;
    const filePath = path.join(POSTER_STORAGE_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const posterUrl = `/storage/posters/${fileName}`;

    return NextResponse.json({
      success: true,
      posterUrl,
      fileName,
    });
  } catch (error: any) {
    console.error('Poster upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload poster image.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
