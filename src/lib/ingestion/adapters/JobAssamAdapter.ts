
import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource } from "../types";

export class JobAssamAdapter implements SourceAdapter {
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
      // JobAssam typical structure: h2.entry-title a
      $('.entry-title a').each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr('href');
        
        if (title && link) {
           items.push({
             url: link,
             externalId: link
           });
        }
      });
      return items.slice(0, 15);
    } catch (error) {
       console.error("JobAssam Discovery Error:", error);
       throw error;
    }
  }

  async fetch(content: RawContent): Promise<RawContent> {
    try {
       const res = await fetch(content.url, { headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' }});
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
    
    const title = $('.entry-title').text().trim() || '';
    const bodyText = $('.entry-content').text();
    const titleLower = title.toLowerCase();

    
    // Pattern matches
    const orgMatch = bodyText.match(/Name of Organization:\s*([^\n]+)/i) || bodyText.match(/Organization Name:\s*([^\n]+)/i);
    const dateMatch = bodyText.match(/Last Date:\s*([^\n]+)/i);
    const vacancyMatch = bodyText.match(/Total Vacancy:\s*(\d+)/i) || bodyText.match(/No of Posts:\s*(\d+)/i);
    
    // Link Extraction Logic
    let applyUrl = '';
    let notificationUrl = '';
    
    $('.entry-content a').each((i, el) => {
      const linkText = $(el).text().toLowerCase();
      const href = $(el).attr('href');
      if (!href) return;
      
      if (linkText.includes('apply') || linkText.includes('online application')) {
        applyUrl = href;
      } else if (linkText.includes('notification') || href.endsWith('.pdf')) {
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
      title: extracted.title,
      organization: extracted.organization,
      externalId: extracted.url
    };

    if (payload.contentType === 'JOB') {
        payload.applicationEnd = extracted.lastDate;
        payload.vacancy = extracted.vacancy;
    } else if (payload.contentType === 'ADMIT_CARD' || payload.contentType === 'RESULT') {
        payload.examName = extracted.title;
        payload.resultDate = extracted.lastDate;
        payload.releaseDate = extracted.lastDate;
    }

    return payload;
  }

  validate(payload: NormalizedPayload): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!payload.title) errors.push("Missing title");
    if (!payload.sourceUrl) errors.push("Missing source URL");
    
    return { isValid: errors.length === 0, errors, warnings };
  }
}
