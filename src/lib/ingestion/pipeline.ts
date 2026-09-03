
import { supabase } from "@/lib/supabase";
import crypto from "crypto";
import { NormalizedPayload, QueueItem, IngestionSource } from "./types";
import { SourceAdapter } from "./BaseAdapter";

export class IngestionPipeline {
  
  static generateHash(payload: NormalizedPayload): string {
    const hashString = `${payload.sourceUrl}-${payload.title}-${payload.organization || ''}`;
    return crypto.createHash('sha256').update(hashString).digest('hex');
  }

  
    static calculateQualityScore(payload: NormalizedPayload): number {
    let score = 0;
    const type = payload.contentType;
    
    // Universal basics (20 points max)
    if (payload.title && payload.title.length > 5) score += 10;
    if (payload.sourceUrl && this.isValidUrl(payload.sourceUrl)) score += 10;

    // Feed specific scoring (80 points max)
    switch (type) {
      case 'JOB':
        if (payload.organization && payload.organization !== 'Unknown') score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 20;
        if (payload.qualification && payload.qualification.length > 0) score += 10;
        if (payload.vacancy) score += 10;
        break;
      case 'TENDER':
        if (payload.tenderNumber) score += 20;
        if (payload.organization || payload.department) score += 20;
        if (payload.applicationEnd) score += 20; // Closing date
        if (payload.notificationUrl && this.isValidUrl(payload.notificationUrl)) score += 20;
        break;
      case 'ADMISSION':
        if (payload.organization) score += 20; // Institution
        if (payload.course) score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 20;
        break;
      case 'RESULT':
        if (payload.examName || payload.title) score += 20;
        if (payload.organization) score += 20;
        if (payload.resultDate || payload.applicationEnd) score += 20;
        if (payload.applyUrl || payload.notificationUrl) score += 20;
        break;
      case 'ADMIT_CARD':
        if (payload.examName || payload.title) score += 20;
        if (payload.examDate || payload.applicationEnd) score += 20;
        if (payload.releaseDate) score += 20;
        if (payload.applyUrl || payload.notificationUrl) score += 20;
        break;
      case 'SCHOLARSHIP':
        if (payload.scheme || payload.title) score += 20;
        if (payload.eligibility) score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 20;
        break;
      default:
        // Generic fallback
        if (payload.organization) score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl) score += 20;
        if (payload.notificationUrl) score += 20;
    }
    
    // Cap at 100
    return Math.min(score, 100);
  }

  
  static isValidUrl(urlString: string | undefined): boolean {
    if (!urlString) return false;
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

    static async detectDuplicates(payload: NormalizedPayload): Promise<{ score: number, duplicateOf?: string, risk: string, existingRecord?: any, inQueue?: boolean }> {
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
  }

  static calculateChangeDiff(existing: any, incoming: NormalizedPayload): any[] {
    const changes = [];
    
    // Abstract date mapping logic
    let existingDate = existing.last_date || existing.closing_date || existing.application_deadline || existing.result_date;
    const oldDate = existingDate ? new Date(existingDate).toISOString().split('T')[0] : null;
    const newDate = incoming.applicationEnd ? new Date(incoming.applicationEnd).toISOString().split('T')[0] : null;
    if (incoming.applicationEnd && oldDate !== newDate) {
      changes.push({ field: 'deadline_date', old_value: existingDate || 'N/A', new_value: incoming.applicationEnd });
    }

    if (incoming.vacancy && existing.vacancies && existing.vacancies !== incoming.vacancy) {
      changes.push({ field: 'vacancies', old_value: existing.vacancies, new_value: incoming.vacancy });
    }
    
    if (incoming.estimatedValue && existing.estimated_value && existing.estimated_value !== incoming.estimatedValue) {
      changes.push({ field: 'estimated_value', old_value: existing.estimated_value, new_value: incoming.estimatedValue });
    }

    return changes;
  }

  
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
      
      
      // Structure change and drop check
      if (lastRun && lastRun.items_discovered > 10) {
         if (itemsDiscovered === 0) {
             throw new Error("STRUCTURE_CHANGED: Unusual extraction drop detected. Previous run yielded records but current yielded 0.");
         }
         if (itemsDiscovered < (lastRun.items_discovered * 0.3)) {
             throw new Error("EXTRACTION_DROP_WARNING: Extraction suddenly dropped by over 70%.");
         }
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

          // Feed-specific link requirements
          if (normalized.contentType === 'JOB' && !normalized.applyUrl) {
            if (normalized.notificationUrl) {
              validation.warnings.push('MISSING_APPLY_LINK_BUT_HAS_PDF');
            } else {
              validation.warnings.push('MISSING_APPLY_LINK');
              if (finalStatus !== 'LOW_QUALITY') {
                  finalStatus = 'LOW_QUALITY';
                  itemsMissingLink++;
              }
            }
          }
          if (normalized.contentType === 'TENDER' && !normalized.notificationUrl) {
              validation.warnings.push('MISSING_DOCUMENT_LINK');
          }
 else if (!this.isValidUrl(normalized.sourceUrl)) {
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

    // Evaluate Source Health
    try {
      const { data: finalRun } = await supabase.from('ingestion_runs').select('status, run_log').eq('id', runRecord?.id).single();
      const finalStatus = finalRun?.status || 'FAILED';
      
      let newHealth = 'HEALTHY';
      // @ts-ignore
      let consecutiveFailures = source.consecutive_failures || 0;
      
      if (finalStatus === 'SUCCESS') {
         consecutiveFailures = 0;
         if (itemsExtracted > 0 && itemsMissingLink > itemsExtracted * 0.5) {
            newHealth = 'WARNING'; // High missing links
         } else if (itemsExtracted > 0 && itemsInvalidLink > itemsExtracted * 0.5) {
            newHealth = 'WARNING'; // High invalid links
         }
      } else {
         consecutiveFailures++;
         if (consecutiveFailures >= 3) {
            newHealth = 'OFFLINE';
         } else {
            newHealth = 'FAILING';
         }
      }
      
      if (source.is_active === false) {
         newHealth = 'DISABLED';
      }

      const sourceUpdates: any = {
        current_health: newHealth,
        consecutive_failures: consecutiveFailures,
        updated_at: new Date().toISOString()
      };
      
      if (finalStatus === 'SUCCESS') {
         sourceUpdates.last_successful_run = new Date().toISOString();
         sourceUpdates.last_error = null;
      } else {
         sourceUpdates.last_failed_run = new Date().toISOString();
         sourceUpdates.last_error = finalRun?.run_log || 'Unknown error';
      }

      await supabase.from('ingestion_sources').update(sourceUpdates).eq('id', source.id);
    } catch (healthErr) {
       console.error("Failed to update source health", healthErr);
    }

  }

}

