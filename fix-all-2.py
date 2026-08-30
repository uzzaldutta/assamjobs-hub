def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

# 1. Fix API
api_content = r"""
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const profile = await req.json();

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, title, organization, qualification, age_limit, job_type, last_date, scraped_at, created_at')
      .neq('category', 'STUDY_MATERIAL')
      .neq('category', 'MOCK_TEST')
      .order('scraped_at', { ascending: false })
      .limit(30);

    if (error || !jobs) {
      return NextResponse.json({ success: false, error: 'Failed to fetch jobs' });
    }

    const jobsListStr = jobs.map(j => `ID: ${j.id} | Title: ${j.title} | Org: ${j.organization} | Req. Qual: ${j.qualification} | Req. Age: ${j.age_limit}`).join('\n');

    const prompt = `
You are an expert career counselor. 
A candidate has the following profile:
- Age: ${profile.age}
- Qualification: ${profile.qualification}
- Caste Category: ${profile.category} (Note: Reserved categories often get 3-5 years age relaxation).

Here is a list of active job postings.
Evaluate each job and decide if this candidate is legally eligible to apply based on their Age and Qualification.
Return ONLY the IDs of the jobs they are eligible for.

Jobs:
${jobsListStr}
`;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        eligibleJobIds: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "List of job IDs the user is eligible for."
        }
      },
      required: ["eligibleJobIds"]
    };

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);
    const eligibleIds = parsed.eligibleJobIds || [];

    const eligibleJobs = jobs.filter(j => eligibleIds.includes(j.id.toString()));

    return NextResponse.json({ success: true, eligibleJobs });

  } catch (error: any) {
    console.error("Eligibility check error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
"""
write_file('src/app/api/check-eligibility/route.ts', api_content)

# 2. Fix Search Page
search_content = r"""
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import PageHeader from '@/components/PageHeader';
import { Search, AlertCircle } from 'lucide-react';

export const revalidate = 60;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "";

  let results: any[] = [];
  
  if (query.trim().length > 0) {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .or(`title.ilike.%${query}%,organization.ilike.%${query}%`)
      .order('scraped_at', { ascending: false })
      .limit(50);
      
    if (data) {
      results = data.map((job: any) => ({
        ...job,
        type: job.job_type,
        lastDate: job.last_date,
        createdAt: new Date(job.scraped_at || job.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Search Results" 
        subtitle={query ? `Showing results for "${query}"` : "Enter a search term to find jobs, exams, and materials."}
        theme="violet"
      />

      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10">
        
        <form className="relative w-full mb-10" action="/search" method="GET">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search jobs, exams, or organizations..."
            className="block w-full pl-12 pr-24 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm text-lg"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 rounded-xl transition">
            Search
          </button>
        </form>

        {query.trim().length > 0 && results.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <AlertCircle size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No results found</h3>
            <p className="text-slate-500 mb-6">We couldn't find any matches for "{query}". Try different keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"""
write_file('src/app/search/page.tsx', search_content)
print("Files rewritten perfectly.")
