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
import AutoScrollTrack from "@/components/AutoScrollTrack";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import MobileBottomNav from "@/components/MobileBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NotificationBell from "@/components/NotificationBell";
import AccountPlaceholder from "@/components/AccountPlaceholder";
import Script from "next/script";
import AdBanner from "@/components/AdBanner";
import { AdSkyscraperTall } from "@/components/AdSkyscraperTall";
import AdLeaderboard from "@/components/AdLeaderboard";
import AdStickyMobile from "@/components/AdStickyMobile";
import HeaderScrollTracker from "@/components/HeaderScrollTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://assamjobshub.com'),
  title: {
    template: '%s | AssamJobs Hub',
    default: 'AssamJobs Hub - Government & Private Jobs in Assam',
  },
  description: 'Find the latest Government and Private Jobs in Assam, mock tests, previous year papers, and study materials for ADRE, APSC, and Assam Police.',
  openGraph: {
    title: 'AssamJobs Hub',
    description: 'The Ultimate Platform for Assam Govt Jobs and Mock Tests',
    url: 'https://assamjobshub.com',
    siteName: 'AssamJobs Hub',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AssamJobs Hub - Jobs & Mock Tests',
    description: 'Find the latest Government and Private Jobs in Assam, plus free Mock Tests.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AssamJobsHub",
    "url": "https://assamjobshub.com",
    "logo": "https://assamjobshub.com/logo.png"
  };
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AssamJobsHub",
    "url": "https://assamjobshub.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://assamjobshub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4651508083326671" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4651508083326671" crossOrigin="anonymous" strategy="afterInteractive" />
        
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
      
        <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <Script id="website-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {/* Responsive main container */}
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-clip">
              {/* Header */}
              <header id="main-header" className="sticky top-0 z-50 glass transition-all duration-300 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl transition-all duration-300">
                <div id="header-inner" className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-between items-center h-16 md:h-20 transition-all duration-300 ease-in-out">
                  
                  {/* Logo */}
                  <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0 mr-8">
                    
                      {/* Full Logo for Desktop */}
                      <img id="header-logo" src="/logo.png?v=6" alt="AssamJobs Hub Logo" className="hidden md:block h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180 transition-all duration-300 ease-in-out" />
                      {/* Compact Logo for Mobile */}
                      <img src="/icon-192.png" alt="AssamJobs Hub Compact Logo" className="block md:hidden h-10 w-auto object-contain drop-shadow-sm rounded-lg" />

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

                    {/* Optional Personalization Placeholder (No Auth Logic) */}
                    <AccountPlaceholder />
                    
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
                    <AdSkyscraperTall />
                  </div>
                </aside>

                <main className="flex-1 min-w-0 flex flex-col">
                  {children}
                  </main>
              </div>
              <div className="w-full py-6"><AdLeaderboard /></div>
              <Footer />

              <MobileBottomNav />
              <AdStickyMobile />
            </div>
          </LanguageProvider>
          <HeaderScrollTracker />
        </ThemeProvider>
      </body>
    </html>
  );
}








