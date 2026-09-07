import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function approveAll() {
  const { data: queueItems } = await supabase.from('ingestion_queue').select('*').eq('status', 'NEW');
  if (!queueItems || queueItems.length === 0) {
    console.log("No items to approve"); return;
  }

  console.log(`Found ${queueItems.length} items to approve`);

  for (const item of queueItems) {
    try {
      const payload = item.normalized_payload;
      const { data: sourceMeta } = await supabase.from('ingestion_sources').select('*').eq('id', item.source_id).single();
      
      let newRecordId;
      
      if (item.content_type === 'JOB' || item.content_type === 'PRIVATE_JOB') {
        const { data: newJob, error: insertErr } = await supabase.from('jobs').insert({
          title: payload.title,
          organization: payload.organization || 'Unknown',
          job_type: item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE',
          category: payload.category || 'OTHER',
          vacancies: payload.vacancy || 'Not Specified',
          district: payload.location || 'Assam',
          last_date: payload.applicationEnd || null,
          apply_url: payload.applyUrl || payload.sourceUrl,
          official_pdf_url: payload.notificationUrl || null,
          status: 'PUBLISHED', 
          verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',
          official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null,
          scraped_at: new Date().toISOString()
        }).select('id').single();
        if (insertErr) throw insertErr;
        newRecordId = newJob.id;
      } 
      else if (item.content_type === 'TENDER') {
        const { data: newTender, error: insertErr } = await supabase.from('tenders').insert({
          title: payload.title,
          organization: payload.organization || 'Unknown',
          department: payload.department,
          tender_number: payload.tenderNumber,
          estimated_value: payload.estimatedValue,
          closing_date: payload.applicationEnd,
          official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null,
          status: 'PUBLISHED',
          verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING'
        }).select('id').single();
        if (insertErr) throw insertErr;
        newRecordId = newTender.id;
      }
      else if (item.content_type === 'RESULT') {
        const { data: newRes, error: insertErr } = await supabase.from('results').insert({
          title: payload.title,
          organization: payload.organization || 'Unknown',
          exam_name: payload.examName,
          result_date: payload.resultDate || null,
          result_url: payload.applyUrl || payload.notificationUrl || payload.sourceUrl,
          status: 'PUBLISHED',
          verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',
          official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null
        }).select('id').single();
        if (insertErr) throw insertErr;
        newRecordId = newRes.id;
      }

      if (newRecordId) {
        await supabase.from('job_provenance').insert({
          canonical_id: newRecordId,
          content_type: item.content_type,
          source_name: sourceMeta?.source_name || payload.source,
          source_url: payload.sourceUrl,
          source_tier: sourceMeta?.tier || 2,
          is_official: sourceMeta?.is_official || false,
          content_hash: item.content_hash
        });
      }
      
      await supabase.from('ingestion_queue').update({ status: 'APPROVED', approved_at: new Date().toISOString() }).eq('id', item.id);
      console.log(`Approved ${item.content_type}: ${payload.title}`);
    } catch (e) {
      console.error("Failed", e.message);
    }
  }
}
approveAll();
