import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

replacement = """
  static calculateQualityScore(payload: NormalizedPayload): number {
    let score = 0;
    if (payload.title && payload.title.length > 5) score += 20;
    if (payload.organization && payload.organization !== 'Unknown') score += 20;
    if (payload.sourceUrl && this.isValidUrl(payload.sourceUrl)) score += 10;
    if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 10;
    if (payload.notificationUrl && this.isValidUrl(payload.notificationUrl)) score += 10;
    if (payload.applicationEnd) score += 15;
    if (payload.qualification && payload.qualification.length > 0) score += 10;
    if (payload.description || payload.attachments?.length) score += 5;
    return score;
  }
"""

content = re.sub(
    r'static\s*calculateQualityScore[\s\S]*?return\s*score;\s*\}',
    replacement,
    content
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
