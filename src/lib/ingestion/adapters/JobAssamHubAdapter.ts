import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource, ContentType } from "../types";
import { normalizeDate } from "../duplicate-matcher";

export class JobAssamHubAdapter implements SourceAdapter {
  sourceConfig: IngestionSource;

  constructor(config: IngestionSource) {
    this.sourceConfig = config;
  }

  async discover(): Promise<RawContent[]> {
    try {
      const res = await fetch(`${this.sourceConfig.base_url}/feed/`, { 
        headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      
      const items: RawContent[] = [];
      $('item').each((i, el) => {
        const title = $(el).find('title').text().trim();
        const link = $(el).find('link').text().trim();
        const categories = $(el).find('category').map((i, c) => $(c).text()).get();
        
        if (title && link) {
           items.push({
             url: link,
             externalId: link,
             json: { categories }
           });
        }
      });
      return items.slice(0, 8);
    } catch (error) {
       console.error("JobAssamHub Discovery Error:", error);
       throw error;
    }
  }

  async fetch(content: RawContent): Promise<RawContent> {
    try {
       const res = await fetch(content.url, { 
         headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' },
         signal: AbortSignal.timeout(8000)
       });
       if (res.ok) {
         content.html = await res.text();
       }
    } catch (e) {
      console.warn("Failed fetching detail:", content.url);
    }
    return content;
  }

  async extract(content: RawContent): Promise<any> {
    if (!content.html) return content;
    const $ = cheerio.load(content.html);
    const title = ($('h1.entry-title').first().text().trim() || $('h2.entry-title').first().text().trim() || $('title').first().text().trim()) || '';
    
    let description = "";
    let notificationUrl = "";
    let applyUrl = "";
    let lastDate = "";
    let organization = "";
    let vacancies = "";

    // 1. Scan all tables for metadata & links
    $('table tr').each((_, tr) => {
      const rowText = $(tr).text().toLowerCase();
      const firstCell = $(tr).find('th, td').first().text().trim().toLowerCase();
      const lastCell = $(tr).find('td').last().text().trim();
      const linkEl = $(tr).find('a');
      const href = linkEl.attr('href');

      // Key-value metadata
      if (firstCell.includes('organization') || firstCell.includes('department')) {
        if (!organization) organization = lastCell;
      } else if (firstCell.includes('no of post') || firstCell.includes('vacancy') || firstCell.includes('posts')) {
        if (!vacancies) vacancies = lastCell;
      } else if (firstCell.includes('last date') || firstCell.includes('closing date')) {
        if (!lastDate) lastDate = lastCell;
      }

      // Links
      if (href) {
        const lowerHref = href.toLowerCase();
        if (!lowerHref.includes('whatsapp') && !lowerHref.includes('telegram') && !lowerHref.includes('t.me')) {
          if ((rowText.includes('apply') || rowText.includes('application form') || rowText.includes('online application')) && !applyUrl) {
            applyUrl = href;
          } else if ((rowText.includes('notification') || rowText.includes('advertisement') || href.endsWith('.pdf')) && !notificationUrl) {
            notificationUrl = href;
          }
        }
      }
    });

    // 2. Fallback organization extraction from title
    if (!organization) {
      const matchOrg = title.match(/^([A-Za-z0-9\s\.\,\&]+?)\s+(?:Recruitment|Vacancy|Jobs|Admit Card|Result|Admission)/i);
      if (matchOrg && matchOrg[1].length > 2 && matchOrg[1].length < 50) {
        organization = matchOrg[1].trim();
      }
    }

    // 3. Fallback links from content body
    if (!applyUrl || !notificationUrl) {
      $('.entry-content a').each((_, a) => {
        const text = $(a).text().toLowerCase().trim();
        const href = $(a).attr('href');
        if (!href) return;
        const lowerHref = href.toLowerCase();
        if (lowerHref.includes('whatsapp') || lowerHref.includes('telegram') || lowerHref.includes('t.me')) return;

        if (!applyUrl && (text.includes('apply online') || text.includes('click here to apply'))) {
          applyUrl = href;
        } else if (!notificationUrl && (text.includes('official notification') || text.includes('advertisement') || href.endsWith('.pdf'))) {
          notificationUrl = href;
        }
      });
    }

    const cleanBody = $('.entry-content').clone();
    cleanBody.find('script, style, ins, iframe, .adsbygoogle').remove();
    description = cleanBody.html() || "";

    return {
        ...content,
        extractedTitle: title.replace(" - Job Assam Hub", "").trim(),
        extractedDescription: description,
        organization: organization || 'Unknown',
        vacancies: vacancies || undefined,
        notificationUrl: notificationUrl || undefined,
        applyUrl: applyUrl || undefined,
        lastDate: normalizeDate(lastDate) || lastDate || undefined
    };
  }

  async normalize(extractedData: any): Promise<NormalizedPayload> {
    let contentType: ContentType = 'JOB';
    const cats = extractedData.json?.categories || [];
    const catString = cats.join(' ').toLowerCase();
    const title = (extractedData.extractedTitle || "").toLowerCase();

    if (catString.includes('admission') || title.includes('admission') || title.includes('entrance') || title.includes('counseling')) contentType = 'ADMISSION';
    else if (catString.includes('result') || title.includes('result') || title.includes('merit list') || title.includes('cut off') || title.includes('scorecard')) contentType = 'RESULT';
    else if (catString.includes('admit card') || title.includes('admit card') || title.includes('hall ticket') || title.includes('call letter') || title.includes('exam date')) contentType = 'ADMIT_CARD';
    else if (catString.includes('scholarship') || title.includes('scholarship') || catString.includes('scheme') || title.includes('fellowship')) contentType = 'SCHOLARSHIP';
    
    return {
        source: this.sourceConfig.source_name,
        sourceUrl: extractedData.url,
        contentType,
        title: extractedData.extractedTitle || "Unknown Title",
        organization: extractedData.organization || "Various Departments",
        description: extractedData.extractedDescription || "",
        notificationUrl: extractedData.notificationUrl || undefined,
        applyUrl: extractedData.applyUrl || extractedData.notificationUrl || extractedData.url,
        applicationEnd: extractedData.lastDate || undefined,
        vacancy: extractedData.vacancies || undefined,
        externalId: extractedData.externalId
    };
  }

  validate(payload: NormalizedPayload): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    if (!payload.title || payload.title.length < 5) errors.push('INVALID_TITLE');
    if (!payload.sourceUrl) errors.push('MISSING_URL');
    return { isValid: errors.length === 0, errors, warnings: [] };
  }
}
