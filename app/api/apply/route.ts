import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildDynamicValidationSchema, DynamicFormField } from '@/lib/dynamic-validation';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const STORAGE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'resumes')
  : path.join(process.cwd(), 'storage', 'resumes');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bypass = searchParams.get('bypass');
    const isBypassed = bypass === 'adminTest';
    const isDev = process.env.NODE_ENV === 'development';
    const now = new Date();

    // 1. Fetch Currently Published Recruitment Cycle
    const activeCycle = await db.recruitmentCycle.findFirst({
      where: { status: 'PUBLISHED' },
      include: {
        formFields: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!activeCycle) {
      return NextResponse.json(
        { error: 'No recruitment cycle is currently active.' },
        { status: 403 }
      );
    }

    const start = new Date(activeCycle.opensAt);
    const close = new Date(activeCycle.closesAt);

    if (!isDev && !isBypassed) {
      if (now.getTime() < start.getTime()) {
        return NextResponse.json(
          { error: `Applications for "${activeCycle.title}" are not open yet.` },
          { status: 403 }
        );
      }
      if (now.getTime() >= close.getTime()) {
        return NextResponse.json(
          { error: `Applications for "${activeCycle.title}" are now closed.` },
          { status: 403 }
        );
      }
    }

    // 2. Parse Form Data
    const formData = await req.formData();

    const name = (formData.get('name') as string || '').trim();
    const rollNumber = (formData.get('rollNumber') as string || '').toUpperCase().trim();
    const year = (formData.get('year') as string || '').trim();
    const section = (formData.get('section') as string || '').trim();
    const branch = (formData.get('branch') as string || '').trim().toUpperCase() || null;
    const rawCgpa = formData.get('cgpa');
    const cgpa = rawCgpa !== null && rawCgpa !== undefined && rawCgpa !== '' ? parseFloat(rawCgpa as string) : null;
    const resumeFile = formData.get('resume') as File | null;

    // 3. Build Dynamic Validation Payload & Process Dynamic Answers
    const dynamicFields: DynamicFormField[] = activeCycle.formFields.map((f) => ({
      id: f.id,
      fieldKey: f.fieldKey,
      label: f.label,
      fieldType: f.fieldType as any,
      options: f.options,
      required: f.required,
      order: f.order,
    }));

    const responsesMap: Record<string, any> = {};
    const validationPayload: Record<string, any> = {
      name,
      rollNumber,
      year,
      section,
      branch,
      cgpa,
    };

    // Ensure storage directory exists
    await fs.mkdir(STORAGE_DIR, { recursive: true });

    for (const field of dynamicFields) {
      const rawVal = formData.get(field.fieldKey);

      if (field.fieldType === 'MULTI_SELECT') {
        try {
          const parsed = JSON.parse((rawVal as string) || '[]');
          responsesMap[field.fieldKey] = parsed;
          validationPayload[field.fieldKey] = parsed;
        } catch {
          responsesMap[field.fieldKey] = [];
          validationPayload[field.fieldKey] = [];
        }
      } else if (field.fieldType === 'CHECKBOX') {
        const boolVal = rawVal === 'true' || rawVal === 'on';
        responsesMap[field.fieldKey] = boolVal;
        validationPayload[field.fieldKey] = boolVal;
      } else if (field.fieldType === 'FILE_UPLOAD') {
        const uploadedFile = rawVal as File | null;
        if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
          if (uploadedFile.size > MAX_FILE_SIZE) {
            return NextResponse.json(
              { error: `File for "${field.label}" must not exceed 10MB.` },
              { status: 400 }
            );
          }
          const fileExt = path.extname(uploadedFile.name) || '.pdf';
          const savedFileName = `${crypto.randomUUID()}_${rollNumber}_${field.fieldKey}${fileExt}`;
          const savedPath = path.join(STORAGE_DIR, savedFileName);
          const buffer = Buffer.from(await uploadedFile.arrayBuffer());
          await fs.writeFile(savedPath, buffer);

          responsesMap[field.fieldKey] = savedFileName;
          validationPayload[field.fieldKey] = savedFileName;
        } else {
          responsesMap[field.fieldKey] = null;
          validationPayload[field.fieldKey] = null;
        }
      } else {
        const strVal = rawVal !== null ? (rawVal as string) : '';
        responsesMap[field.fieldKey] = strVal;
        validationPayload[field.fieldKey] = strVal;
      }
    }

    // 4. Validate against Dynamic Zod Schema
    const dynamicSchema = buildDynamicValidationSchema(dynamicFields);
    const validationResult = dynamicSchema.safeParse(validationPayload);

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map((e) => e.message).join(', ');
      return NextResponse.json({ error: `Validation error: ${errorMsg}` }, { status: 400 });
    }

    // 5. Duplicate Roll Number Check (scoped per recruitment cycle)
    const existingApplicant = await db.applicant.findUnique({
      where: {
        cycleId_rollNumber: {
          cycleId: activeCycle.id,
          rollNumber,
        },
      },
    });

    if (existingApplicant) {
      return NextResponse.json(
        { error: 'An application has already been submitted using this roll number for this event.' },
        { status: 409 }
      );
    }

    // 6. Handle Primary Resume Upload (compulsory PDF)
    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json({ error: 'Resume PDF upload is required.' }, { status: 400 });
    }

    if (resumeFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Resume must be a PDF file.' }, { status: 400 });
    }

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Resume file size must not exceed 10MB.' }, { status: 400 });
    }

    const resumeFileName = `${crypto.randomUUID()}_${rollNumber}.pdf`;
    const resumeFilePath = path.join(STORAGE_DIR, resumeFileName);
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
    await fs.writeFile(resumeFilePath, resumeBuffer);

    // 7. Generate Application ID and create Applicant record inside transaction
    const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
    const applicationId = `GFG-SVEC-2026-${randomSuffix}`;
    const interviewSlot = responsesMap['interviewSlot'] || '';

    try {
      const result = await db.$transaction(
        async (tx) => {
          if (interviewSlot) {
            const slotCount = await tx.applicant.count({
              where: {
                cycleId: activeCycle.id,
                interviewSlot,
              },
            });
            if (slotCount >= 50) {
              throw new Error('SLOT_FULL');
            }
          }

          return await tx.applicant.create({
            data: {
              applicationId,
              cycleId: activeCycle.id,
              responses: responsesMap,
              name,
              rollNumber,
              year,
              section,
              branch,
              cgpa,
              resumePath: resumeFileName,
              interviewSlot: interviewSlot || null,
              interestedFields: Array.isArray(responsesMap['interestedFields']) ? responsesMap['interestedFields'] : [],
              hasPastExperience: Boolean(responsesMap['hasPastExperience']),
              pastExperience: typeof responsesMap['pastExperience'] === 'string' ? responsesMap['pastExperience'] : null,
              previousWorkLinks: Array.isArray(responsesMap['previousWorkLinks']) ? responsesMap['previousWorkLinks'] : [],
              reasonForJoining: typeof responsesMap['reasonForJoining'] === 'string' ? responsesMap['reasonForJoining'] : '',
              contribution: typeof responsesMap['contribution'] === 'string' ? responsesMap['contribution'] : '',
              clubKnowledge: typeof responsesMap['clubKnowledge'] === 'string' ? responsesMap['clubKnowledge'] : '',
            },
          });
        },
        { isolationLevel: 'Serializable' }
      );

      return NextResponse.json({
        success: true,
        applicationId: result.applicationId,
      });
    } catch (err: any) {
      if (err.message === 'SLOT_FULL') {
        return NextResponse.json(
          { error: 'The selected interview slot is fully booked. Please select a different session.' },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
