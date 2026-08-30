import FraudWarningBanner from "@/components/FraudWarningBanner";
import { Building2, MapPin, Users, Calendar, ArrowLeft, Share2, FileText, CheckCircle2, Sparkles } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import AdminEditButton from "@/components/AdminEditButton";
import JobCard from "@/components/JobCard";
import RecentlyViewed from "@/components/RecentlyViewed";

export default async function JobDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let job = null;
  
  // Try to find in Supabase cloud
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (data) {
      job = {
        ...data,
        type: data.job_type,
        lastDate: data.last_date,
        officialUrl: data.official_pdf_url || data.apply_url
      };
    }
  } catch(e) {
    console.error(e);
  }

  // Fallback to mock data if not in db.json
  if (!job) {
    // We should ideally export mockJobs from a shared file, but for now we'll just check if it's "1", "2", "3a", "4"
    const mockJobs = [
      { id: "1", title: "Junior Assistant & Grade IV", organization: "Directorate of Secondary Education, Assam", type: "GOVERNMENT", category: "ASSAM_STATE", vacancies: "1,240", district: "All Assam", lastDate: "2026-09-15" },
      { id: "2", title: "Customer Support Executive", organization: "TechMahindra Guwahati", type: "PRIVATE", category: "LOCAL_PRIVATE", vacancies: "50", district: "Kamrup (M)", lastDate: "2026-08-30" },
      { id: "3", title: "ADRE Grade III Final Result Declared", organization: "State Level Recruitment Commission", type: "EXAM_UPDATE", category: "ASSAM_STATE", vacancies: "12,000", district: "All Assam", lastDate: "2026-08-20" },
      { id: "3a", title: "SSC CGL 2026 Notification", organization: "Staff Selection Commission", type: "EXAM_UPDATE", category: "CENTRAL_GOVT", vacancies: "7,500+", district: "All India", lastDate: "2026-09-01" },
      { id: "4", title: "Data Entry Operator", organization: "National Health Mission (NHM), Assam", type: "GOVERNMENT", category: "ASSAM_STATE", vacancies: "120", district: "Dibrugarh", lastDate: "2026-09-05" },
      { id: "t1", title: "Construction of RCC Bridge", organization: "PWD Assam", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "Jorhat", lastDate: "2026-09-10" },
      { id: "r1", title: "Assam TET 2026 Final Merit List", organization: "Department of Education, Assam", type: "EXAM_UPDATE", category: "ASSAM_STATE", vacancies: "2,500", district: "All Assam", lastDate: "2026-08-16" },
      { id: "a1", title: "ADRE Grade III Written Test Admit Card", organization: "State Level Recruitment Commission", type: "EXAM_UPDATE", category: "ASSAM_STATE", vacancies: "12,000", district: "All Assam", lastDate: "2026-08-25" },
      { id: "a2", title: "Assam Police SI Physical Test Admit", organization: "SLPRB Assam", type: "EXAM_UPDATE", category: "ASSAM_STATE", vacancies: "330", district: "Guwahati", lastDate: "2026-08-28" }
    ];
    job = mockJobs.find(j => String(j.id) === String(id));
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <Link href="/" className="mt-4 text-indigo-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  let relatedJobs: any[] = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('category', job.category)
      .neq('id', job.id)
      .order('scraped_at', { ascending: false })
      .limit(4);
      
    if (data) {
      relatedJobs = data.map((j: any) => ({
        ...j,
        type: j.job_type,
        lastDate: j.last_date,
        createdAt: new Date(j.scraped_at || j.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    }
  } catch(e) {}


  const isPrivate = job.type === "PRIVATE" || job.job_type === "PRIVATE";
  const isGovt = job.type === "GOVERNMENT" || job.job_type === "GOVERNMENT";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Top Nav */}
      <div className="sticky top-[60px] md:top-[80px] z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
          <ArrowLeft size={20} />
          <span className="font-medium text-sm">Back to Feed</span>
        </Link>
        <div className="flex items-center gap-2">
          {job.lastDate && job.lastDate !== "Check Official Website" && (
            <a 
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Deadline:+${encodeURIComponent(job.title)}&dates=${new Date(job.lastDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(new Date(job.lastDate).getTime() + 24*60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=Last+date+to+apply+for+${encodeURIComponent(job.organization)}.+Don't+miss+it!`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full dark:text-slate-300 dark:hover:bg-slate-800 transition shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              title="Add Deadline to Google Calendar"
            >
              <Calendar size={18} className="text-amber-500" />
            </a>
          )}
          <ShareButtons title={job.title} compact={true} />
        </div>
      </div>
      
      <AdminEditButton jobId={id} />

      <div className="px-4 pt-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${isPrivate ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
            {(job.type || job.job_type || "JOB").replace('_', ' ')}
          </span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> Verified
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
          {job.title}
        </h1>
        <h2 className="text-lg text-slate-600 dark:text-slate-300 font-medium mb-6">
          {job.organization}
        </h2>

        {isPrivate && <FraudWarningBanner />}

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Location</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{job.district || "Assam"}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Vacancies</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{job.vacancies || "Not Specified"}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 col-span-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Eligibility / Qualification</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{job.qualification || "Refer to Official Notification"}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Age Limit</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{job.age_limit || "Not Specified"}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Last Date</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{job.lastDate || job.last_date || "Check Official Website"}</p>
            </div>
          </div>
        </div>

        {/* Detailed Extraction Section */}
        {(job.application_fee || job.selection_process) && (
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              Key Notification Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.application_fee && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Application Fee</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{job.application_fee}</p>
                </div>
              )}
              {job.selection_process && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Selection Process</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{job.selection_process}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 mb-4">
          <AdBanner dataAdSlot="JOB_DETAIL_TOP_SLOT" />
        </div>

        <div className="mt-4">
          <div className="prose prose-indigo prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300
            prose-headings:text-indigo-950 dark:prose-headings:text-indigo-200 
            prose-h2:text-2xl prose-h2:font-extrabold prose-h2:border-b-2 prose-h2:border-indigo-100 dark:prose-h2:border-indigo-900/50 prose-h2:pb-2 prose-h2:mt-10
            prose-h3:text-xl prose-h3:text-indigo-700 dark:prose-h3:text-indigo-400 prose-h3:font-bold
            prose-strong:text-indigo-900 dark:prose-strong:text-indigo-300 prose-strong:font-bold
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-ul:bg-gradient-to-br prose-ul:from-indigo-50/50 prose-ul:to-white dark:prose-ul:from-indigo-900/10 dark:prose-ul:to-slate-900 prose-ul:p-5 prose-ul:rounded-2xl prose-ul:border prose-ul:border-indigo-100 dark:prose-ul:border-indigo-900/30
            prose-li:marker:text-indigo-500 prose-li:my-1
            prose-table:w-full prose-table:overflow-hidden prose-table:rounded-xl prose-table:shadow-sm prose-table:border prose-table:border-indigo-100 dark:prose-table:border-indigo-900/50
            prose-th:bg-indigo-600 prose-th:text-white prose-th:font-semibold prose-th:p-3 prose-th:text-left
            prose-td:p-3 prose-td:border-b prose-td:border-indigo-50 dark:prose-td:border-slate-800
          ">
            {job.unique_description ? (
              <ReactMarkdown>{job.unique_description}</ReactMarkdown>
            ) : (
              <p>This is a concise summary of the official notification. The {job.organization} is hiring eligible candidates for {job.title} positions. Please check the official website for full details.</p>
            )}
          </div>
        </div>

        {job.unique_description_assamese && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={24} className="text-indigo-500" />
              অসমীয়া সাৰাংশ
            </h3>
            <div className="prose prose-slate prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
              <ReactMarkdown>{job.unique_description_assamese}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Help a friend out!</h3>
          <p className="text-slate-500 text-sm mb-4">Share this job opportunity with someone who might be looking for a job.</p>
          <ShareButtons title={job.title} />
        </div>

        {relatedJobs.length > 0 && (
          <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 mb-12">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Similar Jobs You Might Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedJobs.map((relatedJob: any) => (
                <JobCard key={relatedJob.id} job={relatedJob} />
              ))}
            </div>
          </div>
        )}


        <RecentlyViewed currentJob={job} />

        <div className="mt-12 mb-12 flex justify-center">
          <Link href={`/cover-letter/${job.id}?title=${encodeURIComponent(job.title)}&org=${encodeURIComponent(job.organization)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <Sparkles size={18} />
            Write an AI Cover Letter for this Job
          </Link>
        </div>

      </div>

      {/* Fixed Apply Button */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 w-full z-40 border-t md:border-none border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto flex gap-4">
          
          {job.official_pdf_url && (
            <a href={job.official_pdf_url} target="_blank" rel="noopener noreferrer" className="w-1/3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-2">
              <FileText size={18} />
              PDF Notification
            </a>
          )}

          {job.officialUrl || job.apply_url ? (
            <a href={job.officialUrl || job.apply_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-2">
              {job.job_type === "STUDY_MATERIAL" ? "Download PDF Material" : "Official Website / চৰকাৰী ৱেবছাইট"}
            </a>
          ) : (
            <button className="flex-1 bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
              Link Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
