import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import * as XLSX from 'xlsx';
import { ROLE_DISPLAY_NAMES } from '@/lib/roles';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const day = searchParams.get('day'); // '13th' or '14th'

    if (day !== '13th' && day !== '14th') {
      return NextResponse.json({ error: 'Invalid day parameter. Use "13th" or "14th".' }, { status: 400 });
    }

    const slotPrefix = day === '13th' ? '13th August' : '14th August';

    // 2. Fetch reviewed/presented candidates for this specific day
    const applicants = await db.applicant.findMany({
      where: {
        interviewSlot: {
          startsWith: slotPrefix,
        },
        OR: [
          { interviewPresented: true },
          { interviewTechnicalRating: { not: null } },
          { interviewNonTechnicalRating: { not: null } },
          { interviewNotes: { not: null } },
        ]
      },
      orderBy: { applicationId: 'asc' },
    });

    // 3. Format rows
    const data = applicants.map((app: any, index: number) => {
      let techRatingValue = 'Not Rated';
      let nonTechRatingValue = 'Not Rated';
      
      if (app.interviewTechnicalRating !== null && app.interviewTechnicalRating !== undefined) {
        techRatingValue = `${app.interviewTechnicalRating} Stars`;
      }
      if (app.interviewNonTechnicalRating !== null && app.interviewNonTechnicalRating !== undefined) {
        nonTechRatingValue = `${app.interviewNonTechnicalRating} Stars`;
      }

      return {
        'S.No': index + 1,
        'Application ID': app.applicationId,
        'Roll Number': app.rollNumber,
        'Name': app.name,
        'Year': app.year,
        'Section': app.section,
        'Interview Slot': app.interviewSlot || 'N/A',
        'Interested Fields': app.interestedFields.map((f: string) => ROLE_DISPLAY_NAMES[f] || f).join(', '),
        'Technical Rating': techRatingValue,
        'Non-Technical Rating': nonTechRatingValue,
        'Interview Notes': app.interviewNotes || '',
        'Application Status': app.applicationStatus,
      };
    });

    // Handle empty data case
    const exportData = data.length > 0 ? data : [{
      'S.No': 'N/A',
      'Application ID': 'No reviewed applicants found for this day.',
      'Roll Number': '',
      'Name': '',
      'Year': '',
      'Section': '',
      'Interview Slot': '',
      'Interested Fields': '',
      'Technical Rating': '',
      'Non-Technical Rating': '',
      'Interview Notes': '',
      'Application Status': '',
    }];

    // 4. Create Workbook using SheetJS
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Reviewed_${day}`);

    // Set Column Widths for readability
    const maxLens = Object.keys(exportData[0] || {}).reduce((acc: any, key) => {
      acc[key] = key.length;
      return acc;
    }, {});
    exportData.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        const valStr = String(row[key]);
        if (valStr.length > maxLens[key]) {
          maxLens[key] = valStr.length;
        }
      });
    });
    worksheet['!cols'] = Object.keys(maxLens).map((key) => ({
      wch: Math.min(Math.max(maxLens[key] + 3, 8), 50),
    }));

    // 5. Generate Excel File Buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 6. Return response
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="GFG_SVEC_Reviewed_${day}_August.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export Reviewed error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
