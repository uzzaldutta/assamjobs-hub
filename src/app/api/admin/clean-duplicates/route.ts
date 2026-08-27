import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SYNC_SECRET = process.env.SYNC_SECRET;

/**
 * GET /api/admin/clean-duplicates
 * 
 * Fetches all jobs from the database, applies the smart deduplication logic
 * (org + vacancies + lastDate + publishedDate), and permanently deletes
 * the duplicate rows — keeping only the FIRST occurrence of each unique job.
 * 
 * Protect with ?token=YOUR_SYNC_SECRET
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (SYNC_SECRET && token !== SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch all jobs ordered by scraped_at ascending so we keep the OLDEST (first scraped) entry
    const { data, error } = await supabase
      .from('jobs')
      .select('id, organization, vacancies, last_date, scraped_at, title')
      .order('scraped_at', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, message: 'No jobs found.', deleted: 0 });
    }

    // 2. Apply smart dedup: keep first seen, collect IDs of duplicates to delete
    const seenHashes = new Set<string>();
    const duplicateIds: string[] = [];

    for (const job of data) {
      const org = (job.organization || '').toLowerCase().replace(/\s+/g, '');
      const vacancies = (job.vacancies || '').toString().toLowerCase().replace(/\s+/g, '');
      const lastDate = (job.last_date || '').toString().trim();
      const rawPublished = (job.scraped_at || job.created_at || '').toString();
      const publishedDate = rawPublished ? rawPublished.split('T')[0] : '';

      let hash: string;

      if (org && vacancies && lastDate && publishedDate) {
        // Primary smart hash
        hash = `smart:${org}|${vacancies}|${lastDate}|${publishedDate}`;
      } else {
        // Fallback: title + org
        const title = (job.title || '').toLowerCase().replace(/\s+/g, '');
        hash = `legacy:${title}|${org}`;
      }

      if (seenHashes.has(hash)) {
        duplicateIds.push(job.id);
      } else {
        seenHashes.add(hash);
      }
    }

    if (duplicateIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No duplicates found. Database is already clean!',
        total: data.length,
        deleted: 0,
      });
    }

    // 3. Delete duplicates in batches of 100 to avoid query limits
    const BATCH_SIZE = 100;
    let deletedCount = 0;

    for (let i = 0; i < duplicateIds.length; i += BATCH_SIZE) {
      const batch = duplicateIds.slice(i, i + BATCH_SIZE);
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

    return NextResponse.json({
      success: true,
      message: `Cleanup complete! Removed ${deletedCount} duplicate entries.`,
      total: data.length,
      kept: data.length - deletedCount,
      deleted: deletedCount,
      duplicateIds,
    });

  } catch (error) {
    console.error('Cleanup failed:', error);
    return NextResponse.json({ error: 'Cleanup failed', details: String(error) }, { status: 500 });
  }
}
