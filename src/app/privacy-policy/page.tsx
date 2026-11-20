import { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Privacy Policy | AssamJobsHub',
  description: 'Comprehensive Privacy Policy for AssamJobsHub, covering Google AdSense, cookies, GDPR, CCPA, and data protection practices.',
  alternates: { canonical: 'https://assamjobshub.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-sm text-slate-500 mb-8 font-medium">Last Updated: November 20, 2026</p>

      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8 leading-relaxed">
        
        <p>
          At <strong>AssamJobsHub (accessible from https://assamjobshub.com)</strong>, the privacy of our visitors is of paramount importance. This Privacy Policy document details the types of information collected and recorded by AssamJobsHub and how we utilize, protect, and handle it in full compliance with the <strong>Google AdSense Program Policies</strong>, the <strong>General Data Protection Regulation (GDPR)</strong>, the <strong>California Consumer Privacy Act (CCPA)</strong>, and applicable Indian Information Technology Laws.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you browse AssamJobsHub, we may collect information in two ways:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Log Data & Device Telemetry:</strong> Like most standard websites, our hosting servers automatically log anonymous traffic data including your Internet Protocol (IP) address, browser type and version, Internet Service Provider (ISP), referring/exit pages, platform type, date/time stamps, and approximate geographic location (city/state level). This data is completely non-personally identifiable and is used solely for site diagnostics, server security, and trend analytics.
            </li>
            <li>
              <strong>Voluntarily Provided Information:</strong> When you subscribe to our free Job Alert newsletter, use interactive tools, or submit feedback via our Contact page, we collect only the details you explicitly submit (e.g., email address, name, or inquiry message). We never sell, rent, or trade your contact information to third parties.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Cookies, Web Beacons & Third-Party Advertising</h2>
          <p>
            AssamJobsHub uses 'cookies'—small data files stored on your device—to enhance user browsing preferences, retain dark/light theme state, remember language selection (Assamese or English), and optimize page delivery.
          </p>
          <p>
            We partner with third-party advertising networks, primarily <strong>Google AdSense</strong>, to serve advertisements when you visit our website.
          </p>
          
          <div className="my-6 p-5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Google DoubleClick DART Cookies & AdSense Policies</h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Google, as a third-party vendor, uses cookies (including the DART cookie) to serve advertisements on AssamJobsHub.
              </li>
              <li>
                Google’s use of advertising cookies enables it and its partners to serve relevant ads to our users based on their prior visits to AssamJobsHub and other websites across the internet.
              </li>
              <li>
                Users may opt out of personalized advertising at any time by visiting Google's official <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Google My Ad Center</a> or by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">aboutads.info choices</a>.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California consumers have specific rights regarding their personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Right to Know:</strong> You may request disclosure of the specific categories and pieces of personal data collected.</li>
            <li><strong>Right to Delete:</strong> You may request the deletion of any personal data collected about you.</li>
            <li><strong>Right to Non-Discrimination:</strong> You will never receive discriminatory treatment or diminished site performance for exercising your privacy rights.</li>
            <li><strong>Do Not Sell:</strong> AssamJobsHub does NOT sell, monetize, or barter users' personal information under any circumstances.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. GDPR Data Protection Rights</h2>
          <p>
            We ensure every user is fully aware of their data protection entitlements under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>The Right to Access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The Right to Rectification:</strong> You have the right to request correction of any information you believe is inaccurate.</li>
            <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
            <li><strong>The Right to Object / Restrict Processing:</strong> You have the right to object to or restrict our processing of your personal data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Children's Privacy (COPPA)</h2>
          <p>
            Protecting children's privacy online is especially important to us. AssamJobsHub is intended for adult job seekers, high school and college graduates, and competitive examination candidates. We do not knowingly collect any personally identifiable information from children under the age of 13. If you believe your child provided personal information on our website, please contact us immediately, and we will promptly remove such records from our databases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Security & Data Retention</h2>
          <p>
            We employ industry-standard SSL (HTTPS) encryption across our entire domain, robust cloud firewalls, and strict access controls to prevent unauthorized data access, disclosure, or alteration. Anonymous analytics data is routinely pruned after 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">7. Data Protection Officer & Privacy Inquiries</h2>
          <p>
            If you have questions, require clarification regarding this policy, or wish to exercise any of your data protection rights, please contact our Data Governance Team:
          </p>
          <div className="not-prose bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 mt-4 text-sm">
            <p className="font-bold text-slate-900 dark:text-white">AssamJobsHub Privacy & Editorial Desk</p>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Guwahati, Kamrup Metropolitan, Assam – 781001, India</p>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Email: <a href="mailto:contact@assamjobshub.com" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">contact@assamjobshub.com</a>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
