import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const SYNC_SECRET = process.env.SYNC_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
  const adminPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';

  if (SYNC_SECRET && token !== SYNC_SECRET && token !== adminPassword && authHeader !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // We will delete jobs where scraped_at is older than 6 months (180 days)
    // Or if last_date is older than 3 months (90 days)
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);
    const sixMonthsStr = sixMonthsAgo.toISOString();

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    // Format YYYY-MM-DD
    const threeMonthsStr = threeMonthsAgo.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('jobs')
      .select('id, scraped_at, last_date, category')
      .neq('category', 'BANNED_KEYWORD'); // keep blocklist

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, message: 'No jobs found.', deleted: 0 });
    }

    const toDelete = [];

    for (const job of data) {
      // 1. Delete if scraped more than 6 months ago
      let isOldScraped = false;
      if (job.scraped_at) {
        if (new Date(job.scraped_at) < sixMonthsAgo) {
          isOldScraped = true;
        }
      }

      // 2. Delete if last_date passed more than 3 months ago
      let isOldLastDate = false;
      if (job.last_date && job.last_date !== 'TBD' && job.last_date !== 'Not Specified') {
        const d = new Date(job.last_date);
        if (!isNaN(d.getTime()) && d < threeMonthsAgo) {
          isOldLastDate = true;
        }
      }

      if (isOldScraped || isOldLastDate) {
        toDelete.push(job.id);
      }
    }

    if (toDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No old jobs found. Database is already clean!',
        deleted: 0,
      });
    }

    // Delete in batches of 100
    const BATCH_SIZE = 100;
    let deletedCount = 0;

    for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
      const batch = toDelete.slice(i, i + BATCH_SIZE);
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .in('id', batch);

      if (deleteError) {
        console.error('Delete batch error:', deleteError);
      } else {
        deletedCount += batch.length;
      }
    }

    revalidatePath('/');
    return NextResponse.json({
      success: true,
      message: `Cleanup complete! Permanently removed ${deletedCount} very old feeds to save space.`,
      deleted: deletedCount,
    });

  } catch (error) {
    console.error('Cleanup failed:', error);
    return NextResponse.json({ error: 'Cleanup failed', details: String(error) }, { status: 500 });
  }
}
