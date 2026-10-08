import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """validation_warnings: validation.warnings
            }).select('id').single();

            if (qItem && finalStatus === 'NEW' && qualityScore >= 70 && (source.tier <= 2 || source.is_official || normalized.title.toLowerCase().includes('govt') || normalized.title.toLowerCase().includes('government') || normalized.title.toLowerCase().includes('police') || normalized.title.toLowerCase().includes('railway'))) {
              try {
                await approveQueueItemAction(qItem.id, 'NEW');
                console.log("Auto-approved high-quality Govt job: " + normalized.title);
              } catch (e) {
                console.error("Auto-approve failed: " + e);
              }
            }"""

new_content = re.sub(r'validation_warnings:\s*validation\.warnings\s*\}\)\.select\(''id''\)\.single\(\);\s*if \(qItem && finalStatus === ''NEW''[\s\S]*?\}\s*\}', replacement, content)

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)