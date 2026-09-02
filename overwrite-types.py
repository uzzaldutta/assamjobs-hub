code = """
export type ContentType = 'JOB' | 'PRIVATE_JOB' | 'TENDER' | 'ADMISSION' | 'RESULT';

export interface RawContent {
  url: string;
  externalId?: string;
  html?: string;
  json?: any;
}

export interface NormalizedPayload {
  source: string;
  sourceUrl: string;
  notificationUrl?: string;
  applyUrl?: string;
  contentType: ContentType;
  title: string;
  organization?: string;
  department?: string;
  applicationEnd?: string;
  vacancy?: string;
  estimatedValue?: string;
  tenderNumber?: string;
  course?: string;
  examName?: string;
  qualification?: string;
  description?: string;
  externalId?: string;
  attachments?: any[];
  category?: string;
  location?: string;
}

export interface IngestionSource {
  id: string;
  source_name: string;
  base_url: string;
  adapter_name: string;
  is_official: boolean;
  tier: number;
  feed_type?: string;
  is_active: boolean;
}

export interface QueueItem {
  id: string;
  source_id: string;
  content_type: ContentType;
  external_id: string;
  source_url: string;
  title: string;
  normalized_payload: NormalizedPayload;
  raw_payload: any;
  content_hash: string;
  status: 'NEW' | 'APPROVED' | 'REJECTED' | 'DUPLICATE_RISK' | 'CHANGE_DETECTED' | 'POSSIBLE_MATCH' | 'LOW_QUALITY' | 'FAILED';
  quality_score: number;
  duplicate_score: number;
  duplicate_of?: string;
  change_diff?: any[];
  validation_errors: string[];
  validation_warnings: string[];
  created_at: string;
}
"""
with open("src/lib/ingestion/types.ts", "w", encoding="utf-8") as f:
    f.write(code)
