import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """                    const aiData = await rewriteJobWithGemini(normalized.description || normalized.title);
                    normalized.unique_description = aiData.unique_description;
                    normalized.unique_description_assamese = aiData.unique_description_assamese;
                    normalized.vacancy = aiData.vacancies || normalized.vacancy;
                    normalized.location = aiData.district || normalized.location;
                    normalized.qualification = aiData.qualification || normalized.qualification;
                    normalized.category = aiData.category || normalized.category;
                    normalized.age_limit = aiData.ageLimit || normalized.age_limit;"""

content = re.sub(
    r"const aiData = await rewriteJobWithGemini\(normalized\.description \|\| normalized\.title\);.*?normalized\.qualification = aiData\.qualification \|\| normalized\.qualification;",
    replacement,
    content,
    flags=re.DOTALL
)

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(content)