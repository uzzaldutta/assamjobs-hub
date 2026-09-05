
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { FileText, Download, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const revalidate = 60;

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ materialId: string }> }): Promise<Metadata> {
  const { materialId } = await params;
  const { data: record } = await supabase.from('prep_materials').select('*').eq('id', materialId).single();
  
  if (!record) return { title: 'Not Found', robots: { index: false } };
  
  const title = record.title || 'AssamJobs Hub';
  const desc = record.description || record.excerpt || `Access ${title} on AssamJobs Hub.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';
  const url = `${baseUrl}/study-materials/${record.id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description: desc }
  };
}


export default async function StudyMaterialDetail(props: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await props.params;

  const { data: material, error } = await supabase
    .from('prep_materials')
    .select('*, prep_exams(title, slug)')
    .eq('id', materialId)
    .single();

  if (error || !material) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 flex flex-col">
      <div className="bg-teal-700 dark:bg-teal-900 border-b border-teal-800 pt-8 pb-12">
        
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "name": material?.title || "AssamJobs Hub",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com'}/study-materials/${material?.id}`
          })
        }}
      />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           {material.prep_exams && (
              <Link href={`/exam/${material.prep_exams.slug}`} className="inline-flex items-center text-sm font-bold text-teal-200 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to {material.prep_exams.title}
              </Link>
           )}
           <div className="flex justify-center mb-4">
             <span className="px-3 py-1 bg-teal-800/50 text-teal-100 text-xs font-black uppercase tracking-wider rounded-lg border border-teal-600/30">
               {material.type || 'Study Material'}
             </span>
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
             {material.title}
           </h1>
           <p className="text-teal-100 font-medium flex items-center justify-center gap-2">
             <Clock size={16} /> Added on {new Date(material.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
           </p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-xl shadow-slate-200/20 dark:shadow-none mb-8">
           
           <div className="prose prose-slate dark:prose-invert max-w-none prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-headings:text-slate-800 dark:prose-headings:text-slate-100 mb-8">
             {material.description ? (
               <ReactMarkdown>{material.description}</ReactMarkdown>
             ) : (
               <p className="text-slate-500 italic">No additional description provided for this material.</p>
             )}
           </div>

           <AdBanner dataAdSlot="1234567890" className="my-8" />

           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
             {material.file_url ? (
               <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-sm text-lg">
                 <Download size={20} /> Download PDF Material
               </a>
             ) : (
               <div className="flex-1 text-center py-4 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium border border-dashed border-slate-300 dark:border-slate-700">
                 PDF file not available for download
               </div>
             )}
           </div>
        </div>
      </main>
    </div>
  );
}
