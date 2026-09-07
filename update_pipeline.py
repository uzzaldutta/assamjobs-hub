import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "duplicate-matcher" not in content:
    content = content.replace(
        'import { SourceAdapter } from "./BaseAdapter";',
        'import { SourceAdapter } from "./BaseAdapter";\nimport { normalizeTitle, normalizeOrg, extractAdvtNo, normalizeDate, calculateSimilarity } from "./duplicate-matcher";'
    )

new_detect_duplicates = """  static async detectDuplicates(payload: NormalizedPayload): Promise<{ score: number, duplicateOf?: string, risk: string, existingRecord?: any, inQueue?: boolean }> {
    const hash = this.generateHash(payload);
    
    // 1. Check ingestion queue for exact hash (prevents queue spam)
    const { data: exactQueue } = await supabase
      .from('ingestion_queue')
      .select('id, content_hash')
      .eq('content_hash', hash)
      .limit(1);

    if (exactQueue && exactQueue.length > 0) {
      return { score: 1.0, duplicateOf: exactQueue[0].id, risk: 'EXACT', inQueue: true };
    }

    // Dynamic table routing for canonical check
    let targetTable = 'jobs';
    let applyCol: string | null = 'apply_url';
    let officialCol = 'official_source_url';
    
    if (payload.contentType === 'TENDER') { targetTable = 'tenders'; applyCol = null; }
    else if (payload.contentType === 'ADMISSION') { targetTable = 'admissions'; applyCol = 'application_link'; }
    else if (payload.contentType === 'RESULT') { targetTable = 'results'; applyCol = 'result_url'; }
    else if (payload.contentType === 'ADMIT_CARD') { targetTable = 'admit_cards'; applyCol = 'download_url'; }
    else if (payload.contentType === 'SCHOLARSHIP') { targetTable = 'scholarships'; applyCol = 'application_url'; }

    // LEVEL 1 - DEFINITE DUPLICATE
    // Exact Action URL Match
    if (applyCol && payload.applyUrl) {
      const { data: exactApply } = await supabase.from(targetTable).select('*').eq(applyCol, payload.applyUrl).limit(1);
      if (exactApply && exactApply.length > 0) return { score: 1.0, duplicateOf: exactApply[0].id, risk: 'EXACT', existingRecord: exactApply[0] };
    }

    // Exact Official Source URL Match
    if (payload.notificationUrl) {
       const { data: exactOfficial } = await supabase.from(targetTable).select('*').eq(officialCol, payload.notificationUrl).limit(1);
       if (exactOfficial && exactOfficial.length > 0) return { score: 1.0, duplicateOf: exactOfficial[0].id, risk: 'EXACT', existingRecord: exactOfficial[0] };
    }

    // Exact Identifier Match (Tender Number)
    if (payload.contentType === 'TENDER' && payload.tenderNumber) {
        const { data: exactTender } = await supabase.from('tenders').select('*').eq('tender_number', payload.tenderNumber).limit(1);
        if (exactTender && exactTender.length > 0) return { score: 1.0, duplicateOf: exactTender[0].id, risk: 'EXACT', existingRecord: exactTender[0] };
    }

    // ADVANCED MULTI-SIGNAL DUPLICATE MATCHING (Levels 1-4)
    if (payload.contentType === 'JOB' || payload.contentType === 'PRIVATE_JOB') {
      try {
        // Fetch candidates: via RPC fuzzy match OR by same organization to evaluate manually
        const candidatesMap = new Map();
        
        // 1. Fetch via Postgres Trigram RPC
        const { data: fuzzy } = await supabase.rpc('check_job_duplicates', {
          p_title: payload.title,
          p_organization: payload.organization || '',
          p_apply_url: payload.applyUrl || ''
        });
        if (fuzzy && fuzzy.length > 0) {
           for (const f of fuzzy) candidatesMap.set(f.id, true);
        }
        
        // 2. Fetch by closing date to catch similar titles
        const normClosing = normalizeDate(payload.applicationEnd);
        if (normClosing) {
           const { data: dateMatch } = await supabase.from('jobs').select('id').eq('last_date', normClosing).limit(10);
           if (dateMatch) dateMatch.forEach(d => candidatesMap.set(d.id, true));
        }

        if (candidatesMap.size > 0) {
          const candidateIds = Array.from(candidatesMap.keys());
          const { data: existingJobs } = await supabase.from('jobs').select('*').in('id', candidateIds);
          
          if (existingJobs && existingJobs.length > 0) {
            
            const pNormOrg = normalizeOrg(payload.organization);
            const pNormTitle = normalizeTitle(payload.title);
            const pAdvt = extractAdvtNo(payload.title) || extractAdvtNo(payload.notificationUrl);
            
            let bestMatch = null;
            let highestScore = 0;
            let bestRisk = 'NONE';

            for (const existing of existingJobs) {
              const eNormOrg = normalizeOrg(existing.organization);
              const eNormTitle = normalizeTitle(existing.title);
              const eAdvt = extractAdvtNo(existing.title) || extractAdvtNo(existing.official_source_url);
              const eClosing = normalizeDate(existing.last_date);
              
              let matchScore = 0;
              let matchCount = 0;
              let sameOrg = pNormOrg && eNormOrg && pNormOrg === eNormOrg;
              
              // SIGNAL: Same Advt Number + Same Org (Level 1)
              if (sameOrg && pAdvt && eAdvt && pAdvt === eAdvt) {
                 bestMatch = existing; highestScore = 1.0; bestRisk = 'EXACT'; break;
              }
              
              if (sameOrg) matchCount++;
              if (pAdvt && eAdvt && pAdvt === eAdvt) matchCount++;
              if (normClosing && eClosing && normClosing === eClosing) matchCount++;
              
              const titleSim = calculateSimilarity(pNormTitle, eNormTitle);
              if (titleSim > 0.8) matchCount++;
              else if (titleSim > 0.5) matchCount += 0.5;
              
              if (payload.vacancy && existing.vacancies === payload.vacancy) matchCount++;
              
              // LEVEL 2: Very High Confidence (Score > 0.85)
              // Requires multiple strong signals
              if (sameOrg && (matchCount >= 3 || (titleSim > 0.7 && normClosing === eClosing))) {
                 matchScore = 0.9;
              } 
              // LEVEL 3: Medium Confidence (Score > 0.65)
              else if (sameOrg && titleSim > 0.5) {
                 matchScore = 0.7;
              }
              // LEVEL 4: Low Confidence (treat as new)
              else {
                 matchScore = titleSim * 0.5; // low score
              }

              if (matchScore > highestScore) {
                 highestScore = matchScore;
                 bestMatch = existing;
                 bestRisk = highestScore >= 0.85 ? 'HIGH' : (highestScore >= 0.65 ? 'POSSIBLE' : 'NONE');
              }
            }

            if (bestMatch && highestScore >= 0.65) {
               return { score: highestScore, duplicateOf: bestMatch.id, risk: bestRisk, existingRecord: bestMatch };
            }
          }
        }
      } catch (err) { console.error("Error in multi-signal matching:", err); }
    }

    return { score: 0, risk: 'NONE' };
  }"""

# Replace existing detectDuplicates
pattern = re.compile(r"static async detectDuplicates\(.*?\).*?return { score: 0, risk: 'NONE' };\s*}", re.DOTALL)
content = pattern.sub(new_detect_duplicates, content)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Pipeline updated.")
