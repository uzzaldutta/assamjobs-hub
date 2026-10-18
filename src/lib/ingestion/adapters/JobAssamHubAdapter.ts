import * as cheerio from 'cheerio';
import { SourceAdapter } from "../BaseAdapter";
import { RawContent, NormalizedPayload, IngestionSource, ContentType } from "../types";

export class JobAssamHubAdapter implements SourceAdapter {
  sourceConfig: IngestionSource;

  constructor(config: IngestionSource) {
    this.sourceConfig = config;
  }

  async discover(): Promise<RawContent[]> {
    try {
      const res = await fetch(`${this.sourceConfig.base_url}/feed/`, { 
        headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' },
        next: { revalidate: 3600 } 
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
      return items.slice(0, 5);
    } catch (error) {
       console.error("JobAssamHub Discovery Error:", error);
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

  async extract(content: RawContent): Promise<any> {
    if (!content.html) return content;
    const $ = cheerio.load(content.html);
    const title = ($('h1.entry-title').first().text().trim() || $('h2.entry-title').first().text().trim() || $('title').first().text().trim()) || '';
    
    let description = "";
    let notificationUrl = "";
    let applyUrl = "";
    let lastDate = "";
    
    // Convert tables to markdown
    $('figure.wp-block-table table').each((i, el) => {
        const headers: string[] = [];
        $(el).find('th').each((j, th) => { headers.push($(th).text().trim()); });
        
        if (headers.length > 0) {
            description += `| ${headers.join(" | ")} |\n`;
            description += `| ${headers.map(() => '---').join(' | ')} |\n`;
        }
        
        $(el).find('tbody tr').each((j, tr) => {
            const row: string[] = [];
            $(tr).find('td').each((k, td) => {
                const text = $(td).text().replace(/\s+/g, ' ').trim();
                const link = $(td).find('a').attr('href');
                if (link && text.toLowerCase().includes('click here')) {
                    row.push(`[Click Here](${link})`);
                    if ($(td).prev().text().toLowerCase().includes('notification')) notificationUrl = link;
                    if ($(td).prev().text().toLowerCase().includes('apply') || $(td).prev().text().toLowerCase().includes('online')) applyUrl = link;
                } else {
                    row.push(text);
                    if (text && $(td).prev().text().toLowerCase().includes('last date')) {
                        lastDate = text;
                    }
                }
            });
            if(row.length > 0) {
                if (headers.length === 0 && j === 0) {
                    // No headers, fake them for markdown
                    description += `| ${row.map((_, idx) => `Col ${idx+1}`).join(" | ")} |\n`;
                    description += `| ${row.map(() => '---').join(' | ')} |\n`;
                }
                description += `| ${row.join(" | ")} |\n`;
            }
        });
        description += "\n\n";
    });

    return {
        ...content,
        extractedTitle: title,
        extractedDescription: description,
        notificationUrl,
        applyUrl,
        lastDate
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
        title: extractedData.extractedTitle?.replace(" - Job Assam Hub", "").trim() || "Unknown Title",
        organization: "AssamJobs Hub", // Or try to parse from title
        description: extractedData.extractedDescription || "",
        notificationUrl: extractedData.notificationUrl || undefined,
        applyUrl: extractedData.applyUrl || undefined,
        applicationEnd: extractedData.lastDate || undefined,
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
