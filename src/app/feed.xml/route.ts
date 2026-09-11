import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Explicitly set dynamic to avoid build-time static generation throwing errors,
// and rely entirely on the HTTP Cache-Control header for Edge caching (0 ISR writes).
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, organization, last_date, scraped_at')
    .eq('status', 'PUBLISHED')
    .order('scraped_at', { ascending: false })
    .limit(50);

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AssamJobs Hub</title>
    <link>${baseUrl}</link>
    <description>Latest Jobs, Results, and Admit Cards in Assam</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;

  if (jobs) {
    jobs.forEach(job => {
      const jobUrl = `${baseUrl}/jobs/${job.id}`;
      
      // Basic XML escaping
      const escapeXml = (unsafe) => {
        return (unsafe || '').replace(/[<>&'"]/g, (c) => {
          switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
          }
        });
      };

      const title = escapeXml(job.title || 'Job Update');
      const org = escapeXml(job.organization || 'Organization');
      let desc = `Organization: ${org}`;
      if (job.last_date) {
        desc += ` | Last Date: ${escapeXml(job.last_date)}`;
      }
      
      xml += `
    <item>
      <title>${title}</title>
      <link>${jobUrl}</link>
      <guid>${jobUrl}</guid>
      <description>${desc}</description>
      <pubDate>${new Date(job.scraped_at || Date.now()).toUTCString()}</pubDate>
    </item>`;
    });
  }

  xml += `
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // Cache at Vercel Edge for 1 hour, serve stale while revalidating for 24 hours.
      // This DOES NOT consume Vercel ISR writes.
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
