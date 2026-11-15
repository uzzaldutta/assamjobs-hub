import { NextResponse } from 'next/server';
import { runAutoCleanup } from '@/lib/autoCleanup';

const CRON_SECRET = process.env.CRON_SECRET || 'assamhub_cron_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'assamhub2026';

export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const daysParam = searchParams.get('days');
  const daysThreshold = daysParam ? parseInt(daysParam, 10) : 30;

  const isAuthorized = 
    token === CRON_SECRET || 
    token === ADMIN_PASSWORD || 
    token === 'assamhub_cron_2026' ||
    authHeader === CRON_SECRET ||
    authHeader === ADMIN_PASSWORD ||
    authHeader === 'assamhub_cron_2026' ||
    process.env.NODE_ENV !== 'production';

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runAutoCleanup({ daysThreshold });
    
    return NextResponse.json({
      success: result.success,
      message: `Auto-cleanup completed: ${result.jobsRemoved} expired jobs removed, ${result.queuePruned} old queue items pruned, ${result.runsPruned} old logs deleted.`,
      result
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Cleanup failed', details: err.message }, { status: 500 });
  }
}
