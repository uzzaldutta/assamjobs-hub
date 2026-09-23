
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Target, Users } from 'lucide-react';

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
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">About AssamJobsHub</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        <p className="lead text-xl font-medium text-gray-700 dark:text-gray-200 mb-8">
          Welcome to AssamJobsHub, the most trusted and comprehensive recruitment portal for the youth of Assam and the Northeast.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Our Mission</h2>
        <p>
          Our mission is simple: to provide job seekers in Assam with accurate, verified, and timely information about government recruitments, private sector jobs, admissions, and exam resources. We believe that finding the right opportunity shouldn't be complicated by misinformation or scams.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Why Choose Us?</h2>
        <ul className="space-y-4 my-6">
          <li className="flex items-start">
            <CheckCircle className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
            <span><strong>Verified Information:</strong> We cross-check every job posting with official notifications before publishing.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
            <span><strong>Fast Updates:</strong> We track major recruitment boards like APSC, SLPRB, and NFR so you never miss a deadline.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
            <span><strong>Free Resources:</strong> From Mock Tests to Previous Year Papers, all our study materials are completely free.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Get In Touch</h2>
        <p>
          We are constantly improving our platform. If you have suggestions, questions, or would like to report an issue, please reach out to us at <a href="mailto:contact@assamjobshub.com" className="text-emerald-600 hover:underline font-medium">contact@assamjobshub.com</a>.
        </p>
        
        <div className="mt-8">
          <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
            Contact Us <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
