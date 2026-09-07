import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace UPDATE target table for ADMISSION
content = content.replace(
    "if (item.content_type === 'ADMISSION') targetTable = 'admissions';",
    "if (item.content_type === 'ADMISSION') targetTable = 'jobs';"
)

# Replace INSERT into admissions with INSERT into jobs
old_insert = """    else if (item.content_type === 'ADMISSION') {
      const { data: newAdm, error: insertErr } = await supabase.from('admissions').insert({
        title: payload.title,
        institution: payload.organization || 'Unknown',
        course: payload.course,
        application_deadline: payload.applicationEnd,
        application_link: payload.applyUrl || payload.sourceUrl,
        official_source_url: payload.sourceUrl || null,
        status: 'PUBLISHED',
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING'
      }).select('id').single();
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newAdm.id;
    }"""

new_insert = """    else if (item.content_type === 'ADMISSION') {
      const { data: newAdm, error: insertErr } = await supabase.from('jobs').insert({
        title: payload.title,
        organization: payload.organization || 'Unknown',
        job_type: 'ADMISSION',
        closing_date: payload.applicationEnd || null,
        application_url: payload.applyUrl || payload.sourceUrl,
        official_source_url: payload.sourceUrl || null,
        status: 'PUBLISHED',
        verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING'
      }).select('id').single();
      if (insertErr) throw new Error(insertErr.message);
      newRecordId = newAdm.id;
    }"""

content = content.replace(old_insert, new_insert)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("actions.ts updated for admissions legacy compatibility")
