import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { Sparkles, CreditCard, Award, Bookmark, GraduationCap, FileText, Calendar, BookOpen, Compass, Mic, BrainCircuit, CheckCircle2 } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "@teispace/next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import SubscribeForm from "@/components/SubscribeForm";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import MobileBottomNav from "@/components/MobileBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NotificationBell from "@/components/NotificationBell";
import Script from "next/script";
import AdBanner from "@/components/AdBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AssamJobs Hub | Latest Govt & Private Jobs in Assam",
  description: "Get real-time job alerts, mock tests, syllabuses, and AI career tools for Assam Govt and Private Jobs (ADRE, APSC, Police, Railway).",
  keywords: ["Assam Jobs", "Govt Jobs Assam", "ADRE", "APSC", "Mock Tests Assam", "Assam Police Jobs", "Private Jobs in Assam"],
  openGraph: {
    title: "AssamJobs Hub | Latest Jobs & Results",
    description: "Daily updates on Assam Govt Jobs, Private Jobs, Admit Cards, and Results. Take free mock tests and use AI career tools to boost your preparation.",
    url: "https://y-ruddy-nine-46.vercel.app",
    siteName: "AssamJobs Hub",
    images: [
      {
        url: "https://y-ruddy-nine-46.vercel.app/logo.jpg",
        width: 1200,
        height: 630,
        alt: "AssamJobs Hub",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AssamJobs Hub | Latest Jobs & Results",
    description: "Daily updates on Assam Govt Jobs, Private Jobs, Admit Cards, and Results.",
    images: ["https://y-ruddy-nine-46.vercel.app/logo.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" strategy="afterInteractive" />
        
        {/* Google Analytics Setup */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {/* Responsive main container */}
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
              {/* Header */}
              <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl transition-all duration-300">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-between items-center h-16 md:h-20">
                  
                  {/* Logo */}
                  <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0 mr-8">
                    <img src="/logo.png?v=5" alt="AssamJobs Hub Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180" />
                  </Link>

                  {/* Desktop Navigation */}
                  <div className="flex-1 hidden lg:flex justify-center">
                    <DesktopNav />
                  </div>
                  
                  {/* Tools & Toggles (Desktop & Mobile) */}
                  <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <Link href="/search" className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 w-10 h-10 rounded-full transition-colors" aria-label="Search">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </Link>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block mx-1"></div>
                    <LanguageToggle />
                    <ThemeToggle />
                    
                    {/* Notification Bell (Mobile & Desktop) */}
                    <NotificationBell />

                    {/* Removed Sign In button per user request */}
                    
                    {/* Mobile Hamburger (Now moved to Bottom Nav, but keeping a simplified one for settings fallback if needed, or remove it entirely) */}
                    {/* We are removing MobileMenu component here since we have BottomNav! */}
                  </div>
                </div>
              </header>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col md:flex-row relative z-10 pb-20 md:pb-8 mx-auto w-full max-w-7xl pt-4 gap-6 px-4 md:px-0">
                
                {/* Global Left Sidebar (Desktop Only) */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-6 mt-6">
                  {/* Quick Links */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm">Quick Links</h4>
                    <ul className="space-y-3 text-sm font-bold">
                      <li>
                        <Link href="/tools/career-advisor" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 -ml-1.5 rounded-lg transition text-fuchsia-600 dark:text-fuchsia-400">
                          <Compass size={16} /> AI Career Advisor
                        </Link>
                      </li>
                      <li>
                        <Link href="/tools/study-planner" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 -ml-1.5 rounded-lg transition text-cyan-600 dark:text-cyan-400">
                          <Calendar size={16} /> AI Study Planner
                        </Link>
                      </li>
                      <li>
                        <Link href="/tools/interview-prep" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 -ml-1.5 rounded-lg transition text-amber-600 dark:text-amber-400">
                          <Mic size={16} /> AI Interview Coach
                        </Link>
                      </li>
                      <li>
                        <Link href="/tools/marks-calculator" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 -ml-1.5 rounded-lg transition text-slate-600 dark:text-slate-400 font-medium">
                          SEBA/AHSEC Marks Calculator
                        </Link>
                      </li>
                      <li>
                        <Link href="/tools/fee-calculator" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 -ml-1.5 rounded-lg transition text-slate-600 dark:text-slate-400 font-medium">
                          Exam Fee Calculator
                        </Link>
                      </li>
                      <li>
                        <Link href="/tools/typing-test" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 -ml-1.5 rounded-lg transition text-slate-600 dark:text-slate-400 font-medium">
                          Typing Speed Tester
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Subscribe Form */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm">Get Job Alerts</h4>
                    <SubscribeForm />
                  </div>

                  {/* Sidebar Ad (Sticky) */}
                  <div className="sticky top-24 pt-2">
                    <AdBanner dataAdSlot="SIDEBAR_TALL_SLOT" className="min-h-[600px] w-full" />
                  </div>
                </aside>

                <main className="flex-1 min-w-0 flex flex-col">
                  {children}
                  
                  {/* Global Bottom Tools Section */}
                  <div className="mt-12 mb-8 space-y-6">
                    {/* General Applicant Tools */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Sparkles className="text-indigo-500" size={20} /> Featured Applicant Tools
                      </h3>
                      
                      {/* Scrolling Container */}
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
                          <Link href="/tools/standard-form" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition text-center group">
                            <FileText className="mx-auto mb-2 text-indigo-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Standard Form</span>
                          </Link>
                          <Link href="/tools/salary-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-emerald-500 transition text-center group">
                            <CreditCard className="mx-auto mb-2 text-emerald-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Salary Calculator</span>
                          </Link>
                          <Link href="/tools/typing-test" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-teal-500 transition text-center group">
                            <Award className="mx-auto mb-2 text-teal-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Typing Test</span>
                          </Link>
                          <Link href="/tools/pdf-merger" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-rose-500 transition text-center group">
                            <Bookmark className="mx-auto mb-2 text-rose-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PDF Merger</span>
                          </Link>
                          <Link href="/tools/age-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition text-center group">
                            <Calendar className="mx-auto mb-2 text-blue-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Age Calculator</span>
                          </Link>
                          <Link href="/tools/cgpa-converter" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-amber-500 transition text-center group">
                            <GraduationCap className="mx-auto mb-2 text-amber-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CGPA to %</span>
                          </Link>
                          <Link href="/tools/marks-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-violet-500 transition text-center group">
                            <CheckCircle2 className="mx-auto mb-2 text-violet-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Marks Calculator</span>
                          </Link>
                          <Link href="/tools/fee-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-orange-500 transition text-center group">
                            <CreditCard className="mx-auto mb-2 text-orange-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Fee Calculator</span>
                          </Link>
                      </div>
                    </div>

                    {/* AI Powered Tools Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <BrainCircuit className="text-fuchsia-500" size={20} /> AI Powered Career Tools
                      </h3>
                      
                      {/* Scrolling Container */}
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
                          <Link href="/tools/career-advisor" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-fuchsia-500 transition text-center group flex flex-col items-center justify-center">
                            <Compass className="mx-auto mb-2 text-fuchsia-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Career Advisor</span>
                          </Link>
                          <Link href="/tools/study-planner" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-cyan-500 transition text-center group flex flex-col items-center justify-center">
                            <Calendar className="mx-auto mb-2 text-cyan-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Study Planner</span>
                          </Link>
                          <Link href="/tools/interview-prep" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-amber-500 transition text-center group flex flex-col items-center justify-center">
                            <Mic className="mx-auto mb-2 text-amber-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Interview Coach</span>
                          </Link>
                          <Link href="/mock-tests/ai-generator" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition text-center group flex flex-col items-center justify-center">
                            <BrainCircuit className="mx-auto mb-2 text-indigo-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Mock Test</span>
                          </Link>
                          <Link href="/cover-letter" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-pink-500 transition text-center group flex flex-col items-center justify-center">
                            <FileText className="mx-auto mb-2 text-pink-500 group-hover:scale-110 transition" size={24} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Cover Letter</span>
                          </Link>
                      </div>
                    </div>
                  </div>
                </main>
              </div>

              <Footer />

              <MobileBottomNav />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
