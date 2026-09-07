export function normalizeString(str: string | undefined | null): string {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeTitle(t: string | undefined | null): string {
  const norm = normalizeString(t);
  const stopwords = ['recruitment', 'vacancy', 'jobs', 'job', 'notification', 'advertisement', 'apply', 'online', 'post', 'of', 'for', 'in', 'and'];
  return norm.split(' ').filter(w => !stopwords.includes(w)).join(' ');
}

export function normalizeOrg(o: string | undefined | null): string {
  if (!o) return '';
  const norm = normalizeString(o);
  
  // Create a predictable signature for known orgs
  if (norm.includes('national health mission') || norm.includes('nhm')) return 'nhm';
  if (norm.includes('assam public service commission') || norm.includes('apsc')) return 'apsc';
  if (norm.includes('state level police') || norm.includes('slprb') || norm.includes('assam police')) return 'slprb';
  
  const stopwords = ['assam', 'department', 'directorate', 'office', 'mission', 'board', 'commission', 'university', 'national', 'state', 'govt', 'government'];
  return norm.split(' ').filter(w => !stopwords.includes(w)).join(' ');
}

export function extractAdvtNo(text: string | undefined | null): string | null {
  if (!text) return null;
  const match = text.match(/(?:advt\.?\s*no\.?|advertisement\s*no\.?|notification\s*no\.?|reference\s*no\.?|post\s*code)[\s:]*([A-Za-z0-9\-\/]+)/i);
  if (match && match[1]) {
    return match[1].toLowerCase().replace(/[^\w]/g, '');
  }
  return null;
}

export function normalizeDate(d: string | undefined | null): string | null {
  if (!d) return null;
  // Handle DD/MM/YYYY
  const parts = d.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (parts) {
    return `${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  }
  try {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  } catch {}
  return null;
}

export function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  const set1 = new Set(str1.split(' '));
  const set2 = new Set(str2.split(' '));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size; // Jaccard
}
