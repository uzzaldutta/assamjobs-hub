import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  Share2, 
  Clock, 
  Award,
  Layers
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdBanner from "@/components/AdBanner";
import { Metadata } from "next";

export const revalidate = 86400; // 24h caching with on-demand revalidation

export async function generateMetadata({ params }: { params: Promise<{ bookId: string }> }): Promise<Metadata> {
  const { bookId } = await params;
  const { data: book } = await supabase
    .from('prep_materials')
    .select('*, prep_exams(title)')
    .eq('id', bookId)
    .single();

  if (!book) return { title: 'Book Not Found', robots: { index: false } };

  const title = `${book.title} - Free Download & Syllabus Guide`;
  const desc = book.description?.slice(0, 160) || `Read and download ${book.title} for Assam competitive exam preparation.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';
  const url = `${baseUrl}/books/${book.id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: 'book',
      images: book.cover_url ? [{ url: book.cover_url }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc
    }
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;

  const { data: book, error } = await supabase
    .from('prep_materials')
    .select('*, prep_exams(id, title, slug)')
    .eq('id', bookId)
    .single();

  if (error || !book) {
    notFound();
  }

  const category = book.metadata?.book_category || 'RECOMMENDED_BUY';
  const isFree = category === 'FREE_TEXTBOOK' || category === 'AJH_EBOOK';
  const buyUrl = book.metadata?.buy_url;
  const fileUrl = book.file_url;
  const language = book.metadata?.language || 'Assamese / English';
  const pages = book.metadata?.pages;
  const publisher = book.metadata?.publisher;
  const highlight = book.metadata?.highlight;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 flex flex-col">
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": book.title,
            "author": { "@type": "Person", "name": book.author },
            "datePublished": book.year?.toString(),
            "inLanguage": language,
            "numberOfPages": pages,
            "publisher": publisher,
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com'}/books/${book.id}`
          })
        }}
      />

      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-white pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/books" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-1.5" /> Back to All Books
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category === 'FREE_TEXTBOOK' && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider rounded-lg border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={13} /> 100% Free Full Book
              </span>
            )}
            {category === 'AJH_EBOOK' && (
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider rounded-lg border border-indigo-500/30 flex items-center gap-1">
                <Sparkles size={13} /> AJH Exclusive Booklet
              </span>
            )}
            {category === 'RECOMMENDED_BUY' && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider rounded-lg border border-amber-500/30 flex items-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" /> Topper Recommended
              </span>
            )}
            {book.prep_exams && (
              <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700">
                {book.prep_exams.title}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            {book.title}
          </h1>

          <p className="text-slate-300 text-sm md:text-base font-medium">
            By <span className="text-white font-bold">{book.author}</span> • Published: {book.year} {publisher && `• ${publisher}`}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6 relative z-10">
        
        {/* Quick Action Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Access Option</span>
              <p className="text-base font-extrabold text-slate-800 dark:text-white">
                {isFree ? "Full PDF Textbook Available for Free" : "Recommended Paperback / Online Purchase"}
              </p>
              {highlight && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-blue-500" /> {highlight}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isFree && fileUrl ? (
                <a 
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Download size={18} />
                  <span>Download Complete PDF</span>
                </a>
              ) : buyUrl ? (
                <a 
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                >
                  <ExternalLink size={18} />
                  <span>Buy on Amazon / Store</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format</span>
              <span className="font-extrabold text-xs md:text-sm text-slate-800 dark:text-slate-200">
                {isFree ? "Free E-Book / PDF" : "Paperback & eBook"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</span>
              <span className="font-extrabold text-xs md:text-sm text-slate-800 dark:text-slate-200 truncate block">
                {language}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume</span>
              <span className="font-extrabold text-xs md:text-sm text-slate-800 dark:text-slate-200">
                {pages ? `${pages} Pages` : "Full Text"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Fit</span>
              <span className="font-extrabold text-xs md:text-sm text-slate-800 dark:text-slate-200">
                {book.prep_exams ? "Mapped" : "All Exams"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Description & Syllabus Mapping */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm mb-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" /> Book Overview & Syllabus Analysis
          </h2>

          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600">
            {book.description ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{book.description}</ReactMarkdown>
            ) : (
              <p className="text-slate-500">Comprehensive study material for competitive examination candidates.</p>
            )}
          </div>
        </div>

        {/* Ad Placement */}
        <AdBanner dataAdSlot="1234567890" className="my-8" />

        {/* Exam Navigation Link */}
        {book.prep_exams && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block mb-1">Target Examination</span>
              <h3 className="text-xl md:text-2xl font-black">{book.prep_exams.title}</h3>
              <p className="text-blue-200 text-xs md:text-sm mt-1">
                Explore the complete syllabus, topic-wise practice tests, and free mock tests for this exam.
              </p>
            </div>
            <Link 
              href={`/exam/${book.prep_exams.slug}`}
              className="bg-white hover:bg-blue-50 text-slate-900 font-extrabold py-3 px-6 rounded-xl text-sm transition-colors shrink-0 shadow-md"
            >
              Open Exam Dashboard
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
