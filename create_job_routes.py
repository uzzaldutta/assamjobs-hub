import os

template = """import PageHeader from "@/components/PageHeader";
import FeedList from "@/components/FeedList";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function {component_name}() {{
  let jobs: any[] = [];
  
  try {{
    const {{ data }} = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', '{job_type}')
      .order('scraped_at', {{ ascending: false }});
      
    if (data) {{
      jobs = data.map(job => ({{
        ...job,
        type: job.job_type,
        lastDate: job.last_date,
        officialUrl: job.official_pdf_url || job.apply_url,
        createdAt: new Date(job.scraped_at || job.created_at || Date.now()).toLocaleDateString('en-IN', {{ day: 'numeric', month: 'short', year: 'numeric' }})
      }}));
    }}
  }} catch(e) {{
    console.error("Could not load from Supabase", e);
  }}

  // Deduplicate array
  const seenHashes = new Set();
  jobs = jobs.filter(job => {{
    const hash = `${{job.title}}_${{job.organization}}`.toLowerCase().replace(/\s+/g, '');
    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  }});

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="{title}" 
        subtitle="{subtitle}"
        theme="{theme}"
      />
      <div className="px-4 py-8 max-w-7xl mx-auto w-full">
        <FeedList initialJobs={{jobs}} defaultFilter="{filter}" hideFilters={{true}} />
      </div>
    </div>
  );
}}
"""

pages = {
    'src/app/govt-jobs/page.tsx': {
        'component_name': 'GovtJobsPage',
        'job_type': 'GOVERNMENT',
        'title': 'Government Jobs',
        'subtitle': 'Latest Govt Jobs in Assam, APSC, ADRE, and Central Govt Notifications.',
        'theme': 'blue',
        'filter': 'GOVERNMENT'
    },
    'src/app/private-jobs/page.tsx': {
        'component_name': 'PrivateJobsPage',
        'job_type': 'PRIVATE',
        'title': 'Private Sector Jobs',
        'subtitle': 'Latest private company walk-ins, IT jobs, and corporate hiring in Assam.',
        'theme': 'green',
        'filter': 'PRIVATE'
    }
}

for filepath, meta in pages.items():
    content = template.format(**meta)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# We should also fix page.tsx to route to these instead of /?filter=
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    page_content = f.read()

page_content = page_content.replace('href="/?filter=GOVERNMENT"', 'href="/govt-jobs"')
page_content = page_content.replace('href="/?filter=PRIVATE"', 'href="/private-jobs"')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)
