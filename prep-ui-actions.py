code = """
import { supabase } from "@/lib/supabase";

export async function approveQueueItemAction(queueId: string) {
  // 1. Fetch queue item
  const { data: item, error: fetchErr } = await supabase
    .from('ingestion_queue')
    .select('*')
    .eq('id', queueId)
    .single();

  if (fetchErr || !item) throw new Error("Item not found");

  // 2. Map normalized payload to actual database tables
  const payload = item.normalized_payload;
  
  if (item.content_type === 'JOB' || item.content_type === 'PRIVATE_JOB') {
    const { error: insertErr } = await supabase.from('jobs').insert({
      title: payload.title,
      organization: payload.organization || 'Unknown',
      job_type: item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE',
      category: payload.category || 'OTHER',
      vacancies: payload.vacancy || 'Not Specified',
      district: payload.location || 'Assam',
      last_date: payload.applicationEnd || null,
      apply_link: payload.sourceUrl,
      status: 'PUBLISHED', // Auto-publish because Admin explicitly approved it
      source_name: payload.source
    });
    
    if (insertErr) throw new Error(insertErr.message);
  } else {
    // For Tenders/Admissions/Results etc., they would map to their respective tables.
    // For now, if those tables don't exist yet, we throw or gracefully handle.
    console.warn(`Content type ${item.content_type} mapped to generic handling.`);
  }

  // 3. Mark queue item as APPROVED
  const { error: updateErr } = await supabase
    .from('ingestion_queue')
    .update({ 
      status: 'APPROVED', 
      approved_at: new Date().toISOString() 
    })
    .eq('id', queueId);

  if (updateErr) throw new Error(updateErr.message);
  return { success: true };
}

export async function rejectQueueItemAction(queueId: string) {
  const { error } = await supabase
    .from('ingestion_queue')
    .update({ 
      status: 'REJECTED', 
      rejected_at: new Date().toISOString() 
    })
    .eq('id', queueId);

  if (error) throw new Error(error.message);
  return { success: true };
}
"""
with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(code)
