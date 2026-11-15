import { supabaseAdmin as supabase } from '@/lib/supabase';
import { parseFlexibleDate } from '@/lib/dateUtils';
import { revalidatePath } from 'next/cache';

export interface CleanupResult {
  success: boolean;
  timestamp: string;
  jobsChecked: number;
  jobsRemoved: number;
  queuePruned: number;
  runsPruned: number;
  details?: string;
}

/**
 * Automated Cleanup Service for AssamJobsHub
 * - Automatically purges job feeds whose last application date or scrape date is older than 30 days.
 * - Prunes old ingestion queue payloads and stale execution logs (>30 days).
 * - Preserves system blocklists (BANNED_KEYWORD) and non-job reference data.
 */
export async function runAutoCleanup(options: { daysThreshold?: number } = {}): Promise<CleanupResult> {
  const daysThreshold = options.daysThreshold ?? 30;
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);
  const cutoffISO = cutoffDate.toISOString();

  console.log(`[AutoCleanup] Starting cleanup with ${daysThreshold}-day threshold (cutoff: ${cutoffISO.split('T')[0]})`);

  let jobsChecked = 0;
  let jobsRemoved = 0;
  let queuePruned = 0;
  let runsPruned = 0;

  try {
    // 1. Fetch jobs to evaluate for expiration
    // Exclude BANNED_KEYWORD blocklist rows
    const { data: jobs, error: fetchErr } = await supabase
      .from('jobs')
      .select('id, title, last_date, scraped_at, created_at, category')
      .neq('category', 'BANNED_KEYWORD');

    if (fetchErr) {
      console.error('[AutoCleanup] Error fetching jobs:', fetchErr.message);
    } else if (jobs && jobs.length > 0) {
      jobsChecked = jobs.length;
      const expiredJobIds: string[] = [];

      for (const job of jobs) {
        let isExpired = false;

        // Check 1: Has a valid last application date?
        if (job.last_date && job.last_date !== 'TBD' && job.last_date !== 'Not Specified') {
          const parsed = parseFlexibleDate(job.last_date);
          if (parsed && !isNaN(parsed.getTime())) {
            if (parsed < cutoffDate) {
              isExpired = true;
            }
          }
        }

        // Check 2: If no last date, or if scraped/created more than 30 days ago
        if (!isExpired) {
          const postedDateStr = job.scraped_at || job.created_at;
          if (postedDateStr) {
            const postedDate = new Date(postedDateStr);
            if (!isNaN(postedDate.getTime()) && postedDate < cutoffDate) {
              // Only expire if last_date is not set or also in the past
              const parsedLast = parseFlexibleDate(job.last_date);
              if (!parsedLast || parsedLast < cutoffDate) {
                isExpired = true;
              }
            }
          }
        }

        if (isExpired) {
          expiredJobIds.push(job.id);
        }
      }

      // Delete expired jobs in safe chunks of 100
      if (expiredJobIds.length > 0) {
        console.log(`[AutoCleanup] Found ${expiredJobIds.length} jobs expired by >${daysThreshold} days.`);
        const CHUNK_SIZE = 100;
        for (let i = 0; i < expiredJobIds.length; i += CHUNK_SIZE) {
          const chunk = expiredJobIds.slice(i, i + CHUNK_SIZE);
          const { error: delErr } = await supabase
            .from('jobs')
            .delete()
            .in('id', chunk);

          if (delErr) {
            console.error('[AutoCleanup] Error deleting job batch:', delErr.message);
          } else {
            jobsRemoved += chunk.length;
          }
        }
      }
    }

    // 2. Prune Ingestion Queue (>30 days old or strip raw HTML payloads for approved items)
    // Strip raw_payload on approved items older than 7 days to prevent bloat
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('ingestion_queue')
      .update({ raw_payload: {} })
      .eq('status', 'APPROVED')
      .lt('created_at', sevenDaysAgo)
      .not('raw_payload', 'is', null);

    // Delete queue items older than cutoff
    const { data: oldQueue, error: queueErr } = await supabase
      .from('ingestion_queue')
      .delete()
      .lt('created_at', cutoffISO)
      .select('id');

    if (!queueErr && oldQueue) {
      queuePruned = oldQueue.length;
    }

    // 3. Prune Ingestion Runs telemetry (>30 days old)
    const { data: oldRuns, error: runsErr } = await supabase
      .from('ingestion_runs')
      .delete()
      .lt('created_at', cutoffISO)
      .select('id');

    if (!runsErr && oldRuns) {
      runsPruned = oldRuns.length;
    }

    console.log(`[AutoCleanup] Completed: removed ${jobsRemoved} expired jobs, pruned ${queuePruned} queue items, deleted ${runsPruned} old run logs.`);

    try {
      revalidatePath('/');
    } catch {}

    return {
      success: true,
      timestamp: new Date().toISOString(),
      jobsChecked,
      jobsRemoved,
      queuePruned,
      runsPruned,
      details: `Cleaned feeds older than ${daysThreshold} days.`
    };

  } catch (err: any) {
    console.error('[AutoCleanup] Unexpected error:', err);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      jobsChecked,
      jobsRemoved,
      queuePruned,
      runsPruned,
      details: err.message
    };
  }
}
