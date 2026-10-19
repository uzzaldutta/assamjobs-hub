import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Target, Users, Shield, MapPin, Award, BookOpen } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'About Us | AssamJobsHub',
  description: 'Learn about AssamJobsHub, your trusted portal for verified government and private recruitment in Assam.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">About AssamJobsHub</h1>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mb-8">
        Guwahati-based regional career platform providing verified employment alerts, examination guides, and free study resources for the youth of Assam.
      </p>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Our Mission & Purpose</h2>
          <p>
            Founded with the sole vision of empowering aspirants across all 35 districts of Assam, <strong>AssamJobsHub (assamjobshub.com)</strong> bridges the information gap between official recruiting agencies and job seekers. We believe that securing employment should be determined by merit and hard work, not hindered by lack of access to timely notifications or misinformation.
          </p>
          <p>
            Whether you are preparing for the <strong>Assam Direct Recruitment Examination (ADRE Grade III & IV)</strong>, <strong>APSC Combined Competitive Exam</strong>, <strong>Assam Police Constable/SI</strong>, <strong>Northeast Frontier Railway (NFR)</strong>, or state university admissions, our dedicated team works tirelessly to organize every notice into structured, easily understandable tables in both English and Assamese.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Our Editorial Standards & Verification Workflow</h2>
          <p>
            Unlike automated clickbait aggregators, our publishing team adheres to rigorous fact-checking standards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Shield size={20} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Primary Source Only</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We only publish updates verified against official gazettes, employment news, and state recruitment commission releases.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Structured Dual-Language</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Key details like Age Relaxations, Vacancy Breakdowns, Cut-offs, and Important Dates are presented in standardized HTML tables.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <BookOpen size={20} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">100% Free Resources</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                All syllabus guides, previous question papers, mock tests, and career calculators on our portal are completely free for all students.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <MapPin size={20} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Local Assam Presence</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Headquartered in Guwahati, Assam, with an editorial team deeply familiar with Assam state recruitment rules and local dialects.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Combating Fraudulent Job Scams</h2>
          <p>
            Every year, thousands of job aspirants in rural and suburban Assam are targeted by fraudulent recruitment agents promising government appointments for money. 
          </p>
          <p>
            <strong>AssamJobsHub has a zero-tolerance policy for fraudulent schemes.</strong> We never feature private agencies charging "processing fees" for government jobs. Every job post includes a direct warning and link to the legitimate official portal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Publisher & Editorial Contact</h2>
          <p>
            AssamJobsHub is managed by an independent team of educators, career researchers, and technologists based in Guwahati. We welcome feedback, inquiries, corrections, and partnerships.
          </p>
          <div className="not-prose bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mt-4">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Editorial Desk:</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1"><strong>Platform:</strong> AssamJobsHub (assamjobshub.com)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1"><strong>Operating Base:</strong> Guwahati, Kamrup Metropolitan, Assam – 781001</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4"><strong>Official Inquiries:</strong> <a href="mailto:contact@assamjobshub.com" className="text-emerald-600 dark:text-emerald-400 underline font-medium">contact@assamjobshub.com</a></p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors text-sm">
              Contact Editorial Desk <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
