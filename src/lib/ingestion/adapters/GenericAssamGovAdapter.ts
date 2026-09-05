import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource } from "../types";

export class GenericAssamGovAdapter implements SourceAdapter {
  sourceConfig: IngestionSource;

  constructor(config: IngestionSource) {
    this.sourceConfig = config;
  }

  async discover(): Promise<RawContent[]> {
    try {
      const res = await fetch(this.sourceConfig.base_url, { 
        headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' },
        next: { revalidate: 3600 } 
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const items: RawContent[] = [];
      const keywords = ['recruit', 'advertisement', 'notice', 'apply', 'vacancy', 'admit card', 'result', 'tender', 'admission'];
      
      $('a').each((i, el) => {
        const title = $(el).text().trim().replace(/\s+/g, ' ');
        const link = $(el).attr('href');
        if (!title || !link || title.length < 5) return;
        
        const titleLower = title.toLowerCase();
        const linkLower = link.toLowerCase();
        
        const isMatch = keywords.some(kw => titleLower.includes(kw) || linkLower.includes(kw)) || linkLower.endsWith('.pdf');
        
        if (isMatch) {
           const absoluteHref = link.startsWith('http') ? link : new URL(link, this.sourceConfig.base_url).href;
           
           // avoid duplicate URLs in discover phase
           if (!items.find(item => item.externalId === absoluteHref)) {
             items.push({
               url: absoluteHref,
               externalId: absoluteHref,
               html: JSON.stringify({ title, link: absoluteHref })
             });
           }
        }
      });
      
      return items.slice(0, 15);
    } catch (error) {
       console.error(`${this.sourceConfig.source_name} Discovery Error:`, error);
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
      
      const titleLower = data.title.toLowerCase();
      let detectedType: 'JOB' | 'TENDER' | 'ADMISSION' | 'RESULT' | 'ADMIT_CARD' | 'SCHOLARSHIP' = 'JOB';
      
      if (titleLower.includes('result') || titleLower.includes('merit list') || titleLower.includes('selected')) detectedType = 'RESULT';
      else if (titleLower.includes('admit card') || titleLower.includes('call letter') || titleLower.includes('hall ticket')) detectedType = 'ADMIT_CARD';
      else if (titleLower.includes('admission')) detectedType = 'ADMISSION';
      else if (titleLower.includes('scholarship')) detectedType = 'SCHOLARSHIP';
      else if (titleLower.includes('tender') || titleLower.includes('e-procurement')) detectedType = 'TENDER';
      
      return {
        title: data.title,
        detectedType,
        url: raw.url,
        notificationUrl: data.link
      };
    } catch {
      return {};
    }
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url,
      applyUrl: undefined,
      notificationUrl: extracted.notificationUrl,
      contentType: extracted.detectedType || 'JOB',
      title: extracted.title || `Unknown ${this.sourceConfig.source_name} Notice`,
      organization: this.sourceConfig.source_name,
      externalId: extracted.notificationUrl || extracted.url
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
