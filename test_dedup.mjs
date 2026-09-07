// Logic to test
function normalizeTitle(t) {
  if(!t) return "";
  return t.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(recruitment|vacancy|jobs?|notification|advertisement|apply|online|post|of|for|in|and)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeOrg(o) {
  if(!o) return "";
  return o.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(assam|department|directorate|office|mission|board|commission|university|national|state)\b/gi, '')
    .replace(/\s+/g, '')
    .trim();
}

function extractAdvtNo(text) {
  if(!text) return null;
  // Match standard advt number patterns
  const match = text.match(/(?:advt\.?\s*no\.?|advertisement\s*no\.?|notification\s*no\.?|reference\s*no\.?|post\s*code)[\s:]*([A-Za-z0-9\-\/]+)/i);
  if (match && match[1]) {
    return match[1].toLowerCase().replace(/[^\w]/g, '');
  }
  return null;
}

function normalizeDate(d) {
  if(!d) return null;
  try {
    const parsed = new Date(d);
    if(isNaN(parsed)) return null;
    return parsed.toISOString().split('T')[0];
  } catch { return null; }
}

console.log(normalizeTitle("NHM Assam Staff Nurse Recruitment 2026"));
console.log(normalizeTitle("NHM Staff Nurse Vacancy 2026"));

console.log(normalizeOrg("National Health Mission Assam"));
console.log(normalizeOrg("NHM Assam"));
console.log(normalizeOrg("NHM, Assam"));

console.log(extractAdvtNo("Advt. No. NHM/HR/2026/45"));
console.log(extractAdvtNo("Advertisement No: NHM-HR-2026-45"));

console.log(normalizeDate("25 September 2026"));
console.log(normalizeDate("25/09/2026"));
console.log(normalizeDate("2026-09-25"));

