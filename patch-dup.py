import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """              let sameOrg = pNormOrg && eNormOrg && pNormOrg === eNormOrg;
              let sameClosing = normClosing && eClosing && normClosing === eClosing;
              let sameVacancy = payload.vacancy && existing.vacancies && String(payload.vacancy).trim().toLowerCase() === String(existing.vacancies).trim().toLowerCase();
              
              // EXPLICIT RULE: Same Org + Same Last Date + Same Vacancies = EXACT DUPLICATE
              if (sameOrg && sameClosing && sameVacancy && payload.vacancy !== 'Not Specified' && payload.vacancy !== 'Various') {
                 bestMatch = existing; highestScore = 1.0; bestRisk = 'EXACT'; break;
              }
              
              // SIGNAL: Same Advt Number + Same Org (Level 1)"""

content = content.replace(
    "let sameOrg = pNormOrg && eNormOrg && pNormOrg === eNormOrg;\n              \n              // SIGNAL: Same Advt Number + Same Org (Level 1)",
    replacement
)

# Also ensure calculateChangeDiff doesn't trigger a manual queue if ONLY the title changed slightly for an EXACT duplicate.
# Wait, if bestRisk = 'EXACT', changeDiff handles updates. If the user wants it to be treated as a pure duplicate (ignoring title changes), we can just ignore title diffs in this case, but it's fine, the user's main concern is that it's correctly flagged as a duplicate. Let's look at calculateChangeDiff.

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(content)