const fs = require('fs');
let p = 'src/app/updates/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "const { data: results } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').or('title.ilike.%result%,title.ilike.%merit list%').order('created_at', { ascending: false }).limit(6);",
  "const { data: jobs } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').order('scraped_at', { ascending: false }).limit(6);\n  const { data: results } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').or('title.ilike.%result%,title.ilike.%merit list%').order('scraped_at', { ascending: false }).limit(6);"
);

c = c.replace(
  "const { data: admitCards } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').or('title.ilike.%admit card%,title.ilike.%hall ticket%').order('created_at', { ascending: false }).limit(6);",
  "const { data: admitCards } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').or('title.ilike.%admit card%,title.ilike.%hall ticket%').order('scraped_at', { ascending: false }).limit(6);"
);

c = c.replace(
  "const { data: admissions } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('created_at', { ascending: false }).limit(6);",
  "const { data: admissions } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('scraped_at', { ascending: false }).limit(6);"
);

// Add JobCard import
c = c.replace(
  'import TenderCard',
  "import JobCard from \"@/components/feeds/JobCard\";\nimport TenderCard"
);

// Add Briefcase icon
c = c.replace(
  'ClipboardList } from "lucide-react";',
  'ClipboardList, Briefcase } from "lucide-react";'
);

// Add Job Section at the top
c = c.replace(
  '<div className="flex-1 space-y-12">',
  `<div className="flex-1 space-y-12">
           
           <section id="jobs">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl"><Briefcase size={24}/></div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">Latest Jobs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {jobs?.map(job => <JobCard key={job.id} job={job} />)}
              </div>
           </section>`
);

fs.writeFileSync(p, c);
console.log("Patched updates page with jobs section and scraped_at sorting");
