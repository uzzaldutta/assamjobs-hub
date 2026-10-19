import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Disclaimer | AssamJobsHub',
  description: 'Official non-affiliation disclaimer and educational policy of AssamJobsHub.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-100 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Disclaimer</h1>
          <p className="text-sm text-slate-500 font-medium">Last Updated: October 2026</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-5 rounded-r-xl mb-8">
        <p className="text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Important Notice:</strong> AssamJobsHub (https://assamjobshub.com) is an independent, non-government educational and recruitment information portal. We are NOT associated with, authorized by, affiliated with, or in any way officially connected with the Government of Assam, the Government of India, or any statutory recruitment commission.
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-amber-500 shrink-0" size={22} />
            1. Non-Government Entity Clarification
          </h2>
          <p>
            The content published on <strong>AssamJobsHub</strong> is strictly for general information, career awareness, and educational purposes. We aggregate publicly available recruitment notices, admit card declarations, examination results, schemes, and educational news published in official government gazettes, state commission portals, and national employment newspapers.
          </p>
          <p>
            Official recruitment authorities—including but not limited to <strong>APSC (Assam Public Service Commission)</strong>, <strong>SLPRB (State Level Police Recruitment Board)</strong>, <strong>SLRC (State Level Recruitment Commission for Class III & IV / ADRE)</strong>, <strong>NFR (Northeast Frontier Railway)</strong>, <strong>AHSEC</strong>, and <strong>SEBA</strong>—own their respective registered trademarks, emblems, and official publications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="text-emerald-500 shrink-0" size={22} />
            2. Primary Source Verification Required
          </h2>
          <p>
            While our editorial team takes utmost care to extract and publish accurate information regarding vacancies, educational qualifications, age limits, application fees, exam dates, and links, <strong>users are strictly advised to verify all notifications directly with the official authority</strong> before submitting applications or paying any examination fees.
          </p>
          <p>
            AssamJobsHub cannot be held responsible for typographical errors, changes in dates, postponement of examinations, or cancellation of recruitment drives decided by the recruiting bodies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ExternalLink className="text-blue-500 shrink-0" size={22} />
            3. External Links & Third-Party Portals
          </h2>
          <p>
            Our portal contains hyperlinks to external government and recruitment websites for the convenience of candidates (e.g., direct "Apply Online" links and "Official Notification PDF" downloads). 
          </p>
          <p>
            We have no control over the content, server availability, terms, or privacy practices of these third-party websites. Linking to an external website does not imply an endorsement of all content found on those sites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="text-indigo-500 shrink-0" size={22} />
            4. No Fee Collection & Scam Warning
          </h2>
          <p>
            <strong>AssamJobsHub NEVER charges any fees from candidates for job listings, registrations, or exam alerts.</strong> All resources, study guides, and tools on this website are 100% free of charge.
          </p>
          <p>
            Beware of fraudulent individuals or third parties who solicit money promising government employment. Official application fees must only be paid through the official payment gateways of the respective recruiting agencies.
          </p>
        </section>

        <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">5. Contact & Grievance Redressal</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            If you represent a recruiting organization and believe any published information needs correction, or if you have questions regarding this disclaimer, please contact our editorial desk immediately:
          </p>
          <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-sm font-medium">
            <p><strong>Editorial Desk:</strong> AssamJobsHub</p>
            <p><strong>Email:</strong> <a href="mailto:contact@assamjobshub.com" className="text-emerald-600 dark:text-emerald-400 underline">contact@assamjobshub.com</a></p>
            <p><strong>Headquarters:</strong> Guwahati, Assam, India</p>
          </div>
        </section>

      </div>
    </div>
  );
}
