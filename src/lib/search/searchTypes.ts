
export type SearchItemType = "JOB" | "EXAM" | "TOPIC" | "MOCK_TEST";

export interface SearchResultMetadata {
  location?: string;
  qualification?: string;
  job_type?: string;
  last_date?: string;
  category?: string;
  slug?: string;
  description?: string;
  chapter_id?: string;
  subject_id?: string;
  exam_id?: string;
  exam_slug?: string;
  duration_minutes?: number;
  total_marks?: number;
}

export interface SearchResultItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  metadata: SearchResultMetadata;
  relevanceScore: number;
}

export interface PaginatedSearchResult {
  results: SearchResultItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
