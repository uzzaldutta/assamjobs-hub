import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { supabase } from '@/lib/supabase';

// Security token
const SYNC_SECRET = process.env.SYNC_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (SYNC_SECRET && token !== SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = 'https://nfr.indianrailways.gov.in/view_section.jsp?fontColor=black&backgroundColor=LIGHTSTEELBLUE&lang=0&id=0,6,592,593,596';
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const jobs: any[] = [];
    
    $('a').each((i, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      const href = $(el).attr('href');
      
      if (href && (href.includes('.pdf') || href.includes('uploads') || href.toLowerCase().includes('notice'))) {
        if (text.length > 10 && !jobs.some(j => j.title === text)) {
          const absoluteUrl = href.startsWith('http') ? href : `https://nfr.indianrailways.gov.in/${href}`;
          jobs.push({
            title: text,
            organization: 'Northeast Frontier Railway (NFR)',
            job_type: 'RAILWAY',
            category: 'RAILWAY',
            official_pdf_url: absoluteUrl,
            scraped_at: new Date().toISOString()
          });
        }
      }
    });

    // We take only top 20 latest notifications to avoid db bloat
    const latestJobs = jobs.slice(0, 20);
    
    if (latestJobs.length === 0) {
      return NextResponse.json({ success: true, message: 'No jobs found on NFR website.' });
    }

    let inserted = 0;
    for (const job of latestJobs) {
      // Very basic deduplication by checking title in db
      const { data: existing } = await supabase
        .from('jobs')
        .select('id')
        .eq('title', job.title)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.from('jobs').insert(job);
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${inserted} new Railway jobs from NFR.`,
      data: latestJobs,
    });
  } catch (error) {
    console.error('NFR Job synchronization failed:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize NFR jobs.' },
      { status: 500 }
    );
  }
}
