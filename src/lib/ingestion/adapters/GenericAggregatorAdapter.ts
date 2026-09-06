import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource } from "../types";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export class GenericAggregatorAdapter implements SourceAdapter {
  sourceConfig: IngestionSource;

  constructor(config: IngestionSource) {
    this.sourceConfig = config;
  }

  async discover(): Promise<RawContent[]> {
    try {
      const res = await fetch(this.sourceConfig.base_url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        next: { revalidate: 3600 } 
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const items: RawContent[] = [];
      const links = new Set<string>();

      // Try multiple common WordPress / Aggregator selectors
      const selectors = ['.entry-title a', '.post-title a', 'h2 a', 'h3 a', '.title a'];
      
      for (const selector of selectors) {
        $(selector).each((i, el) => {
          const title = $(el).text().trim();
          let link = $(el).attr('href');
          
          if (title && title.length > 15 && link && link.startsWith('http') && !links.has(link)) {
            links.add(link);
            items.push({
               url: link,
               externalId: link
            });
          }
        });
        if (items.length >= 10) break; // If we found good links, stop searching lower-priority selectors
      }
      return items.slice(0, 15);
    } catch (error) {
       console.error(`GenericAggregator Discovery Error [${this.sourceConfig.base_url}]:`, error);
       throw error;
    }
  }

  async fetch(content: RawContent): Promise<RawContent> {
    try {
       const res = await fetch(content.url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }});
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
    
    const title = $('.entry-title').text().trim() || $('.post-title').text().trim() || $('h1').first().text().trim();
    const bodyText = $('.entry-content').text() || $('article').text() || $('body').text();
    const titleLower = title.toLowerCase();

    // Pattern matches
    const orgMatch = bodyText.match(/Name of Organization:\s*([^\n]+)/i) || bodyText.match(/Organization Name:\s*([^\n]+)/i) || bodyText.match(/Organization:\s*([^\n]+)/i);
    const dateMatch = bodyText.match(/Last Date:\s*([^\n]+)/i) || bodyText.match(/Closing Date:\s*([^\n]+)/i);
    const vacancyMatch = bodyText.match(/Total Vacancy:\s*(\d+)/i) || bodyText.match(/No of Posts?:\s*(\d+)/i);
    
    // Link Extraction Logic
    let applyUrl = '';
    let notificationUrl = '';
    
    $('a').each((i, el) => {
      const linkText = $(el).text().toLowerCase();
      const href = $(el).attr('href');
      if (!href || href.includes('whatsapp') || href.includes('t.me') || href.includes('facebook')) return;
      
      if (linkText.includes('apply') || linkText.includes('online application')) {
        applyUrl = href;
      } else if (linkText.includes('notification') || linkText.includes('advertisement') || href.endsWith('.pdf')) {
        notificationUrl = href;
      }
    });

    let detectedType: 'JOB' | 'TENDER' | 'ADMISSION' | 'RESULT' | 'ADMIT_CARD' | 'SCHOLARSHIP' = 'JOB';
    if (titleLower.includes('result') || titleLower.includes('merit list')) detectedType = 'RESULT';
    else if (titleLower.includes('admit card') || titleLower.includes('call letter') || titleLower.includes('hall ticket')) detectedType = 'ADMIT_CARD';
    else if (titleLower.includes('admission')) detectedType = 'ADMISSION';
    else if (titleLower.includes('scholarship')) detectedType = 'SCHOLARSHIP';
    else if (titleLower.includes('tender')) detectedType = 'TENDER';
    
    return {
      title,
      detectedType,
      url: raw.url,
      organization: orgMatch ? orgMatch[1].trim() : 'Unknown',
      lastDate: dateMatch ? dateMatch[1].trim() : undefined,
      vacancy: vacancyMatch ? vacancyMatch[1].trim() : undefined,
      applyUrl,
      notificationUrl
    };
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    const payload: NormalizedPayload = {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url,
      applyUrl: extracted.applyUrl || undefined,
      notificationUrl: extracted.notificationUrl,
      contentType: extracted.detectedType || 'JOB',
      title: extracted.title || 'Unknown Post',
      organization: extracted.organization || 'Unknown',
      applicationEnd: extracted.lastDate || undefined,
      externalId: extracted.url
    };
    if (extracted.vacancy) payload.vacancy = extracted.vacancy;
    return payload;
  }

  validate(payload: NormalizedPayload): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!payload.title || payload.title === 'Unknown Post') errors.push("Missing title");
    if (!payload.applyUrl && !payload.notificationUrl) warnings.push("No application or notification link found");
    return { isValid: errors.length === 0, errors, warnings };
  }
}
