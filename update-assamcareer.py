code = """import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource } from "../types";

export class AssamCareerAdapter implements SourceAdapter {
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
      $('.post-title a').each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr('href');
        if (title && link) {
           items.push({ url: link, externalId: link });
        }
      });
      return items.slice(0, 15);
    } catch (error) {
       console.error("AssamCareer Discovery Error:", error);
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
    
    const title = $('.post-title').text().trim() || '';
    const bodyText = $('.post-body').text();
    const titleLower = title.toLowerCase();
    
    // Pattern matches
    const orgMatch = bodyText.match(/Name of organization:.*?([A-Za-z\s]+)/i);
    const dateMatch = bodyText.match(/Last Date:.*?([\d]{1,2}.[\d]{1,2}.[\d]{4}|[A-Za-z]+\s\d+,\s\d{4})/i);
    const vacancyMatch = bodyText.match(/No of posts:.*?(\d+)/i);
    
    let applyUrl = '';
    let notificationUrl = '';
    
    $('.post-body a').each((i, el) => {
      const linkText = $(el).text().toLowerCase();
      const href = $(el).attr('href');
      if (!href) return;
      if (linkText.includes('apply') || linkText.includes('online') || linkText.includes('download')) {
        applyUrl = href;
      } else if (linkText.includes('advertisement') || href.endsWith('.pdf')) {
        notificationUrl = href;
      }
    });

    let detectedType: 'JOB' | 'TENDER' | 'ADMISSION' | 'RESULT' | 'ADMIT_CARD' | 'SCHOLARSHIP' = 'JOB';
    if (titleLower.includes('result') || titleLower.includes('merit list')) detectedType = 'RESULT';
    else if (titleLower.includes('admit card') || titleLower.includes('call letter')) detectedType = 'ADMIT_CARD';
    else if (titleLower.includes('admission')) detectedType = 'ADMISSION';
    else if (titleLower.includes('scholarship')) detectedType = 'SCHOLARSHIP';
    else if (titleLower.includes('tender')) detectedType = 'TENDER';
    
    return {
      title,
      url: raw.url,
      organization: orgMatch ? orgMatch[1].trim() : 'Unknown',
      lastDate: dateMatch ? dateMatch[1].trim() : undefined,
      vacancy: vacancyMatch ? vacancyMatch[1].trim() : undefined,
      applyUrl,
      notificationUrl,
      detectedType
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
"""
with open("src/lib/ingestion/adapters/AssamCareerAdapter.ts", "w", encoding="utf-8") as f:
    f.write(code)
