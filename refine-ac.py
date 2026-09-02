code = """
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
           items.push({
             url: link,
             externalId: link
           });
        }
      });
      return items.slice(0, 15); // Limit Discovery per run
    } catch (error) {
       console.error("AssamCareer Discovery Error:", error);
       throw error; // Fail loudly so it logs in ingestion_runs
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
    
    // Deep Extraction
    const orgMatch = bodyText.match(/Name of organization:\s*([^\\n]+)/i) || bodyText.match(/Organization:\s*([^\\n]+)/i);
    const dateMatch = bodyText.match(/Last Date:\s*([^\\n]+)/i);
    const vacancyMatch = bodyText.match(/No of posts:\s*(\\d+)/i) || bodyText.match(/Total Vacancy:\s*(\\d+)/i);
    
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
    
    return {
      title,
      url: raw.url,
      organization: orgMatch ? orgMatch[1].trim() : 'Unknown',
      lastDate: dateMatch ? dateMatch[1].trim() : undefined,
      vacancy: vacancyMatch ? vacancyMatch[1].trim() : undefined,
      applyUrl,
      notificationUrl
    };
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url, // Original provenance link
      applyUrl: extracted.applyUrl || extracted.url, // Fallback if no specific link
      notificationUrl: extracted.notificationUrl,
      contentType: 'JOB',
      title: extracted.title,
      organization: extracted.organization,
      applicationEnd: extracted.lastDate,
      vacancy: extracted.vacancy,
      externalId: extracted.url
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
"""
with open("src/lib/ingestion/adapters/AssamCareerAdapter.ts", "w", encoding="utf-8") as f:
    f.write(code)
