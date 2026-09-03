import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

validation_logic = """
          let finalStatus = 'NEW';
          if (source.tier > 1 && !source.is_official) finalStatus = 'VERIFICATION_PENDING';
          
          if (!normalized.sourceUrl) {
            validation.errors.push('MISSING_LINK');
            itemsMissingLink++;
            finalStatus = 'LOW_QUALITY';
          } else if (!this.isValidUrl(normalized.sourceUrl)) {
            validation.errors.push('INVALID_LINK');
            itemsInvalidLink++;
            finalStatus = 'LOW_QUALITY';
          }

          // Feed-specific link requirements
          if (normalized.contentType === 'JOB' && !normalized.applyUrl) {
            if (normalized.notificationUrl) {
              validation.warnings.push('MISSING_APPLY_LINK_BUT_HAS_PDF');
            } else {
              validation.warnings.push('MISSING_APPLY_LINK');
              if (finalStatus !== 'LOW_QUALITY') {
                  finalStatus = 'LOW_QUALITY';
                  itemsMissingLink++;
              }
            }
          }
          if (normalized.contentType === 'TENDER' && !normalized.notificationUrl) {
              validation.warnings.push('MISSING_DOCUMENT_LINK');
          }
"""

content = re.sub(
    r'let finalStatus = \'NEW\';[\s\S]*?finalStatus = \'LOW_QUALITY\';\s*\}',
    validation_logic,
    content
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
