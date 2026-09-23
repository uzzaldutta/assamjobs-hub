
import { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Editorial & Verification Policy | AssamJobsHub',
  description: 'How AssamJobsHub verifies and publishes recruitment news.',
  alternates: { canonical: '/editorial-policy' },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Editorial & Verification Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        <p className="lead text-xl">
          At AssamJobsHub, our primary commitment is to the truth and reliability of the information we provide. We understand that job seekers rely on our platform for crucial career decisions.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Our Verification Process</h2>
        <ol className="space-y-4 my-6 list-decimal pl-6">
          <li><strong>Primary Sources Only:</strong> We never publish job notifications based on hearsay or unverified social media forwards. We strictly refer to official government websites, published PDF notifications, and recognized employment news papers.</li>
          <li><strong>Cross-Checking:</strong> Important details such as Age Limits, Application Fees, and Educational Qualifications are cross-checked multiple times against the official source document before publication.</li>
          <li><strong>Direct Linking:</strong> Wherever possible, we provide direct links to the official website and the official PDF notification so users can verify the information independently.</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Correction Policy</h2>
        <p>
          If an error is discovered in one of our published articles, it is corrected immediately. We encourage users to reach out to us at contact@assamjobshub.com if they spot any discrepancies.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">No Fake Jobs</h2>
        <p>
          We employ strict spam filters and manual review processes to ensure that fraudulent job offers or "pay-to-work" scams are never published on our platform.
        </p>
      </div>
    </div>
  );
}
