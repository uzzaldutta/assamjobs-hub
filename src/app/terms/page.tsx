
import { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Terms of Service | AssamJobsHub',
  description: 'Terms and Conditions for using AssamJobsHub.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Terms and Conditions</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 23, 2026</p>
        
        <p>Welcome to AssamJobsHub!</p>
        <p>These terms and conditions outline the rules and regulations for the use of AssamJobsHub's Website, located at https://assamjobshub.com.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Disclaimer of Liability</h2>
        <p>AssamJobsHub is an educational and informational portal. We are NOT a recruitment agency and we are NOT affiliated with any Government organization, recruitment board, or the Government of Assam.</p>
        <p>While we strive to provide 100% accurate information by verifying official notifications, we do not guarantee the absolute accuracy, completeness, or reliability of the job listings. Users are strictly advised to cross-verify all details on the official websites of the respective recruiting organizations before applying or paying any fees.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Cookies</h2>
        <p>We employ the use of cookies. By accessing AssamJobsHub, you agreed to use cookies in agreement with our Privacy Policy.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">License</h2>
        <p>Unless otherwise stated, AssamJobsHub and/or its licensors own the intellectual property rights for all original content on AssamJobsHub. You may access this from AssamJobsHub for your own personal use subjected to restrictions set in these terms and conditions.</p>
        
        <p className="mt-8">If you have any questions about these Terms, please contact us at contact@assamjobshub.com.</p>
      </div>
    </div>
  );
}
