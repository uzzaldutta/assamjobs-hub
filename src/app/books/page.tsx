import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { 
  Search, 
  BookOpen, 
  Download, 
  ExternalLink, 
  FileCheck, 
  Star, 
  Sparkles, 
  GraduationCap, 
  BookMarked,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Library
} from "lucide-react";
import { Metadata } from "next";

export const revalidate = 3600; // 1h cache with on-demand revalidation

export const metadata: Metadata = {
  title: "Preparation Books & Free E-Books for Assam Exams | ADRE, Assam Police, APSC",
  description: "Download free SCERT & NCERT textbooks, AssamJobs Hub revision booklets, and discover top-recommended preparation books for ADRE 2.0, Assam Police, and APSC CCE.",
  alternates: {
    canonical: "https://assamjobshub.com/books"
  },
  openGraph: {
    title: "Books & Study Materials for Assam Competitive Exams",
    description: "Full free textbooks, exclusive e-books, and topper-recommended books for Assam Govt job preparations.",
    url: "https://assamjobshub.com/books",
    type: "website"
  }
};

export default async function BooksPage(props: { searchParams?: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q?.trim() || "";
  const selectedCategory = searchParams?.category || "all";
  const selectedExam = searchParams?.exam || "all";

  // 1. Fetch published exams
  const { data: exams } = await supabase
    .from('prep_exams')
    .select('id, title, slug')
    .eq('status', 'PUBLISHED')
    .order('title', { ascending: true });

  // 2. Fetch all materials of type 'BOOK'
  let queryBuilder = supabase
    .from('prep_materials')
    .select('*, prep_exams(id, title, slug)')
    .eq('type', 'BOOK')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false });

  if (q) {
    queryBuilder = queryBuilder.or(`title.ilike.%${q}%,author.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: rawBooks } = await queryBuilder;
  const allBooks = rawBooks || [];

  // 3. Filter by Category & Exam
  const filteredBooks = allBooks.filter((book) => {
    const metaCat = book.metadata?.book_category;
    const matchesCategory = selectedCategory === "all" || metaCat === selectedCategory;
    const matchesExam = selectedExam === "all" || book.prep_exams?.slug === selectedExam;
    return matchesCategory && matchesExam;
  });

  // Calculate counts for categories
  const freeTextbooksCount = allBooks.filter(b => b.metadata?.book_category === 'FREE_TEXTBOOK').length;
  const ajhEbooksCount = allBooks.filter(b => b.metadata?.book_category === 'AJH_EBOOK').length;
  const recommendedCount = allBooks.filter(b => b.metadata?.book_category === 'RECOMMENDED_BUY').length;

  const getExamShortName = (title: string) => {
    if (!title) return 'Assam Govt';
    if (title.toLowerCase().includes('adre')) return 'ADRE 2.0';
    if (title.toLowerCase().includes('police')) return 'Assam Police';
    if (title.toLowerCase().includes('apsc')) return 'APSC CCE';
    if (title.toLowerCase().includes('tet')) return 'Assam TET';
    return title.split('(')[0].trim();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PageHeader 
        title="Books & Preparation Materials" 
        subtitle="100% Free SCERT & NCERT textbooks, AssamJobs Hub exclusive e-books, and topper-recommended bestsellers." 
        theme="blue" 
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Bar & Stats */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <form action="/books" method="GET" className="flex-1 max-w-xl flex items-center bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-blue-500 transition-colors">
            {selectedCategory !== 'all' && <input type="hidden" name="category" value={selectedCategory} />}
            {selectedExam !== 'all' && <input type="hidden" name="exam" value={selectedExam} />}
            <div className="relative flex-1">
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search books by title, author, or exam..." 
                className="w-full bg-transparent py-2.5 pl-11 pr-4 text-slate-900 dark:text-white outline-none font-medium text-sm placeholder:text-slate-400"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-sm">
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-auto">
            <Library size={16} className="text-blue-500" />
            <span>{filteredBooks.length} Books & E-Books Available</span>
          </div>
        </div>

        {/* 1. Category Switcher Tabs */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <Link
              href={`/books?${new URLSearchParams({ ...(q ? { q } : {}), ...(selectedExam !== 'all' ? { exam: selectedExam } : {}), category: 'all' })}`}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">All Library</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                  {allBooks.length}
                </span>
              </div>
              <span className="font-extrabold text-sm md:text-base">All Books & E-Books</span>
            </Link>

            <Link
              href={`/books?${new URLSearchParams({ ...(q ? { q } : {}), ...(selectedExam !== 'all' ? { exam: selectedExam } : {}), category: 'FREE_TEXTBOOK' })}`}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedCategory === 'FREE_TEXTBOOK'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">100% Free Full Books</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedCategory === 'FREE_TEXTBOOK' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                  {freeTextbooksCount}
                </span>
              </div>
              <span className="font-extrabold text-sm md:text-base">SCERT & NCERT Textbooks</span>
            </Link>

            <Link
              href={`/books?${new URLSearchParams({ ...(q ? { q } : {}), ...(selectedExam !== 'all' ? { exam: selectedExam } : {}), category: 'AJH_EBOOK' })}`}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedCategory === 'AJH_EBOOK'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Free Booklets</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedCategory === 'AJH_EBOOK' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'}`}>
                  {ajhEbooksCount}
                </span>
              </div>
              <span className="font-extrabold text-sm md:text-base">AJH Exclusive E-Books</span>
            </Link>

            <Link
              href={`/books?${new URLSearchParams({ ...(q ? { q } : {}), ...(selectedExam !== 'all' ? { exam: selectedExam } : {}), category: 'RECOMMENDED_BUY' })}`}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedCategory === 'RECOMMENDED_BUY'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Topper Recommendations</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedCategory === 'RECOMMENDED_BUY' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                  {recommendedCount}
                </span>
              </div>
              <span className="font-extrabold text-sm md:text-base">Commercial Bestsellers</span>
            </Link>
          </div>
        </div>

        {/* 2. Exam Filter Pills */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <Link
            href={`/books?${new URLSearchParams({ ...(q ? { q } : {}), ...(selectedCategory !== 'all' ? { category: selectedCategory } : {}), exam: 'all' })}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              selectedExam === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap size={15} /> All Exams
          </Link>
          {exams?.map((exam) => {
            const isActive = selectedExam === exam.slug;
            return (
              <Link
                key={exam.id}
                href={`/books?${new URLSearchParams({ ...(q ? { q } : {}), ...(selectedCategory !== 'all' ? { category: selectedCategory } : {}), exam: exam.slug })}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileCheck size={14} /> {getExamShortName(exam.title)}
              </Link>
            );
          })}
        </div>

        {/* 3. Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book: any) => {
            const category = book.metadata?.book_category || 'RECOMMENDED_BUY';
            const isFree = category === 'FREE_TEXTBOOK' || category === 'AJH_EBOOK';
            const buyUrl = book.metadata?.buy_url;
            const fileUrl = book.file_url;
            const rating = book.metadata?.rating || 4.8;
            const pages = book.metadata?.pages;
            const language = book.metadata?.language || 'Assamese / English';
            const highlight = book.metadata?.highlight;

            return (
              <div 
                key={book.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col group relative overflow-hidden"
              >
                {/* Category & Status Pill */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {category === 'FREE_TEXTBOOK' && (
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      100% Free Full Book
                    </span>
                  )}
                  {category === 'AJH_EBOOK' && (
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                      <Sparkles size={13} className="text-indigo-600" />
                      AJH Exclusive E-Book
                    </span>
                  )}
                  {category === 'RECOMMENDED_BUY' && (
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <Star size={13} className="text-amber-500 fill-amber-500" />
                      Topper Recommended
                    </span>
                  )}

                  {book.prep_exams && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {getExamShortName(book.prep_exams.title)}
                    </span>
                  )}
                </div>

                {/* Title & Author */}
                <Link href={`/books/${book.id}`} className="block group-hover:text-blue-600 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                </Link>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                  By <span className="text-slate-700 dark:text-slate-300 font-semibold">{book.author}</span> • {book.year}
                </p>

                {/* Highlight Callout */}
                {highlight && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium mb-4 flex items-start gap-2">
                    <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{highlight}</span>
                  </div>
                )}

                {/* Book Meta Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-5 mt-auto">
                  <div className="bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{language}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pages</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{pages ? `${pages} Pages` : 'Complete'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  {isFree && fileUrl ? (
                    <a 
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download size={15} />
                      <span>Download Full Book</span>
                    </a>
                  ) : buyUrl ? (
                    <a 
                      href={buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink size={15} />
                      <span>Buy Online (Best Price)</span>
                    </a>
                  ) : (
                    <Link 
                      href={`/books/${book.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <BookOpen size={15} />
                      <span>View Study Guide</span>
                    </Link>
                  )}

                  <Link 
                    href={`/books/${book.id}`}
                    aria-label={`View details for ${book.title}`}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
            <BookMarked size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Books Found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-sm">
              {q ? `No books matching "${q}".` : 'No books in this category currently.'}
            </p>
            <Link 
              href="/books" 
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-sm transition-colors"
            >
              Reset Filters
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
