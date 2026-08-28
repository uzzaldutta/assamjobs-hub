import { NextResponse } from 'next/server';
import { fetchAdzunaJobs } from '@/lib/adzuna';
import { supabase } from '@/lib/supabase';

// To protect this route from arbitrary public execution, 
// you would typically check for an Authorization header or a secret token here.
const SYNC_SECRET = process.env.SYNC_SECRET;

export async function GET(request: Request) {
  // 1. Basic security check (Optional: remove if you want it fully public for now)
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (SYNC_SECRET && token !== SYNC_SECRET && authHeader !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch API Credentials
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    return NextResponse.json(
      { error: 'Adzuna API credentials not configured.' },
      { status: 500 }
    );
  }

  try {
    // 3. Fetch and map jobs
    const mappedJobs = await fetchAdzunaJobs(appId, appKey);

    // Fetch Banned Keywords
    const { data: bannedData } = await supabase
      .from('jobs')
      .select('title')
      .eq('category', 'BANNED_KEYWORD');
      
    const bannedKeywords = bannedData ? bannedData.map(b => b.title.toLowerCase()) : [];

    let inserted = 0;
    
    // Save to Supabase
    for (const job of mappedJobs) {
      // Spam Check
      const lowerTitle = job.title.toLowerCase();
      const isSpam = bannedKeywords.some(keyword => lowerTitle.includes(keyword));
      
      if (!isSpam) {
        // Basic deduplication
        const { data: existing } = await supabase
          .from('jobs')
          .select('id')
          .eq('title', job.title)
          .limit(1);
          
        if (!existing || existing.length === 0) {
          await supabase.from('jobs').insert({
            title: job.title,
            organization: job.organization,
            job_type: job.jobType,
            category: job.category,
            vacancies: job.vacancies,
            district: job.district,
            apply_url: job.applyUrl
          });
          inserted++;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully synchronized and inserted ${inserted} jobs from Adzuna (filtered spam).`,
    });
  } catch (error) {
    console.error('Job synchronization failed:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize jobs.' },
      { status: 500 }
    );
  }
}
