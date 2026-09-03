import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace processSource
replacement = """
  static async processSource(adapter: SourceAdapter): Promise<void> {
    const source = adapter.sourceConfig;
    
    // Check previous run for unusual drop logic
    const { data: lastRun } = await supabase
      .from('ingestion_runs')
      .select('items_discovered')
      .eq('source_id', source.id)
      .eq('status', 'SUCCESS')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    const { data: runRecord } = await supabase.from('ingestion_runs').insert({
      source_id: source.id,
      status: 'RUNNING'
    }).select('id').single();

    let itemsDiscovered = 0;
    let itemsExtracted = 0;
    let itemsValidated = 0;
    let itemsNew = 0;
    let itemsDuplicate = 0;
    let itemsChanged = 0;
    let itemsMissingLink = 0;
    let itemsInvalidLink = 0;
    let itemsLowQuality = 0;
    let errors = 0;
    let warnings = 0;

    try {
      const rawItems = await adapter.discover();
      itemsDiscovered = rawItems.length;
      
      // Structure change check
      if (itemsDiscovered === 0 && lastRun && lastRun.items_discovered > 10) {
         throw new Error("STRUCTURE_CHANGED: Unusual extraction drop detected. Previous run yielded records but current yielded 0.");
      }

      for (const raw of rawItems) {
        try {
          const fetched = await adapter.fetch(raw);
          const extracted = await adapter.extract(fetched);
          itemsExtracted++;
          
          const normalized = await adapter.normalize(extracted);
          const validation = adapter.validate(normalized);
          
          let finalStatus = 'NEW';
          if (source.tier > 1 && !source.is_official) finalStatus = 'VERIFICATION_PENDING';
          
          if (!normalized.sourceUrl) {
            validation.errors.push('MISSING_LINK');
            itemsMissingLink++;
            finalStatus = 'LOW_QUALITY';
          } else if (!this.isValidUrl(normalized.sourceUrl)) {
            validation.errors.push('INVALID_LINK');
            itemsInvalidLink++;
            finalStatus = 'LOW_QUALITY';
          }

          if (!validation.isValid) {
            errors++;
            finalStatus = 'FAILED';
          } else {
            itemsValidated++;
          }

          const dupCheck = await this.detectDuplicates(normalized);
          if (dupCheck.inQueue) {
             itemsDuplicate++;
             continue; // Silently skip unchanged queue duplicates
          }

          const qualityScore = this.calculateQualityScore(normalized);
          const hash = this.generateHash(normalized);
          let changeDiff: any[] = [];

          if (dupCheck.risk === 'EXACT' || dupCheck.risk === 'HIGH') {
             if (dupCheck.existingRecord) {
                changeDiff = this.calculateChangeDiff(dupCheck.existingRecord, normalized);
                if (changeDiff.length > 0) {
                   finalStatus = 'CHANGE_DETECTED';
                   itemsChanged++;
                } else if (source.is_official && dupCheck.existingRecord.verification_status !== 'VERIFIED') {
                   finalStatus = 'DUPLICATE_RISK';
                   itemsDuplicate++;
                } else {
                   itemsDuplicate++;
                   continue; // Exact match, no changes, ignore safely
                }
             } else {
                finalStatus = 'DUPLICATE_RISK';
                itemsDuplicate++;
             }
          } else if (dupCheck.risk === 'POSSIBLE') {
             finalStatus = 'POSSIBLE_MATCH';
             itemsDuplicate++;
          }

          if (qualityScore < 50 && finalStatus !== 'CHANGE_DETECTED' && finalStatus !== 'FAILED') {
             finalStatus = 'LOW_QUALITY';
             itemsLowQuality++;
          }
          
          if (finalStatus === 'NEW' || finalStatus === 'VERIFICATION_PENDING') {
             itemsNew++;
          }

          if (validation.warnings.length > 0) warnings += validation.warnings.length;

          await supabase.from('ingestion_queue').insert({
            source_id: source.id,
            content_type: normalized.contentType,
            external_id: normalized.externalId,
            source_url: normalized.sourceUrl,
            title: normalized.title,
            normalized_payload: normalized,
            raw_payload: extracted,
            content_hash: hash,
            status: finalStatus,
            quality_score: qualityScore,
            duplicate_score: dupCheck.score,
            duplicate_of: dupCheck.duplicateOf,
            change_diff: changeDiff.length > 0 ? changeDiff : null,
            validation_errors: validation.errors,
            validation_warnings: validation.warnings
          });

        } catch (itemErr) {
          console.error("Item processing error", itemErr);
          errors++;
        }
      }

      if (runRecord) {
        await supabase.from('ingestion_runs').update({
          status: 'SUCCESS',
          finished_at: new Date().toISOString(),
          items_discovered: itemsDiscovered,
          items_extracted: itemsExtracted,
          items_validated: itemsValidated,
          items_new: itemsNew,
          items_duplicate: itemsDuplicate,
          items_changed: itemsChanged,
          items_missing_link: itemsMissingLink,
          items_invalid_link: itemsInvalidLink,
          items_low_quality: itemsLowQuality,
          warnings_encountered: warnings,
          duplicates_found: itemsDuplicate,
          errors_encountered: errors
        }).eq('id', runRecord.id);
      }

    } catch (runErr: any) {
      console.error(`Source ${source.source_name} failed:`, runErr);
      if (runRecord) {
        const isStructureChange = runErr.message.includes("STRUCTURE_CHANGED");
        await supabase.from('ingestion_runs').update({
          status: isStructureChange ? 'STRUCTURE_CHANGED' : 'FAILED',
          finished_at: new Date().toISOString(),
          run_log: runErr.message,
          items_discovered: itemsDiscovered
        }).eq('id', runRecord.id);
      }
    }
  }
"""

content = re.sub(
    r'static async processSource\(adapter: SourceAdapter\): Promise<void> \{[\s\S]*\}\s*\}',
    replacement + "\n}",
    content
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
