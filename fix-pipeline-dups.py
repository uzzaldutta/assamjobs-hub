import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix detectDuplicates to distinguish Queue exact matches vs Jobs matches
replacement = """
  static async detectDuplicates(payload: NormalizedPayload): Promise<{ score: number, duplicateOf?: string, risk: string, existingRecord?: any, inQueue?: boolean }> {
    // 1. Check if hash exists in queue
    const hash = this.generateHash(payload);
    const { data: exactQueue } = await supabase
      .from('ingestion_queue')
      .select('id, content_hash')
      .eq('content_hash', hash)
      .limit(1);

    if (exactQueue && exactQueue.length > 0) {
      return { score: 1.0, duplicateOf: exactQueue[0].id, risk: 'EXACT', inQueue: true };
    }

    // 2. Exact URL Match in Jobs
    const { data: exactJobs } = await supabase
"""

content = content.replace("""
  static async detectDuplicates(payload: NormalizedPayload): Promise<{ score: number, duplicateOf?: string, risk: string, existingRecord?: any }> {
    // 1. Exact URL Match in Jobs
    const { data: exactJobs } = await supabase
""", replacement)


# Fix the processing loop
processing_replacement = """
          const dupCheck = await this.detectDuplicates(normalized);
          
          if (dupCheck.inQueue) {
             duplicates++;
             continue; // Silently skip if already in the queue unchanged
          }
"""

content = content.replace("""
          const dupCheck = await this.detectDuplicates(normalized);
""", processing_replacement)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
