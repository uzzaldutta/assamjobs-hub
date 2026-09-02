import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Update JOB insert payload mapping
replacement = """
    if (item.content_type === 'JOB' || item.content_type === 'PRIVATE_JOB') {
      const { data: newJob, error: insertErr } = await supabase.from('jobs').insert({
        title: payload.title,
        organization: payload.organization || 'Unknown',
        job_type: item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE',
        category: payload.category || 'OTHER',
        vacancies: payload.vacancy || 'Not Specified',
        location: payload.location || 'Assam',
        last_date: payload.applicationEnd || null,
        apply_url: payload.applyUrl || payload.sourceUrl, // Maps extracted apply URL
        official_pdf_url: payload.notificationUrl || null, // Maps extracted PDF link
        status: 'PUBLISHED', 
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',
        official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null
      }).select('id').single();
"""

content = re.sub(
    r'if\s*\(item\.content_type\s*===\s*\'JOB\'\s*\|\|\s*item\.content_type\s*===\s*\'PRIVATE_JOB\'\)\s*\{[\s\S]*?\}\)\.select\(\'id\'\)\.single\(\);',
    replacement,
    content
)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
