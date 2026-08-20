const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  const dbPath = path.join(__dirname, 'src', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.log("No db.json found. Skipping migration.");
    return;
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const allItems = [
    ...(db.jobs || []),
    ...(db.tenders || []).map(t => ({ ...t, job_type: 'TENDER' })),
    ...(db.results || []).map(r => ({ ...r, job_type: 'EXAM_UPDATE' })),
    ...(db.training || []).map(t => ({ ...t, job_type: 'TRAINING' }))
  ];

  if (allItems.length === 0) {
    console.log("Database is empty.");
    return;
  }

  console.log(`Found ${allItems.length} records. Migrating to Supabase...`);

  // Map JSON to DB Schema
  const records = allItems.map(item => ({
    id: item.id || `migrated_${Date.now()}_${Math.random()}`,
    title: item.title || 'Untitled',
    organization: item.organization || item.department || 'Unknown',
    job_type: item.job_type || item.type || 'GOVERNMENT',
    category: item.category || 'ASSAM_STATE',
    vacancies: item.vacancies || item.value || null,
    district: item.district || item.location || 'All Assam',
    qualification: item.qualification || null,
    age_limit: item.age_limit || null,
    application_fee: item.application_fee || null,
    selection_process: item.selection_process || null,
    last_date: item.lastDate || item.last_date || null,
    official_pdf_url: item.officialUrl || item.official_pdf_url || null,
    apply_url: item.apply_url || item.applyUrl || null,
    unique_description: item.unique_description || null,
    unique_description_assamese: item.unique_description_assamese || null,
  }));

  const { data, error } = await supabase
    .from('jobs')
    .upsert(records, { onConflict: 'id' });

  if (error) {
    console.error("Migration Failed:", error);
  } else {
    console.log("✅ Successfully migrated data to Supabase Cloud!");
  }
}

migrate();
