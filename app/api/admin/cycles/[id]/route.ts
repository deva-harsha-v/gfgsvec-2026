import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = params;
    const cycle = await db.recruitmentCycle.findUnique({
      where: { id },
      include: {
        formFields: { orderBy: { order: 'asc' } },
        _count: { select: { applicants: true } },
      },
    });

    if (!cycle) {
      return NextResponse.json({ error: 'Recruitment cycle not found.' }, { status: 404 });
    }

    return NextResponse.json(cycle);
  } catch (error) {
    console.error('Fetch cycle error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      posterImageUrl,
      opensAt,
      closesAt,
      status,
      formFields,
    } = body;

    const existingCycle = await db.recruitmentCycle.findUnique({
      where: { id },
      include: {
        formFields: true,
        _count: { select: { applicants: true } },
      },
    });

    if (!existingCycle) {
      return NextResponse.json({ error: 'Recruitment cycle not found.' }, { status: 404 });
    }

    const applicantCount = existingCycle._count.applicants;

    // Structural Lock Verification if applicants exist
    if (applicantCount > 0 && Array.isArray(formFields)) {
      const existingFieldMap = new Map(existingCycle.formFields.map((f) => [f.fieldKey, f]));
      const newFieldKeys = new Set(formFields.map((f: any) => f.fieldKey));

      // 1. Check for deleted fields
      const existingKeys = Array.from(existingFieldMap.keys());
      for (const key of existingKeys) {
        if (!newFieldKeys.has(key)) {
          return NextResponse.json(
            {
              error: `Structural Edit Locked: Field "${key}" cannot be deleted because this cycle has ${applicantCount} applicant(s).`,
            },
            { status: 409 }
          );
        }
      }

      // 2. Check for option removal on select fields
      for (const newField of formFields) {
        const oldField = existingFieldMap.get(newField.fieldKey);
        if (oldField && (oldField.fieldType === 'SINGLE_SELECT' || oldField.fieldType === 'MULTI_SELECT')) {
          const oldOptions = oldField.options;
          const newOptionSet = new Set(newField.options || []);

          for (const opt of oldOptions) {
            if (!newOptionSet.has(opt)) {
              return NextResponse.json(
                {
                  error: `Structural Edit Locked: Option "${opt}" cannot be removed from field "${oldField.label}" because applicants have already submitted responses.`,
                },
                { status: 409 }
              );
            }
          }
        }
      }
    }

    // Execute atomic update
    const result = await db.$transaction(async (tx) => {
      if (status === 'PUBLISHED' && existingCycle.status !== 'PUBLISHED') {
        // Atomically close any other currently published cycle
        await tx.recruitmentCycle.updateMany({
          where: {
            id: { not: id },
            status: 'PUBLISHED',
          },
          data: { status: 'CLOSED' },
        });
      }

      // Update cycle base info
      const updatedCycle = await tx.recruitmentCycle.update({
        where: { id },
        data: {
          title,
          slug,
          shortDescription,
          fullDescription,
          posterImageUrl,
          opensAt: opensAt ? new Date(opensAt) : undefined,
          closesAt: closesAt ? new Date(closesAt) : undefined,
          status,
        },
      });

      // Upsert dynamic FormFields if provided
      if (Array.isArray(formFields)) {
        for (let idx = 0; idx < formFields.length; idx++) {
          const f = formFields[idx];
          await tx.formField.upsert({
            where: {
              cycleId_fieldKey: {
                cycleId: id,
                fieldKey: f.fieldKey,
              },
            },
            update: {
              label: f.label,
              fieldType: f.fieldType,
              options: f.options || [],
              required: f.required ?? true,
              order: f.order ?? idx + 1,
            },
            create: {
              cycleId: id,
              fieldKey: f.fieldKey,
              label: f.label,
              fieldType: f.fieldType,
              options: f.options || [],
              required: f.required ?? true,
              order: f.order ?? idx + 1,
            },
          });
        }
      }

      return updatedCycle;
    });

    return NextResponse.json({ success: true, cycle: result });
  } catch (error: any) {
    console.error('Update cycle error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = params;
    const cycle = await db.recruitmentCycle.findUnique({
      where: { id },
      include: {
        _count: { select: { applicants: true } },
      },
    });

    if (!cycle) {
      return NextResponse.json({ error: 'Recruitment cycle not found.' }, { status: 404 });
    }

    if (cycle._count.applicants > 0) {
      return NextResponse.json(
        {
          error: `Deletion Blocked: Cycle "${cycle.title}" has ${cycle._count.applicants} submitted applicant(s). Only cycles with 0 applicants can be deleted. Please transition status to ARCHIVED instead.`,
        },
        { status: 409 }
      );
    }

    await db.recruitmentCycle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete cycle error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
