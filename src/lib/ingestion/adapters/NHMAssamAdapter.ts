import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource } from "../types";

export class NHMAssamAdapter implements SourceAdapter {
  sourceConfig: IngestionSource;
  private readonly RECRUITMENT_URL = 'https://nhmssd.assam.gov.in/eHRMIS_latest/Recruitments';

  constructor(config: IngestionSource) {
    this.sourceConfig = config;
  }

  async discover(): Promise<RawContent[]> {
    try {
      const res = await fetch(this.RECRUITMENT_URL, { 
        headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0', 'Accept': 'text/html' },
        next: { revalidate: 3600 } 
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const items: RawContent[] = [];
      
      $('div.row').each((i, row) => {
          const links = $(row).find('a');
          if (links.length === 0) return;
          
          const rawText = $(row).text().replace(/\s+/g, ' ').trim();
          let applyUrl = '';
          let notificationUrl = '';
          
          links.each((j, a) => {
              const href = $(a).attr('href');
              if (!href) return;
              
              const linkText = $(a).text().toLowerCase();
              if (linkText.includes('apply') || href.includes('apply')) {
                  applyUrl = href;
              } else if (href.endsWith('.pdf') || linkText.includes('notice') || linkText.includes('advertisement')) {
                  notificationUrl = href.startsWith('http') ? href : new URL(href, this.RECRUITMENT_URL).href;
              }
          });
          
          if (!notificationUrl) {
              const first = links.first().attr('href');
              if (first) notificationUrl = first.startsWith('http') ? first : new URL(first, this.RECRUITMENT_URL).href;
          }
          
          // We need a clean title. Usually the rawText contains the title + link text combined.
          // Let's just use the first line or rawText as title and clean it in extract.
          
          if (notificationUrl && rawText.length > 5) {
             items.push({
                 url: notificationUrl,
                 externalId: notificationUrl,
                 html: JSON.stringify({ rawText, applyUrl, notificationUrl })
             });
          }
      });
      
      // Filter out non-recruitment transfers/orders if desired, but we can do that in extract
      return items.slice(0, 15);
    } catch (error) {
       console.error(`NHMAssam Discovery Error:`, error);
       throw error;
    }
  }

  async fetch(content: RawContent): Promise<RawContent> {
    return content;
  }

  async extract(raw: RawContent): Promise<any> {
    if (!raw.html) return {};
    try {
      const data = JSON.parse(raw.html);
      
      // Clean title: remove the link text from the end if possible, or just use it.
      let title = data.rawText;
      const titleLower = title.toLowerCase();
      
      // Attempt to identify non-jobs
      let detectedType: 'JOB' | 'TENDER' | 'ADMISSION' | 'RESULT' | 'ADMIT_CARD' | 'SCHOLARSHIP' = 'JOB';
      
      if (titleLower.includes('transfer') || titleLower.includes('order')) {
          // NHM posts a lot of internal employee transfers here. We should skip them.
          return { skip: true };
      }
      
      if (titleLower.includes('result') || titleLower.includes('merit list') || titleLower.includes('selected')) detectedType = 'RESULT';
      else if (titleLower.includes('admit card') || titleLower.includes('call letter') || titleLower.includes('hall ticket')) detectedType = 'ADMIT_CARD';
      else if (titleLower.includes('tender') || titleLower.includes('e-procurement')) detectedType = 'TENDER';
      
      return {
        title: title,
        detectedType,
        url: raw.url,
        applyUrl: data.applyUrl,
        notificationUrl: data.notificationUrl
      };
    } catch {
      return {};
    }
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    if (extracted.skip) {
        // Return dummy payload that fails validation to drop it
        return {} as NormalizedPayload;
    }
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.notificationUrl || extracted.url, // Canonical source URL
      applyUrl: extracted.applyUrl || undefined,
      notificationUrl: extracted.notificationUrl,
      contentType: extracted.detectedType || 'JOB',
      title: extracted.title,
      organization: 'National Health Mission (NHM), Assam',
      externalId: extracted.notificationUrl
    };
  }

  validate(payload: NormalizedPayload): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!payload.title) errors.push("Missing title");
    if (!payload.sourceUrl) errors.push("Missing source URL");
    
    return { isValid: errors.length === 0, errors, warnings };
  }
}
