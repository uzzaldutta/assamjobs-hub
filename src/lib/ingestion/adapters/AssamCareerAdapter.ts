import { proxyFetch } from '../proxyFetch';

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
      const endpoints = [
        { url: this.sourceConfig.base_url, limit: 4 },
        { url: 'https://www.assamcareer.com/search/label/Admit%20Card', limit: 2 },
        { url: 'https://www.assamcareer.com/search/label/Result', limit: 2 },
        { url: 'https://www.assamcareer.com/search/label/Scholarship', limit: 2 },
        { url: 'https://www.assamcareer.com/search/label/Admission', limit: 2 },
      ];

      const items: RawContent[] = [];
      const seen = new Set<string>();

      await Promise.allSettled(
        endpoints.map(async (ep) => {
          try {
            const res = await proxyFetch(ep.url, { 
              headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' },
              next: { revalidate: 3600 } 
            });
            if (!res.ok) return;
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
            console.warn(`Failed fetching label ${ep.url}:`, e);
          }
        })
      );

      return items;
    } catch (error) {
       console.error("AssamCareer Discovery Error:", error);
       throw error; // Fail loudly so it logs in ingestion_runs
    }
  }

  async fetch(content: RawContent): Promise<RawContent> {
    try {
       const res = await proxyFetch(content.url, { headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' }});
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
    
    const title = ($('h1.entry-title, .post h1, h1.post-title, h1.title').first().text().trim() || $('.entry-title, .post-title').first().text().trim()) || '';
    const bodyText = $('.post-body').text();
    const titleLower = title.toLowerCase();

    
    // Deep Extraction
    const orgMatch = bodyText.match(/Name of organization:\s*([^\n]+)/i) || bodyText.match(/Organization:\s*([^\n]+)/i);
    const dateMatch = bodyText.match(/Last Date:\s*([^\n]+)/i);
    const vacancyMatch = bodyText.match(/No of posts:\s*(\d+)/i) || bodyText.match(/Total Vacancy:\s*(\d+)/i);
    
    // Link Extraction Logic
    let applyUrl = '';
    let notificationUrl = '';
    
    $('.post-body a').each((i, el) => {
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
    if (titleLower.includes('result') || titleLower.includes('merit list') || titleLower.includes('cut off') || titleLower.includes('scorecard')) {
      detectedType = 'RESULT';
    } else if (titleLower.includes('admit card') || titleLower.includes('call letter') || titleLower.includes('hall ticket') || titleLower.includes('exam date')) {
      detectedType = 'ADMIT_CARD';
    } else if (titleLower.includes('admission') || titleLower.includes('entrance') || titleLower.includes('counseling')) {
      detectedType = 'ADMISSION';
    } else if (titleLower.includes('scholarship') || titleLower.includes('fellowship') || titleLower.includes('scheme')) {
      detectedType = 'SCHOLARSHIP';
    } else if (titleLower.includes('tender')) {
      detectedType = 'TENDER';
    }
    
    return {
      title,
      detectedType,
      url: raw.url,
      organization: orgMatch ? orgMatch[1].trim() : 'Unknown',
      lastDate: dateMatch ? dateMatch[1].trim() : undefined,
      vacancy: vacancyMatch ? vacancyMatch[1].trim() : undefined,
      applyUrl,
      notificationUrl,
      descriptionHTML: $(".post-body").html() || ""
    };
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url, // Original provenance link
      applyUrl: extracted.applyUrl || extracted.url, // Fallback if no specific link
      notificationUrl: extracted.notificationUrl,
      contentType: (extracted.detectedType as any) || 'JOB',
      title: extracted.title,
      organization: extracted.organization,
      applicationEnd: extracted.lastDate,
      vacancy: extracted.vacancy,
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
