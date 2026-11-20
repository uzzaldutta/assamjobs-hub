import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, FileSearch, AlertCircle, RefreshCw, EyeOff } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Editorial & Verification Policy | AssamJobsHub',
  description: 'Learn how AssamJobsHub verifies government notifications, cross-checks official sources, combats fake recruitment scams, and handles corrections.',
  alternates: { canonical: 'https://assamjobshub.com/editorial-policy' },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Editorial & Fact-Checking Policy
          </h1>
          <p className="text-sm text-slate-500 font-medium">Standards of Authenticity, Verification & Ethics</p>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8 leading-relaxed mt-8">
        
        <p className="lead text-lg text-slate-600 dark:text-slate-300 font-medium">
          At <strong>AssamJobsHub</strong>, our foremost commitment is to accuracy, transparency, and candidate safety. We understand that educational updates and career notifications directly shape the future of lakhs of young aspirants across the state of Assam and the Northeast. Our team follows rigorous editorial benchmarks before any post is published.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
            <FileSearch className="text-indigo-500" size={22} />
            1. Primary Source Verification Rule
          </h2>
          <p>
            We adhere strictly to a <strong>Primary Source Mandate</strong>. We never publish announcements based on unverified social media forwards, viral screenshots, or unofficial forum rumors. Every single post published on our platform must be backed by one of the following official primary sources:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Official State Gazette Notifications published by the Government of Assam or Government of India.</li>
            <li>Authorized digital releases on verified recruitment portals (e.g., APSC, SLPRB, SLRC, SEBA, AHSEC, Gauhati University, Dibrugarh University).</li>
            <li>Nationally accredited employment news publications (such as Employment News / Rozgar Samachar and leading regional dailies).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={22} />
            2. Multi-Point Fact Verification
          </h2>
          <p>
            Before publication, our content editors cross-check all vital criteria against the original advertisement PDF:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Age Eligibility & Relaxations</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Exact cut-off dates and category-wise age relaxations (OBC, SC, ST, PwBD, Ex-Servicemen) per state government norms.</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Fee Structure & Exemptions</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Verifying non-refundable exam fees, treasury challan rules, and zero-fee concessions for eligible groups.</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Authentic Apply Links</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Directly linking to the authorized NIC / portal application form, preventing phishing and spoofing.</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Original PDF Gazette</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hosting or directly linking the official signed advertisement PDF for independent verification.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
            <EyeOff className="text-rose-500" size={22} />
            3. Zero Tolerance for Fake Jobs & Recruitment Scams
          </h2>
          <p>
            AssamJobsHub enforces an uncompromising anti-fraud policy. We strictly prohibit:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Any third-party agencies or placement consultants demanding "registration charges" or "bribes" in exchange for government interview calls.</li>
            <li>Unregistered private enterprises with fraudulent contact details or deceptive salary promises.</li>
            <li>Misleading clickbait headlines or exaggerated vacancy numbers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
            <RefreshCw className="text-cyan-500" size={22} />
            4. Correction & Erratum Policy
          </h2>
          <p>
            Despite our rigorous multi-stage checks, official authorities occasionally issue corrigendums, postponement notices, or date extensions. When official amendments occur:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We update the affected post immediately upon release of the official corrigendum.</li>
            <li>We clearly annotate the revision with an <em>"Updated on [Date]"</em> tag and note the modified clause.</li>
            <li>We actively encourage readers to report errors or broken links to our desk at <a href="mailto:contact@assamjobshub.com" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">contact@assamjobshub.com</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Editorial Independence & Transparency</h2>
          <p>
            AssamJobsHub operates with complete editorial autonomy. Our educational rankings, career guidance tools, and syllabus guides are created solely for the benefit of candidates. We do not accept sponsored promotions for government jobs, ensuring that merit and authentic public notices remain the bedrock of our portal.
          </p>
        </section>

      </div>
    </div>
  );
}
