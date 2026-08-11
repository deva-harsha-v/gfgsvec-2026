import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { Applicant } from '@prisma/client';
import * as XLSX from 'xlsx';

import { ROLE_DISPLAY_NAMES } from '@/lib/roles';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // 2. Fetch All Candidates from Database
    const applicants = await db.applicant.findMany({
      orderBy: { applicationId: 'asc' },
    });

    // 3. Format Data into Table Rows
    const data = applicants.map((app: any) => {
      let techRatingValue = 'Absent';
      let nonTechRatingValue = 'Absent';
      if (app.interviewPresented) {
        techRatingValue = app.interviewTechnicalRating !== null && app.interviewTechnicalRating !== undefined
          ? `${app.interviewTechnicalRating} Stars`
          : 'Presented (Not Rated)';
        nonTechRatingValue = app.interviewNonTechnicalRating !== null && app.interviewNonTechnicalRating !== undefined
          ? `${app.interviewNonTechnicalRating} Stars`
          : 'Presented (Not Rated)';
      }

      return {
        'Application ID': app.applicationId,
        'Name': app.name,
        'Roll Number': app.rollNumber,
        'Year': app.year,
        'Section': app.section,
        'Interested Fields': app.interestedFields.map((f: string) => ROLE_DISPLAY_NAMES[f] || f).join(', '),
        'Past Experience': app.hasPastExperience ? 'Yes' : 'No',
        'Past Experience Details': app.pastExperience || '',
        'Previous Work / Portfolio Links': app.previousWorkLinks.join(', '),
        'Reason For Joining': app.reasonForJoining,
        'How They Want to Contribute': app.contribution,
        'What They Know About Club': app.clubKnowledge,
        'Resume URL': app.resumePath ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/applications/${app.id}/resume` : 'None',
        'Interview Presented': app.interviewPresented ? 'Presented' : 'Not Presented',
        'Technical Rating': techRatingValue,
        'Non-Technical Rating': nonTechRatingValue,
        'Interview Notes': app.interviewNotes || '',
        'Application Status': app.applicationStatus,
        'Submitted At': app.submittedAt.toISOString(),
      };
    });

    // 4. Create Workbook using SheetJS
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruitment 2026');

    // Set Column Widths for readability
    const maxLens = Object.keys(data[0] || {}).reduce((acc: any, key) => {
      acc[key] = key.length;
      return acc;
    }, {});
    data.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        const valStr = String(row[key]);
        if (valStr.length > maxLens[key]) {
          maxLens[key] = valStr.length;
        }
      });
    });
    worksheet['!cols'] = Object.keys(maxLens).map((key) => ({
      wch: Math.min(Math.max(maxLens[key] + 3, 10), 50), // Cap width between 10 and 50 chars
    }));

    // 5. Generate Excel File Buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 6. Return response
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="GFG_SVEC_HIRING_2026.xlsx"',
      },
    });
  } catch (error) {
    console.error('Export Excel error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
