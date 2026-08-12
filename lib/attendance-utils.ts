/**
 * Normalizes a scanned roll number to match database values.
 * Removes leading/trailing spaces and forces uppercase.
 */
export function normalizeRollNumber(rollNumber: string): string {
  return (rollNumber || '').trim().toUpperCase();
}

/**
 * Dynamically calculates the candidate's year based on Sri Vasavi's B.Tech prefix relative to the current year.
 * Sri Vasavi Engineering College uses 4-year B.Tech formats:
 * - Prefix '23' = Admitted in 2023 -> 3rd Year in 2026.
 * - Prefix '24' = Admitted in 2024 -> 2nd Year in 2026.
 * Formula: academicYear = currentYear - admissionYear.
 */
export function getYearFromRollNumber(rollNumber: string): string {
  const normalized = normalizeRollNumber(rollNumber);
  const rollYearPrefix = parseInt(normalized.substring(0, 2), 10);
  if (!isNaN(rollYearPrefix) && normalized.length >= 8) {
    const currentYear = new Date().getFullYear(); // e.g. 2026
    const admissionYear = 2000 + rollYearPrefix;
    const diff = currentYear - admissionYear;
    if (diff === 2) return "2nd Year";
    if (diff === 3) return "3rd Year";
    if (diff === 4) return "4th Year";
    if (diff === 1) return "1st Year";
  }
  return "Unknown";
}

/**
 * Resolves year using Option A (DB-First):
 * Prioritizes registered DB year, falls back to dynamic roll number prefix calculation.
 */
export function determineApplicantYear(dbYear: string | null | undefined, rollNumber: string): string {
  const cleanDbYear = (dbYear || '').trim();
  if (cleanDbYear === "2nd Year" || cleanDbYear === "3rd Year") {
    return cleanDbYear;
  }
  
  // Fallback to calculation
  const parsed = getYearFromRollNumber(rollNumber);
  if (parsed === "2nd Year" || parsed === "3rd Year") {
    return parsed;
  }
  
  return "Unknown";
}

/**
 * Generates local date boundaries for today's start and end to scope check-ins to the active session.
 */
export function getTodayBoundaries(): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
