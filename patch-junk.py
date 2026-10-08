import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """      // Universal basics (20 points max)
      if (payload.title && payload.title.length > 5) score += 10;
      if (payload.sourceUrl && this.isValidUrl(payload.sourceUrl)) score += 10;
      
      const tLow = payload.title ? payload.title.toLowerCase().trim() : '';
      if (tLow === 'advertisement' || tLow === 'notice' || tLow === 'corrigendum' || tLow === 'notification' || tLow === 'order' || tLow === 'results' || tLow === 'merit list' || tLow.length < 15) {
          score -= 50; // Penalize junk/generic titles heavily
      }"""

content = content.replace(
    "      // Universal basics (20 points max)\n      if (payload.title && payload.title.length > 5) score += 10;\n      if (payload.sourceUrl && this.isValidUrl(payload.sourceUrl)) score += 10;",
    replacement
)

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(content)