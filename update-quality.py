import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_score = """  static calculateQualityScore(payload: NormalizedPayload): number {
    let score = 0;
    const type = payload.contentType;
    
    // Universal basics (20 points max)
    if (payload.title && payload.title.length > 5) score += 10;
    if (payload.sourceUrl && this.isValidUrl(payload.sourceUrl)) score += 10;

    // Feed specific scoring (80 points max)
    switch (type) {
      case 'JOB':
        if (payload.organization && payload.organization !== 'Unknown') score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 20;
        if (payload.qualification && payload.qualification.length > 0) score += 10;
        if (payload.vacancy) score += 10;
        break;
      case 'TENDER':
        if (payload.tenderNumber) score += 20;
        if (payload.organization || payload.department) score += 20;
        if (payload.applicationEnd) score += 20; // Closing date
        if (payload.notificationUrl && this.isValidUrl(payload.notificationUrl)) score += 20;
        break;
      case 'ADMISSION':
        if (payload.organization) score += 20; // Institution
        if (payload.course) score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 20;
        break;
      case 'RESULT':
        if (payload.examName || payload.title) score += 20;
        if (payload.organization) score += 20;
        if (payload.resultDate || payload.applicationEnd) score += 20;
        if (payload.applyUrl || payload.notificationUrl) score += 20;
        break;
      case 'ADMIT_CARD':
        if (payload.examName || payload.title) score += 20;
        if (payload.examDate || payload.applicationEnd) score += 20;
        if (payload.releaseDate) score += 20;
        if (payload.applyUrl || payload.notificationUrl) score += 20;
        break;
      case 'SCHOLARSHIP':
        if (payload.scheme || payload.title) score += 20;
        if (payload.eligibility) score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl && this.isValidUrl(payload.applyUrl)) score += 20;
        break;
      default:
        // Generic fallback
        if (payload.organization) score += 20;
        if (payload.applicationEnd) score += 20;
        if (payload.applyUrl) score += 20;
        if (payload.notificationUrl) score += 20;
    }
    
    // Cap at 100
    return Math.min(score, 100);
  }"""

content = re.sub(
    r'static calculateQualityScore\([^\{]+\{[\s\S]*?return score;\s*\}',
    new_score,
    content
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
