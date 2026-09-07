import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const url = "https://jobassam.in/apsc-cce-admit-card/";
  
  // 1. Fetch
  console.log("Fetching URL:", url);
  const res = await fetch(url, { headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' }});
  const html = await res.text();
  
  // 2. Extract
  console.log("Extracting...");
  const $ = cheerio.load(html);
  const title = $('.entry-title').text().trim() || 'APSC CCE Admit Card';
  const bodyText = $('.entry-content').text();
  
  let applyUrl = '';
  let notificationUrl = '';
  $('.entry-content a').each((i, el) => {
    const linkText = $(el).text().toLowerCase();
    const href = $(el).attr('href');
    if (!href) return;
    if (linkText.includes('download') || linkText.includes('admit') || linkText.includes('call letter') || linkText.includes('click here')) {
      if(!applyUrl) applyUrl = href;
    } else if (linkText.includes('notification') || href.endsWith('.pdf')) {
      if(!notificationUrl) notificationUrl = href;
    }
  });
  
  // 3. Insert into Database
  console.log("Inserting into database...");
  const { data, error } = await supabase.from('admit_cards').insert({
    title: title,
    organization: 'Assam Public Service Commission (APSC)',
    exam_name: 'Combined Competitive Examination (CCE)',
    download_url: applyUrl || url,
    official_source_url: 'https://apsc.nic.in',
    status: 'PUBLISHED',
    verification_status: 'VERIFIED'
  }).select('id').single();

  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Successfully inserted ADMIT CARD:", data.id);
  }
}

run();
