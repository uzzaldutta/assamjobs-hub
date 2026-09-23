const fs = require('fs');
const path = require('path');

const generatePage = (dir, content) => {
  const p = path.join('src', 'app', dir);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
  fs.writeFileSync(path.join(p, 'page.tsx'), content);
};

const email = 'contact@assamjobshub.com';

generatePage('about', `
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
          We are constantly improving our platform. If you have suggestions, questions, or would like to report an issue, please reach out to us at <a href="mailto:${email}" className="text-emerald-600 hover:underline font-medium">${email}</a>.
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
`);

generatePage('contact', `
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
            <a href="mailto:${email}" className="text-lg font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
              ${email}
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
`);

generatePage('privacy-policy', `
import { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Privacy Policy | AssamJobsHub',
  description: 'Privacy Policy for AssamJobsHub. Learn how we collect, use, and protect your data.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 23, 2026</p>
        
        <p>At AssamJobsHub, accessible from https://assamjobshub.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AssamJobsHub and how we use it.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Log Files</h2>
        <p>AssamJobsHub follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Cookies and Web Beacons</h2>
        <p>Like any other website, AssamJobsHub uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Google DoubleClick DART Cookie</h2>
        <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Advertising Partners Privacy Policies</h2>
        <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on AssamJobsHub, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Consent</h2>
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${email}.</p>
      </div>
    </div>
  );
}
`);

generatePage('terms', `
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
        
        <p className="mt-8">If you have any questions about these Terms, please contact us at ${email}.</p>
      </div>
    </div>
  );
}
`);

generatePage('editorial-policy', `
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
          If an error is discovered in one of our published articles, it is corrected immediately. We encourage users to reach out to us at ${email} if they spot any discrepancies.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">No Fake Jobs</h2>
        <p>
          We employ strict spam filters and manual review processes to ensure that fraudulent job offers or "pay-to-work" scams are never published on our platform.
        </p>
      </div>
    </div>
  );
}
`);

console.log("Trust pages created successfully.");
