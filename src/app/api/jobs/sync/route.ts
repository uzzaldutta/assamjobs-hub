import { NextResponse } from 'next/server';
import { fetchAdzunaJobs } from '@/lib/adzuna';

// To protect this route from arbitrary public execution, 
// you would typically check for an Authorization header or a secret token here.
const SYNC_SECRET = process.env.SYNC_SECRET;

export async function GET(request: Request) {
  // 1. Basic security check (Optional: remove if you want it fully public for now)
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (SYNC_SECRET && token !== SYNC_SECRET) {
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

    // 4. In a production environment, you would upsert these jobs into the database:
    // e.g., using Prisma:
    // for (const job of mappedJobs) {
    //   await prisma.job.upsert({
    //     where: { hash: job.hash },
    //     update: {}, // Don't update if it already exists to preserve manual edits
    //     create: job,
    //   });
    // }
    
    // For now, we just return the payload to prove the integration works
    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${mappedJobs.length} jobs from Adzuna.`,
      data: mappedJobs,
    });
  } catch (error) {
    console.error('Job synchronization failed:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize jobs.' },
      { status: 500 }
    );
  }
}
