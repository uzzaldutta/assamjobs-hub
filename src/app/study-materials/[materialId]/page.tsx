import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60;

export default async function StudyMaterialView({ params }: { params: { materialId: string } }) {
  const { data, error } = await supabase
    .from('jobs')
    .select('title, unique_description, official_pdf_url, created_at')
    .eq('id', params.materialId)
    .single();

  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title={data.title} 
        subtitle="AI Generated Quick-Revision Study Guide"
        theme="blue"
      />

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="mb-6">
          <Link href="/study-materials" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            <ArrowLeft size={16} /> Back to Library
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 md:p-12 prose dark:prose-invert prose-indigo max-w-none prose-table:w-full prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-td:p-3 prose-th:p-3 prose-table:border-collapse prose-tr:border-b prose-tr:border-slate-200 dark:prose-tr:border-slate-700">
          <div dangerouslySetInnerHTML={{ __html: data.unique_description || '' }} />
        </div>
      </div>
    </div>
  );
}
