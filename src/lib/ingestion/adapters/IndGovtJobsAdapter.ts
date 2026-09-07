import { GenericAggregatorAdapter } from "./GenericAggregatorAdapter";
import { RawContent, NormalizedPayload } from "../types";

export class IndGovtJobsAdapter extends GenericAggregatorAdapter {
  async extract(raw: RawContent): Promise<any> {
    const extracted = await super.extract(raw);
    
    const titleLower = (extracted.title || '').toLowerCase();
    const urlLower = (raw.url || '').toLowerCase();
    const isFromRailwayCategory = this.sourceConfig.base_url.includes('railway-jobs');
    
    const hasStrongRailwayKeyword = titleLower.includes('rrb') || titleLower.includes('nfr') || titleLower.includes('railway recruitment') || titleLower.includes('northeast frontier railway');

    // Use strong context: either it was scraped from the dedicated railway category URL, or it has unambiguous railway keywords
    if (isFromRailwayCategory || hasStrongRailwayKeyword) {
       extracted.category = 'RAILWAY';
    }
    
    return extracted;
  }

  async normalize(extracted: any): Promise<NormalizedPayload> {
    const payload = await super.normalize(extracted);
    if (extracted.category) {
       payload.category = extracted.category;
    }
    return payload;
  }
}
