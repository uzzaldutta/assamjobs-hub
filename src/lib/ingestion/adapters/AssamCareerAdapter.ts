import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource } from "../types";

export class AssamCareerAdapter implements SourceAdapter {
  sourceConfig: IngestionSource;

  constructor(config: IngestionSource) {
    this.sourceConfig = config;
  }

  async discover(): Promise<RawContent[]> {
    try {
      const items: RawContent[] = [];
      const seen = new Set<string>();

      // 1. Primary Ultra-Fast Discovery: Official Blogger JSON Feed (takes ~1.5s)
      try {
        const feedUrl = 'https://www.assamcareer.com/feeds/posts/default?alt=json&max-results=12';
        const res = await fetch(feedUrl, {
          headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' },
          signal: AbortSignal.timeout(6000)
        });

        if (res.ok) {
          const data = await res.json();
          const entries = data.feed?.entry || [];
          for (const entry of entries) {
            const altLink = entry.link?.find((l: any) => l.rel === 'alternate');
            const link = altLink ? altLink.href : '';
            const title = entry.title?.$t?.trim() || '';
            const categories = entry.category ? entry.category.map((c: any) => c.term) : [];

            if (link && !seen.has(link)) {
              seen.add(link);
              items.push({
                url: link,
                externalId: link,
                json: { title, categories }
              });
            }
          }
        }
      } catch (feedErr) {
        console.warn('AssamCareer JSON feed discovery warning, trying fallback:', feedErr);
      }

      // If feed yielded items, return immediately (super fast!)
      if (items.length > 0) {
        return items.slice(0, 8);
      }

      // 2. Fallback: Direct HTML scraping if feed was unavailable
      const endpoints = [
        { url: this.sourceConfig.base_url || 'https://www.assamcareer.com', limit: 4 },
        { url: 'https://www.assamcareer.com/search/label/Admit%20Card', limit: 2 },
        { url: 'https://www.assamcareer.com/search/label/Result', limit: 2 },
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep.url, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            signal: AbortSignal.timeout(6000)
          });
          if (!res.ok) continue;
          const html = await res.text();
          const $ = cheerio.load(html);
          
          let count = 0;
          $('.entry-title a, h3.title a, h2.title a, .post-title a').each((i, el) => {
            if (count >= ep.limit) return;
            const title = $(el).text().trim();
            const link = $(el).attr('href');
            
            if (title && link && !seen.has(link)) {
               seen.add(link);
               items.push({
                 url: link,
                 externalId: link
               });
               count++;
            }
          });
        } catch (e) {
          console.warn(`Fallback fetch failed for ${ep.url}:`, e);
        }
      }

      return items;
    } catch (error) {
       console.error("AssamCareer Discovery Error:", error);
       throw error;
    }
  }

  async fetch(content: RawContent): Promise<RawContent> {
    try {
       const res = await fetch(content.url, { 
         headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
         signal: AbortSignal.timeout(8000)
       });
       if (res.ok) {
         content.html = await res.text();
       }
    } catch (e) {
      console.warn("Failed fetching detail:", content.url);
    }
    return content;
  }

  async extract(raw: RawContent): Promise<any> {
    if (!raw.html) return {};
    const $ = cheerio.load(raw.html);
    
    const title = raw.json?.title || ($('h1.entry-title, .post h1, h1.post-title, h1.title').first().text().trim() || $('.entry-title, .post-title').first().text().trim()) || '';
    const bodyText = $('.post-body').length ? $('.post-body').text() : $.text();
    const titleLower = title.toLowerCase();

    // Table extraction (ac-highlight-table)
    let orgFromTable = '';
    let dateFromTable = '';
    let vacancyFromTable = '';
    let qualificationFromTable = '';

    $('.ac-highlight-table tr').each((_, tr) => {
      const label = $(tr).find('td').first().text().trim().toLowerCase();
      const val = $(tr).find('td').last().text().trim();
      if (label.includes('organization')) orgFromTable = val;
      else if (label.includes('no of post') || label.includes('vacancy')) vacancyFromTable = val;
      else if (label.includes('last date') || label.includes('closing date')) dateFromTable = val;
      else if (label.includes('qualification')) qualificationFromTable = val;
    });
    
    // Deep Regex Fallback
    const orgMatch = bodyText.match(/Name of organization:\s*([^\n]+)/i) || bodyText.match(/Organization:\s*([^\n]+)/i);
    const dateMatch = bodyText.match(/Last Date:\s*([^\n]+)/i);
    const vacancyMatch = bodyText.match(/No of posts:\s*(\d+)/i) || bodyText.match(/Total Vacancy:\s*(\d+)/i);
    
    // Link Extraction Logic
    let applyUrl = '';
    let notificationUrl = '';
    
    $('.post-body a, .entry-content a').each((i, el) => {
      const linkText = $(el).text().toLowerCase();
      const href = $(el).attr('href');
      if (!href) return;
      
      if (linkText.includes('apply online') || linkText.includes('online application')) {
        applyUrl = href;
      } else if (linkText.includes('advertisement') || linkText.includes('official notification') || href.endsWith('.pdf')) {
        notificationUrl = href;
      }
    });

    let detectedType: 'JOB' | 'TENDER' | 'ADMISSION' | 'RESULT' | 'ADMIT_CARD' | 'SCHOLARSHIP' = 'JOB';
    const categories: string[] = raw.json?.categories || [];
    const catLower = categories.map(c => c.toLowerCase());

    if (catLower.some(c => c.includes('result')) || titleLower.includes('result') || titleLower.includes('merit list') || titleLower.includes('cut off') || titleLower.includes('scorecard')) {
      detectedType = 'RESULT';
    } else if (catLower.some(c => c.includes('admit card')) || titleLower.includes('admit card') || titleLower.includes('call letter') || titleLower.includes('hall ticket') || titleLower.includes('exam date')) {
      detectedType = 'ADMIT_CARD';
    } else if (catLower.some(c => c.includes('admission')) || titleLower.includes('admission') || titleLower.includes('entrance') || titleLower.includes('counseling')) {
      detectedType = 'ADMISSION';
    } else if (catLower.some(c => c.includes('scholarship')) || titleLower.includes('scholarship') || titleLower.includes('fellowship') || titleLower.includes('scheme')) {
      detectedType = 'SCHOLARSHIP';
    } else if (catLower.some(c => c.includes('tender')) || titleLower.includes('tender')) {
      detectedType = 'TENDER';
    }
    
    return {
      title,
      detectedType,
      url: raw.url,
      organization: orgFromTable || (orgMatch ? orgMatch[1].trim() : 'Unknown'),
      lastDate: dateFromTable || (dateMatch ? dateMatch[1].trim() : undefined),
      vacancy: vacancyFromTable || (vacancyMatch ? vacancyMatch[1].trim() : undefined),
      qualification: qualificationFromTable || undefined,
      applyUrl,
      notificationUrl,
      descriptionHTML: $(".post-body").html() || ""
    };
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url,
      applyUrl: extracted.applyUrl || extracted.url,
      notificationUrl: extracted.notificationUrl,
      contentType: (extracted.detectedType as any) || 'JOB',
      title: extracted.title,
      organization: extracted.organization,
      applicationEnd: extracted.lastDate,
      vacancy: extracted.vacancy,
      qualification: extracted.qualification,
      externalId: extracted.url,
      description: extracted.descriptionHTML
    };
  }

  validate(payload: NormalizedPayload): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!payload.title) errors.push("Missing title");
    if (!payload.sourceUrl) errors.push("Missing source URL");
    if (payload.organization === 'Unknown') warnings.push("Organization unconfirmed");
    if (!payload.applyUrl && !payload.notificationUrl) warnings.push("No actionable external link found");
    
    return { isValid: errors.length === 0, errors, warnings };
  }
}
