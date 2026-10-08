import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if "import { rewriteJobWithGemini }" not in content:
    content = content.replace("import { approveQueueItemAction } from '@/app/admin/studio/ingestion/actions';", "import { approveQueueItemAction } from '@/app/admin/studio/ingestion/actions';\nimport { rewriteJobWithGemini } from './gemini-rewriter';")

# Update auto approve logic
replacement = """if (qItem && finalStatus === 'NEW' && qualityScore >= 70 && (source.tier <= 2 || source.is_official || normalized.title.toLowerCase().includes('govt') || normalized.title.toLowerCase().includes('government') || normalized.title.toLowerCase().includes('police') || normalized.title.toLowerCase().includes('railway'))) {
              try {
                console.log('Rewriting job with Gemini: ' + normalized.title);
                try {
                  const aiData = await rewriteJobWithGemini(normalized.description || normalized.title);
                  normalized.unique_description = aiData.unique_description;
                  normalized.unique_description_assamese = aiData.unique_description_assamese;
                  normalized.vacancies = aiData.vacancies || normalized.vacancies;
                  normalized.district = aiData.district || normalized.district;
                  normalized.qualification = aiData.qualification || normalized.qualification;
                  await supabase.from('ingestion_queue').update({ normalized_payload: normalized }).eq('id', qItem.id);
                } catch(aiErr) {
                  console.error('Gemini rewrite failed for auto-approve: ' + aiErr);
                  // fallback to original payload if AI fails
                }
                await approveQueueItemAction(qItem.id, 'NEW');
                console.log('Auto-approved high-quality Govt job: ' + normalized.title);
              } catch (e) {
                console.error('Auto-approve failed: ' + e);
              }
            }"""

content = re.sub(r"if \(qItem && finalStatus === 'NEW'[\s\S]*?\}\s*\}", replacement, content)

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(content)