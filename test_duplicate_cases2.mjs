function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTitle(t) {
  const norm = normalizeString(t);
  const stopwords = ['recruitment', 'vacancy', 'jobs', 'job', 'notification', 'advertisement', 'apply', 'online', 'post', 'of', 'for', 'in', 'and', 'assam'];
  return norm.split(' ').filter(w => !stopwords.includes(w)).join(' ');
}

function normalizeOrg(o) {
  if (!o) return '';
  const norm = normalizeString(o);
  if (norm.includes('national health mission') || norm.includes('nhm')) return 'nhm';
  if (norm.includes('assam public service commission') || norm.includes('apsc')) return 'apsc';
  if (norm.includes('state level police') || norm.includes('slprb') || norm.includes('assam police')) return 'slprb';
  
  const stopwords = ['assam', 'department', 'directorate', 'office', 'mission', 'board', 'commission', 'university', 'national', 'state', 'govt', 'government'];
  return norm.split(' ').filter(w => !stopwords.includes(w)).join(' ');
}

function extractAdvtNo(text) {
  if (!text) return null;
  const match = text.match(/(?:advt\.?\s*no\.?|advertisement\s*no\.?|notification\s*no\.?|reference\s*no\.?|post\s*code)[\s:]*([A-Za-z0-9\-\/]+)/i);
  if (match && match[1]) {
    return match[1].toLowerCase().replace(/[^\w]/g, '');
  }
  return null;
}

function normalizeDate(d) {
  if (!d) return null;
  const parts = d.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (parts) return `${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  try {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  } catch {}
  return null;
}

function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  const set1 = new Set(str1.split(' '));
  const set2 = new Set(str2.split(' '));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function evaluateMatch(payload, existing) {
  const pNormOrg = normalizeOrg(payload.organization);
  const pNormTitle = normalizeTitle(payload.title);
  const pAdvt = extractAdvtNo(payload.title) || extractAdvtNo(payload.notificationUrl);
  
  const eNormOrg = normalizeOrg(existing.organization);
  const eNormTitle = normalizeTitle(existing.title);
  const eAdvt = extractAdvtNo(existing.title) || extractAdvtNo(existing.official_source_url);
  const eClosing = normalizeDate(existing.last_date);
  const normClosing = normalizeDate(payload.applicationEnd);

  let matchScore = 0;
  let matchCount = 0;
  let sameOrg = pNormOrg && eNormOrg && pNormOrg === eNormOrg;

  if (sameOrg && pAdvt && eAdvt && pAdvt === eAdvt) return { score: 1.0, risk: 'EXACT', reason: 'Same Advt + Same Org' };
  
  if (sameOrg) matchCount++;
  if (pAdvt && eAdvt && pAdvt === eAdvt) matchCount++;
  if (normClosing && eClosing && normClosing === eClosing) matchCount++;
  
  const titleSim = calculateSimilarity(pNormTitle, eNormTitle);
  if (titleSim > 0.8) matchCount++;
  else if (titleSim > 0.5) matchCount += 0.5;
  
  if (sameOrg && (matchCount >= 3 || (titleSim > 0.7 && normClosing === eClosing))) matchScore = 0.9;
  else if (sameOrg && titleSim > 0.5) matchScore = 0.7;
  else matchScore = titleSim * 0.5;

  let risk = matchScore >= 0.85 ? 'HIGH' : (matchScore >= 0.65 ? 'POSSIBLE' : 'NONE');
  return { score: matchScore, risk, sim: titleSim };
}

const officialJob = {
  title: "NHM Assam Staff Nurse Recruitment 2026",
  organization: "National Health Mission Assam",
  last_date: "2026-09-25",
  official_source_url: "NHM-HR-2026-45",
  vacancies: "100"
};

console.log("B (Same Advt+Org):", evaluateMatch({ title: "Staff Nurse Vacancy", organization: "NHM Assam", applicationEnd: "2026-10-10", notificationUrl: "NHM-HR-2026-45" }, officialJob));
console.log("C (Same Org+Date+Sim Title):", evaluateMatch({ title: "NHM Staff Nurse Vacancy 2026", organization: "NHM, Assam", applicationEnd: "2026-09-25" }, officialJob));
console.log("D (Same Org+Date+Diff Title):", evaluateMatch({ title: "NHM Medical Officer Recruitment", organization: "NHM Assam", applicationEnd: "2026-09-25" }, officialJob));
console.log("E (Diff Org+Sim Title):", evaluateMatch({ title: "Staff Nurse Recruitment 2026", organization: "Directorate of Health Services", applicationEnd: "2026-09-25" }, officialJob));
