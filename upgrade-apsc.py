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
      // Defensive selector: If table is completely missing, throw error to alert Admin
      if ($('table').length === 0) {
        throw new Error("EXTRACTION_STRUCTURE_CHANGED: Expected <table> element not found on APSC page.");
      }

      $('table tr').each((i, row) => {
        if (i === 0) return; // skip header
        const tds = $(row).find('td');
        if (tds.length >= 3) {
          const title = $(tds[1]).text().trim();
          let notificationUrl = '';
          let applyUrl = '';

          // Look for all links in the row
          $(tds).find('a').each((_, a) => {
             const href = $(a).attr('href');
             const text = $(a).text().toLowerCase();
             if (!href) return;
             
             const absoluteHref = href.startsWith('http') ? href : new URL(href, this.sourceConfig.base_url).href;
             
             if (text.includes('apply') || absoluteHref.includes('apscrecruitment.in')) {
               applyUrl = absoluteHref;
             } else if (text.includes('download') || text.includes('advertisement') || absoluteHref.endsWith('.pdf')) {
               notificationUrl = absoluteHref;
             }
          });

          // Fallback if we only found one link
          if (!applyUrl && !notificationUrl) {
            const firstLink = $(tds).find('a').first().attr('href');
            if (firstLink) {
               notificationUrl = firstLink.startsWith('http') ? firstLink : new URL(firstLink, this.sourceConfig.base_url).href;
            }
          }

          const dateText = $(tds[2]).text().trim();
          
          if (title && (applyUrl || notificationUrl)) {
             items.push({
               url: applyUrl || notificationUrl || this.sourceConfig.base_url,
               externalId: applyUrl || notificationUrl,
               html: JSON.stringify({ title, dateText, applyUrl, notificationUrl }) 
             });
          }
        }
      });
      return items;
    } catch (error) {
       console.error("APSC Discovery Error:", error);
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
      return {
        title: data.title,
        date: data.dateText,
        applyUrl: data.applyUrl,
        notificationUrl: data.notificationUrl
      };
    } catch {
      return {};
    }
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: this.sourceConfig.base_url,
      applyUrl: extracted.applyUrl,
      notificationUrl: extracted.notificationUrl,
      contentType: 'JOB',
      title: extracted.title || 'Unknown APSC Notice',
      organization: 'Assam Public Service Commission (APSC)',
      applicationEnd: extracted.date || undefined,
      externalId: extracted.applyUrl || extracted.notificationUrl
    };
  }

  validate(payload: NormalizedPayload): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!payload.title) errors.push("Missing title");
    if (!payload.applyUrl && !payload.notificationUrl) errors.push("No actionable external link found");
    
    return { isValid: errors.length === 0, errors, warnings };
  }
}
"""
with open("src/lib/ingestion/adapters/APSCAdapter.ts", "w", encoding="utf-8") as f:
    f.write(code)
