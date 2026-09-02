code = """
export type ContentType = 
  | 'JOB' 
  | 'TENDER' 
  | 'ADMISSION' 
  | 'RESULT' 
  | 'ANSWER_KEY' 
  | 'ADMIT_CARD' 
  | 'NOTIFICATION' 
  | 'SCHOLARSHIP' 
  | 'SCHEME' 
  | 'PRIVATE_JOB' 
  | 'OTHER';

export type IngestionStatus = 
  | 'DISCOVERED' 
  | 'PROCESSING' 
  | 'VALIDATED' 
  | 'DUPLICATE_RISK' 
  | 'READY_FOR_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'FAILED' 
  | 'PUBLISHED';

export interface NormalizedPayload {
  source_id?: string;
  source: string;
  sourceUrl: string;
  contentType: ContentType;
  title: string;
  organization?: string;
  location?: string;
  description?: string;
  publishedDate?: string;
  applicationStart?: string;
  applicationEnd?: string;
  qualification?: string[];
  salary?: string;
  vacancy?: string;
  category?: string;
  tags?: string[];
  attachments?: Array<{ url: string; title: string; type: string }>;
  externalId?: string;
  metadata?: Record<string, any>;
}

export interface RawContent {
  url: string;
  html?: string;
  json?: any;
  xml?: any;
  externalId?: string;
}

export interface IngestionSource {
  id: string;
  source_name: string;
  base_url: string;
  source_type: string;
  adapter_name: string;
  is_active: boolean;
}

export interface QueueItem {
  id: string;
  source_id: string;
  content_type: ContentType;
  external_id?: string;
  source_url: string;
  title: string;
  normalized_payload: NormalizedPayload;
  raw_payload?: any;
  content_hash: string;
  status: IngestionStatus;
  quality_score: number;
  duplicate_score: number;
  duplicate_of?: string;
  validation_errors: any[];
  validation_warnings: any[];
}
"""
with open("src/lib/ingestion/types.ts", "w", encoding="utf-8") as f:
    f.write(code)
