def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

# 1. Fix API
api_content = r'''
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

    const jobsListStr = jobs.map(j => ID:  | Title:  | Org:  | Req. Qual:  | Req. Age: ).join('\n');

    const prompt = 
You are an expert career counselor. 
A candidate has the following profile:
- Age: 
- Qualification: 
- Caste Category:  (Note: Reserved categories often get 3-5 years age relaxation).

Here is a list of active job postings.
Evaluate each job and decide if this candidate is legally eligible to apply based on their Age and Qualification.
Return ONLY the IDs of the jobs they are eligible for.

Jobs:

;

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
'''
write_file('src/app/api/check-eligibility/route.ts', api_content)

# 2. Fix Search Page
search_content = r'''
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
      .or(	itle.ilike.%%,organization.ilike.%%)
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
        subtitle={query ? Showing results for "" : "Enter a search term to find jobs, exams, and materials."}
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
'''
write_file('src/app/search/page.tsx', search_content)


# 3. Fix RecentlyViewed
recent_content = r'''
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Briefcase } from "lucide-react";

export default function RecentlyViewed({ currentJob }: { currentJob?: any }) {
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recently_viewed_jobs");
    let history: any[] = stored ? JSON.parse(stored) : [];

    if (currentJob) {
      history = history.filter(j => j.id !== currentJob.id);
      
      const simpleJob = {
        id: currentJob.id,
        title: currentJob.title,
        organization: currentJob.organization,
        job_type: currentJob.job_type || currentJob.type
      };
      
      history.unshift(simpleJob);
      
      if (history.length > 5) {
        history = history.slice(0, 5);
      }
      
      localStorage.setItem("recently_viewed_jobs", JSON.stringify(history));
    }
    
    if (currentJob) {
      setRecentJobs(history.filter(j => j.id !== currentJob.id));
    } else {
      setRecentJobs(history);
    }
  }, [currentJob]);

  if (recentJobs.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
        <Clock className="text-emerald-500" /> Recently Viewed By You
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentJobs.map((job) => (
          <Link key={job.id} href={/jobs/} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition group block">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors shrink-0">
                <Briefcase size={16} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {job.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 truncate">{job.organization}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
'''
write_file('src/components/RecentlyViewed.tsx', recent_content)
print("Files rewritten perfectly.")
