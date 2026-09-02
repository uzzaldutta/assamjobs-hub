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
      
      // AssamCareer typical structure: h3.post-title a
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
      return items.slice(0, 10); // Limit during discovery for speed
    } catch (error) {
       console.error("AssamCareer Discovery Error:", error);
       return [];
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
    
    // Attempt to extract structured content
    // Typically they use bold labels inside .post-body
    const title = $('.post-title').text().trim() || '';
    const bodyText = $('.post-body').text();
    
    // Very basic regex extraction for Demo/Architecture purposes
    const orgMatch = bodyText.match(/Name of organization:\s*([^\\n]+)/i);
    const dateMatch = bodyText.match(/Last Date:\s*([^\\n]+)/i);
    const vacancyMatch = bodyText.match(/No of posts:\s*(\\d+)/i);
    
    return {
      title,
      url: raw.url,
      organization: orgMatch ? orgMatch[1].trim() : 'Unknown',
      lastDate: dateMatch ? dateMatch[1].trim() : undefined,
      vacancy: vacancyMatch ? vacancyMatch[1].trim() : undefined
    };
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url,
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
    
    if (payload.organization === 'Unknown') warnings.push("Organization could not be parsed confidently");
    
    return { isValid: errors.length === 0, errors, warnings };
  }
}
"""
with open("src/lib/ingestion/adapters/AssamCareerAdapter.ts", "w", encoding="utf-8") as f:
    f.write(code)
