
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
    if (payload.title && payload.title.length > 5) score += 20;
    if (payload.organization && payload.organization !== 'Unknown') score += 20;
    if (payload.sourceUrl && this.isValidUrl(payload.sourceUrl)) score += 10;
    if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 10;
    if (payload.notificationUrl && this.isValidUrl(payload.notificationUrl)) score += 10;
    if (payload.applicationEnd) score += 15;
    if (payload.qualification && payload.qualification.length > 0) score += 10;
    if (payload.description || payload.attachments?.length) score += 5;
    return score;
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
    let urlCol = 'apply_url';
    
    if (payload.contentType === 'TENDER') { targetTable = 'tenders'; urlCol = 'official_source_url'; }
    else if (payload.contentType === 'ADMISSION') { targetTable = 'admissions'; urlCol = 'application_link'; }
    else if (payload.contentType === 'RESULT') { targetTable = 'results'; urlCol = 'result_url'; }

    const { data: exactCanonical } = await supabase
      .from(targetTable)
      .select('*')
      .eq(urlCol, payload.sourceUrl)
      .limit(1);

    if (exactCanonical && exactCanonical.length > 0) {
      return { score: 1.0, duplicateOf: exactCanonical[0].id, risk: 'EXACT', existingRecord: exactCanonical[0] };
    }

    // Fuzzy Check fallback if no exact URL (for Jobs)
    if (payload.contentType === 'JOB' || payload.contentType === 'PRIVATE_JOB') {
      try {
        const { data: fuzzy } = await supabase.rpc('check_job_duplicates', {
          p_title: payload.title,
          p_organization: payload.organization || '',
          p_apply_url: payload.sourceUrl || ''
        });

        if (fuzzy && fuzzy.length > 0) {
          const topMatch = fuzzy[0];
          const { data: existing } = await supabase.from('jobs').select('*').eq('id', topMatch.id).single();
          if (topMatch.similarity_score > 0.8 || topMatch.match_type === 'EXACT_URL') {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'HIGH', existingRecord: existing };
          }
          if (topMatch.similarity_score > 0.6) {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'POSSIBLE', existingRecord: existing };
          }
        }
      } catch (err) {
        // RPC might not exist or fail, graceful degradation
      }
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
    
    const { data: runRecord } = await supabase.from('ingestion_runs').insert({
      source_id: source.id,
      status: 'RUNNING'
    }).select('id').single();

    let itemsDiscovered = 0;
    let itemsValidated = 0;
    let duplicates = 0;
    let errors = 0;

    try {
      const rawItems = await adapter.discover();
      itemsDiscovered = rawItems.length;

      for (const raw of rawItems) {
        try {
          const fetched = await adapter.fetch(raw);
          const extracted = await adapter.extract(fetched);
          const normalized = await adapter.normalize(extracted);
          
          const validation = adapter.validate(normalized);
          
          let finalStatus = 'NEW';
          if (source.tier > 1 && !source.is_official) finalStatus = 'VERIFICATION_PENDING';
          
          if (!normalized.sourceUrl) {
            validation.errors.push('MISSING_LINK');
            finalStatus = 'LOW_QUALITY';
          } else if (!this.isValidUrl(normalized.sourceUrl)) {
            validation.errors.push('INVALID_LINK');
            finalStatus = 'LOW_QUALITY';
          }

          if (!validation.isValid) {
            errors++;
            finalStatus = 'FAILED';
            // Do not continue, we still want to log it if it's not a complete failure, wait, no, hard fails skip queue
            // Actually, requirements: "Send it to ingestion queue for review" if it's missing link
            // We will let it proceed but marked as LOW_QUALITY or FAILED in queue
          }
          itemsValidated++;

          const dupCheck = await this.detectDuplicates(normalized);
          if (dupCheck.inQueue) {
             duplicates++;
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
                } else if (source.is_official && dupCheck.existingRecord.verification_status !== 'VERIFIED') {
                   finalStatus = 'DUPLICATE_RISK'; // Needs official verification override
                } else {
                   duplicates++;
                   continue; // Exact match, no changes, ignore safely
                }
             } else {
                finalStatus = 'DUPLICATE_RISK';
             }
          } else if (dupCheck.risk === 'POSSIBLE') {
             finalStatus = 'POSSIBLE_MATCH';
          }

          if (qualityScore < 50 && finalStatus !== 'CHANGE_DETECTED') {
             finalStatus = 'LOW_QUALITY';
          }

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
          items_validated: itemsValidated,
          duplicates_found: duplicates,
          errors_encountered: errors
        }).eq('id', runRecord.id);
      }

    } catch (runErr: any) {
      console.error(`Source ${source.source_name} failed:`, runErr);
      if (runRecord) {
        await supabase.from('ingestion_runs').update({
          status: 'FAILED',
          finished_at: new Date().toISOString(),
          run_log: runErr.message
        }).eq('id', runRecord.id);
      }
    }
  }
}
