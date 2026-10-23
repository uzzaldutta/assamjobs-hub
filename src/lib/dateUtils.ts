/**
 * Safe date parsing and formatting utility for AssamJobsHub
 * Prevents Next.js Server Component RangeError crashes from scraped date formats
 */

export function parseFlexibleDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const str = String(dateStr).trim();
  if (!str) return null;

  // 1. Clean ordinal suffixes: "29th" -> "29", "1st" -> "1", "2nd" -> "2", "3rd" -> "3"
  const cleaned = str.replace(/(\d+)(st|nd|rd|th)/gi, '$1');

  // 2. Try DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (ddmmyyyy) {
    const d = new Date(Number(ddmmyyyy[3]), Number(ddmmyyyy[2]) - 1, Number(ddmmyyyy[1]));
    if (!isNaN(d.getTime())) return d;
  }

  // 3. Try standard Date parse
  try {
    const parsed = new Date(cleaned);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch {}

  return null;
}

export function formatSafeDate(
  dateStr: string | null | undefined, 
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
): string {
  if (!dateStr) return 'Not Specified';
  const d = parseFlexibleDate(dateStr);
  if (d) {
    try {
      return d.toLocaleDateString('en-IN', options);
    } catch {}
  }
  // Return the raw text if date can't be parsed, but never crash
  return String(dateStr);
}

export function toSafeISOString(dateStr: string | null | undefined): string | undefined {
  const d = parseFlexibleDate(dateStr);
  if (!d) return undefined;
  try {
    return d.toISOString();
  } catch {
    return undefined;
  }
}

export function calculateDaysLeft(dateStr: string | null | undefined): { daysLeft: number | null; state: 'ACTIVE' | 'CLOSING_SOON' | 'CLOSED' } {
  const end = parseFlexibleDate(dateStr);
  if (!end) return { daysLeft: null, state: 'ACTIVE' };
  
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 3600 * 24));
  
  if (daysLeft < 0) return { daysLeft, state: 'CLOSED' };
  if (daysLeft <= 7) return { daysLeft, state: 'CLOSING_SOON' };
  return { daysLeft, state: 'ACTIVE' };
}
