import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const cycles = await db.recruitmentCycle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        formFields: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { applicants: true },
        },
      },
    });

    return NextResponse.json(cycles);
  } catch (error) {
    console.error('Fetch recruitment cycles error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      posterImageUrl,
      opensAt,
      closesAt,
      status = 'DRAFT',
      formFields = [],
    } = body;

    if (!title || !slug || !shortDescription || !opensAt || !closesAt) {
      return NextResponse.json(
        { error: 'Title, slug, short description, opening and closing dates are required.' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await db.recruitmentCycle.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'An event or recruitment cycle with this URL slug already exists.' },
        { status: 409 }
      );
    }

    const openDate = new Date(opensAt);
    const closeDate = new Date(closesAt);

    // Atomically create cycle and enforce single active published cycle
    const result = await db.$transaction(async (tx) => {
      if (status === 'PUBLISHED') {
        // Atomically close any currently published cycle
        await tx.recruitmentCycle.updateMany({
          where: { status: 'PUBLISHED' },
          data: { status: 'CLOSED' },
        });
      }

      const cycle = await tx.recruitmentCycle.create({
        data: {
          title,
          slug,
          shortDescription,
          fullDescription: fullDescription || shortDescription,
          posterImageUrl: posterImageUrl || null,
          status,
          opensAt: openDate,
          closesAt: closeDate,
          formFields: {
            create: formFields.map((f: any, idx: number) => ({
              label: f.label,
              fieldKey: f.fieldKey,
              fieldType: f.fieldType,
              options: f.options || [],
              required: f.required ?? true,
              order: f.order ?? idx + 1,
            })),
          },
        },
        include: {
          formFields: { orderBy: { order: 'asc' } },
        },
      });

      return cycle;
    });

    return NextResponse.json({ success: true, cycle: result });
  } catch (error: any) {
    console.error('Create recruitment cycle error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
