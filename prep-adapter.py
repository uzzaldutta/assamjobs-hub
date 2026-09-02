code = """
import { NormalizedPayload, RawContent, IngestionSource } from "./types";

export interface SourceAdapter {
  sourceConfig: IngestionSource;
  
  /**
   * Discover new content links or basic raw objects from the source.
   */
  discover(): Promise<RawContent[]>;
  
  /**
   * Fetch full details if necessary (e.g. following a link).
   */
  fetch(content: RawContent): Promise<RawContent>;
  
  /**
   * Extract raw payload into an unstructured but JS-accessible format.
   */
  extract(raw: RawContent): Promise<any>;
  
  /**
   * Map the extracted content to the strict NormalizedPayload format.
   */
  normalize(extracted: any): Promise<NormalizedPayload>;
  
  /**
   * Validate if the normalized payload meets basic criteria.
   */
  validate(payload: NormalizedPayload): { isValid: boolean; errors: string[]; warnings: string[] };
}
"""
with open("src/lib/ingestion/BaseAdapter.ts", "w", encoding="utf-8") as f:
    f.write(code)
