
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft, PlayCircle, Hash, FileCheck, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const revalidate = 60;

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }): Promise<Metadata> {
  const { testId } = await params;
  const { data: record } = await supabase.from('prep_mock_tests').select('*').eq('id', testId).single();
  
  if (!record) return { title: 'Not Found', robots: { index: false } };
  
  const title = record.title || 'AssamJobs Hub';
  const desc = record.description || record.excerpt || `Access ${title} on AssamJobs Hub.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';
  const url = `${baseUrl}/mock-tests/${record.id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description: desc }
  };
}


export default async function MockTestDetail(props: { params: Promise<{ testId: string }> }) {
  const { testId } = await props.params;

  const { data: test, error } = await supabase
    .from('prep_mock_tests')
    .select('*, prep_exams(title, slug)')
    .eq('id', testId)
    .single();

  if (error || !test) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 flex flex-col">
      <div className="bg-indigo-700 dark:bg-indigo-900 border-b border-indigo-800 pt-8 pb-12">
        
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": test?.title || "AssamJobs Hub",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com'}/mock-tests/${test?.id}`
          })
        }}
      />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           {test.prep_exams && (
              <Link href={`/exam/${test.prep_exams.slug}`} className="inline-flex items-center text-sm font-bold text-indigo-200 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to {test.prep_exams.title}
              </Link>
           )}
           <div className="flex justify-center mb-4">
             <span className="px-3 py-1 bg-indigo-800/50 text-indigo-100 text-xs font-black uppercase tracking-wider rounded-lg border border-indigo-600/30">
               Mock Test
             </span>
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
             {test.title}
           </h1>
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-xl shadow-slate-200/20 dark:shadow-none mb-8">
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <Clock size={24} className="text-indigo-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{test.duration_minutes || '--'} Mins</span>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <Hash size={24} className="text-indigo-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Marks</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{test.total_marks || '--'}</span>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <CheckCircle2 size={24} className="text-red-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Negative Mark</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{test.negative_marking || '0'}</span>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <FileCheck size={24} className="text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">Available</span>
             </div>
           </div>

           <div className="prose prose-slate dark:prose-invert max-w-none prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-headings:text-slate-800 dark:prose-headings:text-slate-100 mb-8">
             <h3 className="text-lg font-bold">Instructions</h3>
             {test.instructions ? (
               <ReactMarkdown>{test.instructions}</ReactMarkdown>
             ) : (
               <p className="text-slate-500">Read all questions carefully. You cannot pause the test once started.</p>
             )}
           </div>

           <AdBanner dataAdSlot="1234567890" className="my-8" />

           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link href={`/practice/${test.id}?type=mock`} className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-sm text-lg">
                 <PlayCircle size={20} /> Start Mock Test Now
              </Link>
           </div>
        </div>
      </main>
    </div>
  );
}
