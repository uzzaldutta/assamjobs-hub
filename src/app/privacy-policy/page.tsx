
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
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at contact@assamjobshub.com.</p>
      </div>
    </div>
  );
}
