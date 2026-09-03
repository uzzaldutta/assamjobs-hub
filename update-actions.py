import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

replacement = """
    // --- 5. ADMIT CARD ---
    if (item.content_type === 'ADMIT_CARD') {
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
      if (insertErr) throw insertErr;
      canonicalId = newAc.id;
    }

    // --- 6. SCHOLARSHIP ---
    if (item.content_type === 'SCHOLARSHIP') {
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
      if (insertErr) throw insertErr;
      canonicalId = newSch.id;
    }
"""

# Insert right before the generic check (or right after RESULTS block)
content = re.sub(
    r'(// --- 4\. RESULTS ---[\s\S]*?canonicalId = newRes\.id;\s*\})',
    r'\1\n' + replacement,
    content
)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
