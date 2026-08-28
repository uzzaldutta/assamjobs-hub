
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function run() {
  const response = await fetch('https://nfr.indianrailways.gov.in/view_section.jsp?fontColor=black&backgroundColor=LIGHTSTEELBLUE&lang=0&id=0,6,592,593,596');
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const jobs = [];
  $('a').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    const href = $(el).attr('href');
    if (href && (href.includes('.pdf') || href.includes('uploads') || href.toLowerCase().includes('notice'))) {
      if (text.length > 10 && !jobs.some(j => j.title === text)) {
        jobs.push({
          title: text,
          organization: 'Northeast Frontier Railway (NFR)',
          job_type: 'RAILWAY',
          category: 'RAILWAY',
          official_pdf_url: href.startsWith('http') ? href : 'https://nfr.indianrailways.gov.in/' + href,
          scraped_at: new Date().toISOString()
        });
      }
    }
  });

  const latestJobs = jobs.slice(0, 20);
  let inserted = 0;
  for (const job of latestJobs) {
    const { data: existing } = await supabase.from('jobs').select('id').eq('title', job.title).limit(1);
    if (!existing || existing.length === 0) {
      await supabase.from('jobs').insert(job);
      inserted++;
    }
  }
  console.log('Inserted ' + inserted + ' Railway jobs');
}
run();
