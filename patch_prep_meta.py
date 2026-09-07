import os

files_to_patch = [
    {
        "path": "src/app/mock-tests/[testId]/page.tsx",
        "table": "prep_mock_tests",
        "id_var": "testId",
        "route": "mock-tests",
        "type": "WebPage"
    },
    {
        "path": "src/app/study-materials/[materialId]/page.tsx",
        "table": "prep_materials",
        "id_var": "materialId",
        "route": "study-materials",
        "type": "Article"
    }
]

for item in files_to_patch:
    if not os.path.exists(item["path"]):
        continue
    with open(item["path"], "r", encoding="utf-8") as f:
        content = f.read()
    
    if "generateMetadata" in content:
        continue
        
    meta = f"""import {{ Metadata }} from "next";

export async function generateMetadata({{ params }}: {{ params: Promise<{{ {item["id_var"]}: string }}> }}): Promise<Metadata> {{
  const {{ {item["id_var"]} }} = await params;
  const {{ data: record }} = await supabase.from('{item["table"]}').select('*').eq('id', {item["id_var"]}).single();
  
  if (!record) return {{ title: 'Not Found', robots: {{ index: false }} }};
  
  const title = record.title || 'AssamJobs Hub';
  const desc = record.description || record.excerpt || `Access ${{title}} on AssamJobs Hub.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';
  const url = `${{baseUrl}}/{item["route"]}/${{record.id}}`;

  return {{
    title,
    description: desc,
    alternates: {{ canonical: url }},
    openGraph: {{ title, description, url, type: 'article' }},
    twitter: {{ card: 'summary_large_image', title, description }}
  }};
}}
"""
    content = content.replace("export const revalidate = 60;", "export const revalidate = 60;\n\n" + meta)
    
    # Also inject JSON-LD
    schema = f"""
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{{{
          __html: JSON.stringify({{
            "@context": "https://schema.org",
            "@type": "{item["type"]}",
            "name": test?.title || material?.title || "AssamJobs Hub",
            "url": `${{process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com'}}/{item["route"]}/${{test?.id || material?.id}}`
          }})
        }}}}
      />
"""
    if '<div className="max-w-' in content:
        content = content.replace('<div className="max-w-', schema + '\n    <div className="max-w-', 1)
        
    with open(item["path"], "w", encoding="utf-8") as f:
        f.write(content)

print("Patched mock test and study material metadata.")
