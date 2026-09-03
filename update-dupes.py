import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

dup_logic = """  static async detectDuplicates(payload: NormalizedPayload): Promise<{ score: number, duplicateOf?: string, risk: string, existingRecord?: any, inQueue?: boolean }> {
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
    let applyCol = 'apply_url';
    let officialCol = 'official_source_url';
    
    if (payload.contentType === 'TENDER') { targetTable = 'tenders'; applyCol = null; }
    else if (payload.contentType === 'ADMISSION') { targetTable = 'admissions'; applyCol = 'application_link'; }
    else if (payload.contentType === 'RESULT') { targetTable = 'results'; applyCol = 'result_url'; }
    else if (payload.contentType === 'ADMIT_CARD') { targetTable = 'admit_cards'; applyCol = 'download_url'; }
    else if (payload.contentType === 'SCHOLARSHIP') { targetTable = 'scholarships'; applyCol = 'application_url'; }

    // 2. Exact Action URL Match
    if (applyCol && payload.applyUrl) {
      const { data: exactApply } = await supabase.from(targetTable).select('*').eq(applyCol, payload.applyUrl).limit(1);
      if (exactApply && exactApply.length > 0) return { score: 1.0, duplicateOf: exactApply[0].id, risk: 'EXACT', existingRecord: exactApply[0] };
    }

    // 3. Exact Official Source URL Match
    if (payload.notificationUrl) {
       // Often official_source_url is the notification/PDF
       const { data: exactOfficial } = await supabase.from(targetTable).select('*').eq(officialCol, payload.notificationUrl).limit(1);
       if (exactOfficial && exactOfficial.length > 0) return { score: 1.0, duplicateOf: exactOfficial[0].id, risk: 'EXACT', existingRecord: exactOfficial[0] };
    }

    // 4. Stable Identifiers (High Priority)
    if (payload.contentType === 'TENDER' && payload.tenderNumber) {
        const { data: exactTender } = await supabase.from('tenders').select('*').eq('tender_number', payload.tenderNumber).limit(1);
        if (exactTender && exactTender.length > 0) return { score: 1.0, duplicateOf: exactTender[0].id, risk: 'EXACT', existingRecord: exactTender[0] };
    }

    // 5. Fuzzy Title/Org Match (Only for jobs right now via RPC, or generic JS check)
    if (payload.contentType === 'JOB') {
      try {
        const { data: fuzzy } = await supabase.rpc('check_job_duplicates', {
          p_title: payload.title,
          p_organization: payload.organization || '',
          p_apply_url: payload.applyUrl || ''
        });

        if (fuzzy && fuzzy.length > 0) {
          const topMatch = fuzzy[0];
          const { data: existing } = await supabase.from('jobs').select('*').eq('id', topMatch.id).single();
          if (topMatch.similarity_score > 0.85 || topMatch.match_type === 'EXACT_URL') {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'HIGH', existingRecord: existing };
          }
          if (topMatch.similarity_score > 0.65) {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'POSSIBLE', existingRecord: existing };
          }
        }
      } catch (err) { }
    }

    return { score: 0, risk: 'NONE' };
  }"""

content = re.sub(
    r'static async detectDuplicates\(payload: NormalizedPayload\)[\s\S]*?return \{ score: 0, risk: \'NONE\' \};\s*\}',
    dup_logic,
    content
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
