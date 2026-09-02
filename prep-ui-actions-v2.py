code = """
import { supabase } from "@/lib/supabase";

export async function approveQueueItemAction(queueId: string) {
  const { data: item, error: fetchErr } = await supabase
    .from('ingestion_queue')
    .select('*, ingestion_sources(source_name, tier, is_official)')
    .eq('id', queueId)
    .single();

  if (fetchErr || !item) throw new Error("Item not found");
  const payload = item.normalized_payload;
  const sourceMeta = item.ingestion_sources;

  if (item.status === 'CHANGE_DETECTED' || item.duplicate_of) {
    // MERGE OR UPDATE EXISTING
    const targetId = item.duplicate_of;
    if (targetId) {
       // Update job provenance
       await supabase.from('job_provenance').insert({
         canonical_id: targetId,
         content_type: item.content_type,
         source_name: sourceMeta?.source_name || payload.source,
         source_url: payload.sourceUrl,
         source_tier: sourceMeta?.tier || 2,
         is_official: sourceMeta?.is_official || false,
         content_hash: item.content_hash
       });

       // Apply diffs to actual job if it was a CHANGE_DETECTED
       if (item.change_diff && item.change_diff.length > 0) {
         const updates: any = {};
         item.change_diff.forEach((diff: any) => {
           updates[diff.field] = diff.new_value;
         });
         await supabase.from('jobs').update(updates).eq('id', targetId);
       }
    }
  } else {
    // INSERT NEW CANONICAL RECORD
    if (item.content_type === 'JOB' || item.content_type === 'PRIVATE_JOB') {
      const { data: newJob, error: insertErr } = await supabase.from('jobs').insert({
        title: payload.title,
        organization: payload.organization || 'Unknown',
        job_type: item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE',
        category: payload.category || 'OTHER',
        vacancies: payload.vacancy || 'Not Specified',
        district: payload.location || 'Assam',
        last_date: payload.applicationEnd || null,
        apply_link: payload.sourceUrl,
        status: 'PUBLISHED', 
        source_name: payload.source,
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null
      }).select('id').single();
      
      if (insertErr) throw new Error(insertErr.message);

      // Create initial provenance
      await supabase.from('job_provenance').insert({
        canonical_id: newJob.id,
        content_type: item.content_type,
        source_name: sourceMeta?.source_name || payload.source,
        source_url: payload.sourceUrl,
        source_tier: sourceMeta?.tier || 2,
        is_official: sourceMeta?.is_official || false,
        content_hash: item.content_hash
      });
    }
  }

  // Mark queue item as APPROVED
  await supabase.from('ingestion_queue').update({ status: 'APPROVED', approved_at: new Date().toISOString() }).eq('id', queueId);
  return { success: true };
}

export async function rejectQueueItemAction(queueId: string) {
  await supabase.from('ingestion_queue').update({ status: 'REJECTED', rejected_at: new Date().toISOString() }).eq('id', queueId);
  return { success: true };
}
"""
with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(code)
