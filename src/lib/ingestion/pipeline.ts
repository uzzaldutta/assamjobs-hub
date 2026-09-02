
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
    if (payload.organization) score += 20;
    if (payload.sourceUrl) score += 20;
    if (payload.applicationEnd) score += 15;
    if (payload.qualification && payload.qualification.length > 0) score += 10;
    if (payload.description || payload.attachments?.length) score += 15;
    return score;
  }

  static async detectDuplicates(payload: NormalizedPayload): Promise<{ score: number, duplicateOf?: string, risk: string }> {
    // 1. Check if hash exists in queue
    const hash = this.generateHash(payload);
    const { data: exactQueue } = await supabase
      .from('ingestion_queue')
      .select('id, content_hash')
      .eq('content_hash', hash)
      .limit(1);

    if (exactQueue && exactQueue.length > 0) {
      return { score: 1.0, duplicateOf: exactQueue[0].id, risk: 'EXACT' };
    }

    // 2. Check jobs table using RPC if it's a job (Fallback if RPC not created yet)
    if (payload.contentType === 'JOB' || payload.contentType === 'PRIVATE_JOB') {
      try {
        const { data: fuzzy } = await supabase.rpc('check_job_duplicates', {
          p_title: payload.title,
          p_organization: payload.organization || '',
          p_apply_url: payload.sourceUrl || ''
        });

        if (fuzzy && fuzzy.length > 0) {
          const topMatch = fuzzy[0];
          if (topMatch.similarity_score > 0.8 || topMatch.match_type === 'EXACT_URL') {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'HIGH' };
          }
          if (topMatch.similarity_score > 0.6) {
             return { score: topMatch.similarity_score, duplicateOf: topMatch.id, risk: 'POSSIBLE' };
          }
        }
      } catch (err) {
        // RPC might not exist, silently ignore fuzzy matching
        console.warn("RPC check_job_duplicates failed or not found", err);
      }
    }

    return { score: 0, risk: 'NONE' };
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
            continue; // Or push to queue as FAILED
          }
          itemsValidated++;

          const dupCheck = await this.detectDuplicates(normalized);
          if (dupCheck.risk === 'EXACT') {
            duplicates++;
            // We skip identical exact queue items, but we could update them
            continue; 
          }

          const qualityScore = this.calculateQualityScore(normalized);
          const hash = this.generateHash(normalized);
          
          let finalStatus = 'NEW';
          if (dupCheck.risk === 'HIGH') finalStatus = 'DUPLICATE_RISK';
          if (qualityScore < 50) finalStatus = 'LOW_QUALITY';

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
            validation_errors: validation.errors,
            validation_warnings: validation.warnings
          });

        } catch (itemErr) {
          console.error("Item processing error", itemErr);
          errors++;
        }
      }

      // Finalize run
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
