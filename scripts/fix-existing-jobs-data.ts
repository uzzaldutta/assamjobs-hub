import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import { parseFlexibleDate } from '../src/lib/dateUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  console.log('Fetching recent jobs...');
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title, slug, apply_url, official_pdf_url, official_source_url, last_date, organization')
    .order('scraped_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Error fetching jobs:', error);
    return;
  }

  console.log(`Found ${jobs.length} jobs to inspect`);

  for (const job of jobs) {
    let needsUpdate = false;
    let updates: any = {};

    // 1. Fix last_date format to standard YYYY-MM-DD
    if (job.last_date) {
      const parsed = parseFlexibleDate(job.last_date);
      if (parsed && !isNaN(parsed.getTime())) {
        const isoDate = parsed.toISOString().split('T')[0];
        if (job.last_date !== isoDate) {
          updates.last_date = isoDate;
          needsUpdate = true;
          console.log(`[${job.title}] Normalizing last_date: "${job.last_date}" => "${isoDate}"`);
        }
      }
    }

    // 2. Fix apply_url & official_pdf_url if it came from assamcareer
    const sourceUrl = job.official_source_url || (job.apply_url?.includes('assamcareer.com') ? job.apply_url : null);
    if (sourceUrl && sourceUrl.includes('assamcareer.com')) {
      try {
        const res = await fetch(sourceUrl, { 
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, 
          signal: AbortSignal.timeout(6000) 
        });
        if (res.ok) {
          const html = await res.text();
          const $ = cheerio.load(html);

          let realApplyUrl = '';
          let realPdfUrl = '';
          let realOrg = '';

          $('table tr').each((_, tr) => {
            const rowText = $(tr).text().toLowerCase();
            const linkEl = $(tr).find('a');
            const href = linkEl.attr('href');
            const firstCell = $(tr).find('td').first().text().trim().toLowerCase();
            const lastCell = $(tr).find('td').last().text().trim();

            if (firstCell.includes('organization') && !realOrg) {
              realOrg = lastCell;
            }

            if (href) {
              const lowerHref = href.toLowerCase();
              if (!lowerHref.includes('whatsapp') && !lowerHref.includes('telegram') && !lowerHref.includes('t.me') && !lowerHref.includes('help.assamcareer.com')) {
                if ((rowText.includes('apply') || rowText.includes('application form') || rowText.includes('registration')) && !realApplyUrl) {
                  realApplyUrl = href;
                } else if ((rowText.includes('notification') || rowText.includes('advertisement') || href.endsWith('.pdf')) && !realPdfUrl) {
                  realPdfUrl = href;
                }
              }
            }
          });

          if (realApplyUrl && realApplyUrl !== job.apply_url) {
            updates.apply_url = realApplyUrl;
            needsUpdate = true;
            console.log(`[${job.title}] Fixing apply_url: "${job.apply_url}" => "${realApplyUrl}"`);
          }

          if (realPdfUrl && realPdfUrl !== job.official_pdf_url) {
            updates.official_pdf_url = realPdfUrl;
            needsUpdate = true;
            console.log(`[${job.title}] Fixing official_pdf_url: "${job.official_pdf_url}" => "${realPdfUrl}"`);
          }

          if (realOrg && (!job.organization || job.organization === 'Unknown')) {
            updates.organization = realOrg;
            needsUpdate = true;
            console.log(`[${job.title}] Fixing organization: "${job.organization}" => "${realOrg}"`);
          }
        }
      } catch (err: any) {
        console.warn(`Could not re-fetch source for ${job.title}:`, err.message);
      }
    }

    if (needsUpdate) {
      const { error: updErr } = await supabase.from('jobs').update(updates).eq('id', job.id);
      if (updErr) console.error(`Error updating job ${job.id}:`, updErr);
      else console.log(`✓ Successfully updated job: ${job.title}`);
    }
  }

  console.log('Finished repairing jobs data.');
}

fix();
