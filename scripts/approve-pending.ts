import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

// Mock next/cache
const nextCache = require('next/cache');
nextCache.revalidatePath = () => {};

async function approveAll() {
  const { supabaseAdmin: sb } = await import('@/lib/supabase');
  const { approveQueueItemAction } = await import('@/app/admin/studio/ingestion/actions');

  const { data: queueItems, error } = await sb.from('ingestion_queue')
    .select('*')
    .eq('status', 'NEW')
    .gte('quality_score', 60);

  if (error) {
    console.error('Error fetching items:', error);
    return;
  }

  console.log('Items eligible for approval:', queueItems ? queueItems.length : 0);
  if (!queueItems || queueItems.length === 0) return;

  for (const item of queueItems) {
    if (item.title && item.title !== 'Unknown Title') {
      try {
        await approveQueueItemAction(item.id, 'NEW');
        console.log(`✓ Approved & Published: ${item.title} (${item.content_type})`);
      } catch (e: any) {
        console.error(`✗ Failed to approve ${item.title}:`, e.message);
      }
    }
  }
  console.log('Finished approving items!');
}

approveAll().catch(console.error);
