
import { Metadata } from 'next';
import { Mail, MapPin, Clock } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Contact Us | AssamJobsHub',
  description: 'Get in touch with the AssamJobsHub team for support, business inquiries, and feedback.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Contact Us</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        <p className="mb-8">
          Have a question about a job posting? Want to report an issue? Or looking to partner with us? We'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Mail className="h-6 w-6 text-emerald-500 mr-2" /> General Support
            </h3>
            <p className="text-sm mb-4">For any general queries, correction requests, or support regarding our platform:</p>
            <a href="mailto:contact@assamjobshub.com" className="text-lg font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
              contact@assamjobshub.com
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Clock className="h-6 w-6 text-emerald-500 mr-2" /> Response Time
            </h3>
            <p className="text-sm">
              We typically respond to all legitimate inquiries within 24-48 business hours. Please do not send CVs or Resumes directly to our email as we are not a recruitment agency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
