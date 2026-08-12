export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { determineApplicantYear, getTodayBoundaries } from '@/lib/attendance-utils';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const adminSession = getAdminFromRequest(req);
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // 2. Parse Query Parameter
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year'); // '2nd' or '3rd'
    
    if (yearParam !== '2nd' && yearParam !== '3rd') {
      return NextResponse.json({ error: 'Invalid year parameter. Use "2nd" or "3rd".' }, { status: 400 });
    }

    const targetYearLabel = yearParam === '2nd' ? '2nd Year' : '3rd Year';

    // 3. Query today's check-ins
    const { start, end } = getTodayBoundaries();
    const checkedInToday = await db.applicant.findMany({
      where: {
        interviewPresented: true,
        attendanceScannedAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        attendanceScannedAt: 'asc', // Ascending order matches chronological arrival time
      },
    });

    // 4. Filter strictly by Option A Year (DB-first) and exclude Unknown/Mismatch
    const filteredList = checkedInToday.filter((app) => {
      return determineApplicantYear(app.year, app.rollNumber) === targetYearLabel;
    });

    // 5. Format rows
    const data = filteredList.map((app, index) => {
      const scanTimeStr = app.attendanceScannedAt
        ? new Date(app.attendanceScannedAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        : 'N/A';

      return {
        'S.No': index + 1,
        'Roll Number': app.rollNumber,
        'Name': app.name,
        'Year': targetYearLabel,
        'Section': app.section,
        'Scan Time': scanTimeStr,
      };
    });

    // Handle empty data case by giving headers
    const exportData = data.length > 0 ? data : [{
      'S.No': 'N/A',
      'Roll Number': 'No records found for today.',
      'Name': '',
      'Year': targetYearLabel,
      'Section': '',
      'Scan Time': '',
    }];

    // 6. Create Excel Workbook using SheetJS
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    // Auto-fit columns
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
      wch: Math.min(Math.max(maxLens[key] + 3, 8), 40),
    }));

    // 7. Write to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Format current date suffix e.g. 2026-08-12
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `GFG_SVEC_${yearParam}_Year_Attendance_${dateStr}.xlsx`;

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export attendance error:', error);
    return NextResponse.json({ error: 'Internal server error exporting attendance.' }, { status: 500 });
  }
}
