code = """
import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource } from "../types";

export class APSCAdapter implements SourceAdapter {
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
      // Mocked CSS selector structure for APSC 'Advertisements' table
      // In production, we inspect the live DOM. e.g., table tbody tr
      $('table tr').each((i, row) => {
        if (i === 0) return; // skip header
        const tds = $(row).find('td');
        if (tds.length >= 3) {
          const title = $(tds[1]).text().trim();
          const link = $(tds[1]).find('a').attr('href');
          const dateText = $(tds[2]).text().trim();
          
          if (title && link) {
             items.push({
               url: link.startsWith('http') ? link : new URL(link, this.sourceConfig.base_url).href,
               html: `<title>${title}</title><date>${dateText}</date>` // pass minimal scraped DOM
             });
          }
        }
      });
      return items;
    } catch (error) {
       console.error("APSC Discovery Error:", error);
       return [];
    }
  }

  async fetch(content: RawContent): Promise<RawContent> {
    // APSC details are often just the PDF link in the table itself.
    // If it's a detail page, we'd fetch it here. For now, pass through.
    return content;
  }

  async extract(raw: RawContent): Promise<any> {
    if (!raw.html) return {};
    const $ = cheerio.load(raw.html);
    return {
      title: $('title').text(),
      date: $('date').text(),
      url: raw.url
    };
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url,
      contentType: 'JOB',
      title: extracted.title || 'Unknown APSC Notice',
      organization: 'Assam Public Service Commission (APSC)',
      applicationEnd: extracted.date || undefined,
      externalId: extracted.url
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
"""
with open("src/lib/ingestion/adapters/APSCAdapter.ts", "w", encoding="utf-8") as f:
    f.write(code)
