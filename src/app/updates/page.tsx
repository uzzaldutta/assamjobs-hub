
import PageHeader from "@/components/PageHeader";
import TenderCard from "@/components/feeds/TenderCard";
import AdmissionCard from "@/components/feeds/AdmissionCard";
import ResultCard from "@/components/feeds/ResultCard";
import AdmitCard from "@/components/feeds/AdmitCard";
import ScholarshipCard from "@/components/feeds/ScholarshipCard";
import AdSidebar from "@/components/AdSidebar";
import { supabase } from "@/lib/supabase";
import { Award, FileText, GraduationCap, LibraryBig, ClipboardList } from "lucide-react";

export const revalidate = 60;

export default async function UpdatesPage() {
  const { data: results } = await supabase.from('results').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(6);
  const { data: admitCards } = await supabase.from('admit_cards').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(6);
  const { data: admissions } = await supabase.from('admissions').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(6);
  const { data: scholarships } = await supabase.from('scholarships').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(6);
  const { data: tenders } = await supabase.from('tenders').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(6);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Latest Updates" subtitle="Results, Admit Cards, Admissions, and Official Announcements." theme="purple" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-12">
           
           <section id="results">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl"><Award size={24}/></div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">Exam Results</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {results?.map(res => <ResultCard key={res.id} result={res} />)}
              </div>
           </section>

           <section id="admit-cards">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl"><FileText size={24}/></div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admit Cards</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {admitCards?.map(adm => <AdmitCard key={adm.id} admitCard={adm} />)}
              </div>
           </section>

           <section id="admissions">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl"><GraduationCap size={24}/></div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admissions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {admissions?.map(adm => <AdmissionCard key={adm.id} admission={adm} />)}
              </div>
           </section>

           <section id="scholarships">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl"><LibraryBig size={24}/></div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">Scholarships</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {scholarships?.map(sch => <ScholarshipCard key={sch.id} scholarship={sch} />)}
              </div>
           </section>

           <section id="tenders">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl"><ClipboardList size={24}/></div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">Government Tenders</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {tenders?.map(tender => <TenderCard key={tender.id} tender={tender} />)}
              </div>
           </section>

        </div>
        <div className="w-full lg:w-80 shrink-0 space-y-6">
           <AdSidebar />
        </div>
      </main>
    </div>
  );
}
