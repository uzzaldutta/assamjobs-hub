import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the INSERT NEW CANONICAL RECORD block
new_routing = """
    // INSERT NEW CANONICAL RECORD
    let newRecordId: string;
    
    if (item.content_type === 'JOB' || item.content_type === 'PRIVATE_JOB') {
      const { data: newJob, error: insertErr } = await supabase.from('jobs').insert({
        title: payload.title,
        organization: payload.organization || 'Unknown',
        job_type: item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE',
        category: payload.category || 'OTHER',
        vacancies: payload.vacancy || 'Not Specified',
        location: payload.location || 'Assam',
        last_date: payload.applicationEnd || null,
        apply_url: payload.sourceUrl, // apply_link is sometimes named apply_url in other files, let's use official
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
        application_link: payload.sourceUrl,
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
        result_url: payload.sourceUrl,
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null,
        status: 'PUBLISHED',
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING'
      }).select('id').single();
      
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newRes.id;
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
"""

content = re.sub(
    r'//\s*INSERT NEW CANONICAL RECORD[\s\S]*?await\s*supabase\.from\(\'job_provenance\'\)\.insert\(\{[\s\S]*?\}\);',
    new_routing,
    content
)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
