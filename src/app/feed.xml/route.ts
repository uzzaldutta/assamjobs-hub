import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Explicitly set dynamic to avoid build-time static generation throwing errors,
// and rely entirely on the HTTP Cache-Control header for Edge caching (0 ISR writes).
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, organization, category, qualification, vacancies, last_date, scraped_at, unique_description, slug')
    .eq('status', 'PUBLISHED')
    .order('scraped_at', { ascending: false })
    .limit(60);

  // XML escaping helper
  const escapeXml = (unsafe: string) => {
    return (unsafe || '').replace(/[<>&'"]/g, (c: string) => {
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

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AssamJobs Hub - Recruitment, Admit Cards &amp; Results</title>
    <link>${baseUrl}</link>
    <description>Latest Government and Private Jobs, Admit Cards, and Results in Assam. Official verified recruitment updates for ADRE, APSC, and Assam Police.</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>AssamJobs Hub</title>
      <link>${baseUrl}</link>
    </image>
`;

  if (jobs) {
    jobs.forEach(job => {
      const jobUrl = `${baseUrl}/jobs/${job.slug || job.id}`;
      const title = escapeXml(job.title || 'Job Update');
      const org = escapeXml(job.organization || 'Assam Govt');
      const category = escapeXml(job.category || 'Recruitment');
      const vacancies = job.vacancies && job.vacancies !== 'Not Specified' ? ` | Vacancies: ${escapeXml(job.vacancies)}` : '';
      const qualification = job.qualification ? ` | Qualification: ${escapeXml(job.qualification)}` : '';
      const deadline = job.last_date ? ` | Last Date: ${escapeXml(job.last_date)}` : '';

      const summaryText = `Organization: ${org}${vacancies}${qualification}${deadline}. Check eligibility and apply online at AssamJobsHub.`;
      const cleanDesc = escapeXml(job.unique_description ? job.unique_description.replace(/<[^>]*>?/gm, "").substring(0, 500) : summaryText);

      xml += `
    <item>
      <title>${title}</title>
      <link>${jobUrl}</link>
      <guid isPermaLink="true">${jobUrl}</guid>
      <dc:creator>AssamJobsHub Editorial Desk</dc:creator>
      <category>${category}</category>
      <description>${summaryText}</description>
      <content:encoded><![CDATA[<p>${cleanDesc}</p><p><a href="${jobUrl}">Read full job details and apply online on AssamJobsHub</a></p>]]></content:encoded>
      <pubDate>${new Date(job.scraped_at || Date.now()).toUTCString()}</pubDate>
    </item>`;
    });
  }

  xml += `
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
