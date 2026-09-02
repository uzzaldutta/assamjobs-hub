
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
    if (payload.sourceUrl) score += 20;
    if (payload.applicationEnd) score += 15;
    if (payload.qualification && payload.qualification.length > 0) score += 10;
    if (payload.description || payload.attachments?.length) score += 15;
    return score;
  }

  static async detectDuplicates(payload: NormalizedPayload): Promise<{ score: number, duplicateOf?: string, risk: string, existingRecord?: any, inQueue?: boolean }> {
    // 1. Check if hash exists in queue
    const hash = this.generateHash(payload);
    const { data: exactQueue } = await supabase
      .from('ingestion_queue')
      .select('id, content_hash')
      .eq('content_hash', hash)
      .limit(1);

    if (exactQueue && exactQueue.length > 0) {
      return { score: 1.0, duplicateOf: exactQueue[0].id, risk: 'EXACT', inQueue: true };
    }

    // 2. Exact URL Match in Jobs
    const { data: exactJobs } = await supabase
      .from('jobs')
      .select('id, apply_link, title, vacancies, last_date')
      .eq('apply_link', payload.sourceUrl)
      .limit(1);

    if (exactJobs && exactJobs.length > 0) {
      return { score: 1.0, duplicateOf: exactJobs[0].id, risk: 'EXACT', existingRecord: exactJobs[0] };
    }

    // 2. Fuzzy Title Match using RPC
    if (payload.contentType === 'JOB' || payload.contentType === 'PRIVATE_JOB') {
      try {
        const { data: fuzzy } = await supabase.rpc('check_job_duplicates', {
          p_title: payload.title,
          p_organization: payload.organization || '',
          p_apply_url: payload.sourceUrl || ''
        });

        if (fuzzy && fuzzy.length > 0) {
          const topMatch = fuzzy[0];
          
          // Fetch existing record to allow change detection
          const { data: existing } = await supabase.from('jobs').select('*').eq('id', topMatch.id).single();

          if (topMatch.similarity_score > 0.8 || topMatch.match_type === 'EXACT_URL') {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'HIGH', existingRecord: existing };
          }
          if (topMatch.similarity_score > 0.6) {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'POSSIBLE', existingRecord: existing };
          }
        }
      } catch (err) {
        console.warn("RPC check_job_duplicates failed or not found", err);
      }
    }

    return { score: 0, risk: 'NONE' };
  }

  static calculateChangeDiff(existing: any, incoming: NormalizedPayload): any[] {
    const changes = [];
    
    // Compare Deadline
    const oldDate = existing.last_date ? new Date(existing.last_date).toISOString().split('T')[0] : null;
    const newDate = incoming.applicationEnd ? new Date(incoming.applicationEnd).toISOString().split('T')[0] : null;
    if (incoming.applicationEnd && oldDate !== newDate) {
      changes.push({ field: 'last_date', old_value: existing.last_date || 'N/A', new_value: incoming.applicationEnd });
    }

    // Compare Vacancies
    if (incoming.vacancy && existing.vacancies !== incoming.vacancy) {
      changes.push({ field: 'vacancies', old_value: existing.vacancies || 'N/A', new_value: incoming.vacancy });
    }

    return changes;
  }

  static async processSource(adapter: SourceAdapter): Promise<void> {
    const source = adapter.sourceConfig;
    
    // Create run record
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
          if (!validation.isValid) {
            errors++;
            continue; 
          }
          itemsValidated++;

          const dupCheck = await this.detectDuplicates(normalized);
          
          if (dupCheck.inQueue) {
             duplicates++;
             continue; // Silently skip if already in the queue unchanged
          }
          const qualityScore = this.calculateQualityScore(normalized);
          const hash = this.generateHash(normalized);
          
          let finalStatus = 'NEW';
          if (source.tier > 1 && !source.is_official) finalStatus = 'VERIFICATION_PENDING';
          
          let changeDiff: any[] = [];

          if (dupCheck.risk === 'EXACT' || dupCheck.risk === 'HIGH') {
             // Check if it's a change or just provenance overlap
             if (dupCheck.existingRecord) {
                changeDiff = this.calculateChangeDiff(dupCheck.existingRecord, normalized);
                if (changeDiff.length > 0) {
                   finalStatus = 'CHANGE_DETECTED';
                } else if (source.is_official) {
                   // Provenance mapping - wait for Admin Review to merge
                   finalStatus = 'DUPLICATE_RISK';
                } else {
                   // Exact match, no changes, from secondary source -> Ignore safely
                   duplicates++;
                   continue;
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
