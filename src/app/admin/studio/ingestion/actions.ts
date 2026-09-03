
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
       const updates: any = {};
       
       // Upgrade verification if merging an official source
       if (sourceMeta?.is_official) {
         updates.verification_status = 'VERIFIED';
         updates.official_source_url = payload.sourceUrl;
       }

       if (item.change_diff && item.change_diff.length > 0) {
         item.change_diff.forEach((diff: any) => {
           updates[diff.field] = diff.new_value;
         });
       }
       
       if (Object.keys(updates).length > 0) {
         let targetTable = 'jobs';
         if (item.content_type === 'TENDER') targetTable = 'tenders';
         if (item.content_type === 'ADMISSION') targetTable = 'admissions';
         if (item.content_type === 'RESULT') targetTable = 'results';
         if (item.content_type === 'ADMIT_CARD') targetTable = 'admit_cards';
         if (item.content_type === 'SCHOLARSHIP') targetTable = 'scholarships';
         await supabase.from(targetTable).update(updates).eq('id', targetId);
       }
    }
  } else {
    // INSERT NEW CANONICAL RECORD
    let newRecordId: string;
    
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
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null
      }).select('id').single();
      if (insertErr) throw new Error(insertErr.message);
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
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newTender.id;
    }
    else if (item.content_type === 'ADMISSION') {
      const { data: newAdm, error: insertErr } = await supabase.from('admissions').insert({
        title: payload.title,
        institution: payload.organization || 'Unknown',
        course: payload.course,
        application_deadline: payload.applicationEnd,
        application_link: payload.applyUrl || payload.sourceUrl,
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null,
        status: 'PUBLISHED',
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING'
      }).select('id').single();
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newAdm.id;
    }
    else if (item.content_type === 'RESULT') {
      const { data: newRes, error: insertErr } = await supabase.from('results').insert({
        title: payload.title,
        organization: payload.organization || 'Unknown',
        exam_name: payload.examName,
        result_date: payload.applicationEnd,
        result_url: payload.applyUrl || payload.sourceUrl,
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null,
        status: 'PUBLISHED',
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING'
      }).select('id').single();
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newRes.id;
    }
    else if (item.content_type === 'ADMIT_CARD') {
      const { data: newAc, error: insertErr } = await supabase.from('admit_cards').insert({
        title: payload.title,
        organization: payload.organization || 'Unknown',
        exam_name: payload.examName || null,
        exam_date: payload.examDate || null,
        release_date: payload.releaseDate || null,
        download_url: payload.applyUrl || payload.sourceUrl,
        notification_url: payload.notificationUrl || null,
        status: 'PUBLISHED',
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null
      }).select('id').single();
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newAc.id;
    }
    else if (item.content_type === 'SCHOLARSHIP') {
      const { data: newSch, error: insertErr } = await supabase.from('scholarships').insert({
        title: payload.title,
        organization: payload.organization || 'Unknown',
        scheme: payload.scheme || null,
        amount: payload.amount || null,
        eligibility: payload.qualification || null,
        application_start: payload.applicationStart || null,
        application_deadline: payload.applicationEnd || null,
        application_url: payload.applyUrl || payload.sourceUrl,
        notification_url: payload.notificationUrl || null,
        status: 'PUBLISHED',
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null
      }).select('id').single();
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newSch.id;
    } else {
      throw new Error(`Unsupported content type: ${item.content_type}`);
    }

    // Create initial provenance
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

  // Mark queue item as APPROVED. This retains the change_diff as a permanent audit trail.
  await supabase.from('ingestion_queue').update({ status: 'APPROVED', approved_at: new Date().toISOString() }).eq('id', queueId);
  return { success: true };
}

export async function rejectQueueItemAction(queueId: string) {
  await supabase.from('ingestion_queue').update({ status: 'REJECTED', rejected_at: new Date().toISOString() }).eq('id', queueId);
  return { success: true };
}
