import { normalizeTitle, normalizeOrg, extractAdvtNo, normalizeDate, calculateSimilarity } from "./src/lib/ingestion/duplicate-matcher.js";

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

// Case B
console.log("B:", evaluateMatch({ title: "Staff Nurse Vacancy", organization: "NHM Assam", applicationEnd: "2026-10-10", notificationUrl: "NHM-HR-2026-45" }, officialJob));
// Case C
console.log("C:", evaluateMatch({ title: "NHM Staff Nurse Vacancy 2026", organization: "NHM, Assam", applicationEnd: "2026-09-25" }, officialJob));
// Case D
console.log("D:", evaluateMatch({ title: "NHM Medical Officer Recruitment", organization: "NHM Assam", applicationEnd: "2026-09-25" }, officialJob));
// Case E
console.log("E:", evaluateMatch({ title: "Staff Nurse Recruitment 2026", organization: "Directorate of Health Services", applicationEnd: "2026-09-25" }, officialJob));

