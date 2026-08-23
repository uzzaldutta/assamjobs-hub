import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { Sparkles, Home, Briefcase, CreditCard, Award, Bookmark, Search, MapPin, GraduationCap, FileText, Calendar } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import SubscribeForm from "@/components/SubscribeForm";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AssamJobs Hub - Latest Govt & Private Jobs in Assam",
  description: "Get the latest updates on Assam Govt Jobs, Private Jobs, Admit Cards, and Results. Find your perfect career today.",
  openGraph: {
    title: "AssamJobs Hub | Latest Jobs & Results",
    description: "Daily updates on Assam Govt Jobs, Private Jobs, Admit Cards, and Results.",
    url: "https://assamjobs-hub.vercel.app",
    siteName: "AssamJobs Hub",
    images: [
      {
        url: "https://assamjobs-hub.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AssamJobs Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
              <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <img src="/logo.jpg" alt="AssamJobs Hub Logo" className="w-12 h-12 rounded-xl object-contain bg-white shadow-sm border border-slate-200 dark:border-slate-800" />
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gradient leading-tight">AssamJobs Hub</h1>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">& TENDERS</span>
                  </div>
                </Link>
                

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/" className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Home</Link>
                  <Link href="/calendar" className="text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-pink-500 transition flex items-center gap-1"><Calendar size={14} /> Calendar</Link>
                  <Link href="/syllabus" className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500 transition">Syllabus</Link>
                  <Link href="/admissions" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition">Admissions</Link>
                  <Link href="/admit-cards" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition">Admit Cards</Link>
                  <Link href="/results" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition">Results</Link>
                  <Link href="/tenders" className="text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1"><FileText size={16}/> Tenders</Link>
                  
                  {/* Tools Dropdown Group */}
                  <div className="relative group">
                    <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition flex items-center gap-1">
                      Tools <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="p-2">
                        <Link href="/tools/typing-test" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Typing Speed Tester</Link>
                        <Link href="/tools/salary-calculator" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Salary Calculator (Assam)</Link>
                        <Link href="/tools/cgpa-converter" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">CGPA to Percentage</Link>
                        <Link href="/tools/pdf-merger" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Image to PDF Merger</Link>
                      </div>
                      <div className="p-2">
                        <Link href="/tools/standard-form" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Auto Standard Form</Link>
                        <Link href="/tools/age-calculator" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Age Calculator</Link>
                        <Link href="/tools/photo-resizer" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Photo & Sign Resizer</Link>
                        <Link href="/tools/cv-maker" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">AI CV Maker</Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                    <a href="https://play.google.com/store/apps/details?id=com.ifree.assamesecalendar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/50 transition border border-green-200 dark:border-green-800">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                      Get Calendar App
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </nav>

                <div className="md:hidden flex items-center gap-3">
                  <a href="https://play.google.com/store/apps/details?id=com.ifree.assamesecalendar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                  </a>
                  <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </header>
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col md:flex-row relative z-10 pb-20 md:pb-8 mx-auto w-full max-w-7xl pt-4 gap-6 px-4 md:px-0">
                
                {/* Global Left Sidebar (Desktop Only) */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-6 mt-6">
                  {/* Quick Links */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/syllabus" className="text-indigo-600 dark:text-indigo-400 hover:underline">Syllabus & Exam Pattern</Link></li>
                      <li><Link href="/admissions" className="text-indigo-600 dark:text-indigo-400 hover:underline">All-India Admissions</Link></li>
                      <li><Link href="/tenders" className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-2"><FileText size={14}/> Browse Tenders</Link></li>
                      <li><Link href="/admit-cards" className="text-indigo-600 dark:text-indigo-400 hover:underline">Download Admit Cards</Link></li>
                      <li><Link href="/results" className="text-indigo-600 dark:text-indigo-400 hover:underline">Check Results</Link></li>
                    </ul>
                  </div>

                  {/* Subscribe Form */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm">Get Job Alerts</h4>
                    {/* The original SubscribeForm component relies on client-side logic. 
                        Since layout.tsx is a Server Component and we don't have SubscribeForm imported yet, 
                        I need to import it at the top of this file. */}
                    <SubscribeForm />
                  </div>

                  {/* Free Applicant Tools Card */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-md text-white">
                    <h4 className="font-bold mb-3 text-sm flex items-center gap-2">
                      <Sparkles size={16} /> Free Applicant Tools
                    </h4>
                    <ul className="space-y-2 text-sm font-medium">
                      <li><Link href="/tools/standard-form" className="flex items-center gap-2 hover:text-indigo-100 transition"><FileText size={14}/> Auto Standard Form</Link></li>
                      <li><Link href="/tools/salary-calculator" className="flex items-center gap-2 hover:text-indigo-100 transition"><CreditCard size={14}/> Salary Calculator</Link></li>
                      <li><Link href="/tools/typing-test" className="flex items-center gap-2 hover:text-indigo-100 transition"><Award size={14}/> Typing Speed Test</Link></li>
                      <li><Link href="/tools/photo-resizer" className="flex items-center gap-2 hover:text-indigo-100 transition"><MapPin size={14}/> Photo & Sign Resizer</Link></li>
                      <li><Link href="/tools/cgpa-converter" className="flex items-center gap-2 hover:text-indigo-100 transition"><GraduationCap size={14}/> CGPA to Percentage</Link></li>
                      <li><Link href="/tools/pdf-merger" className="flex items-center gap-2 hover:text-indigo-100 transition"><Bookmark size={14}/> Image to PDF Merger</Link></li>
                      <li><Link href="/tools/age-calculator" className="flex items-center gap-2 hover:text-indigo-100 transition"><Calendar size={14}/> Age Calculator</Link></li>
                      <li><Link href="/tools/cv-maker" className="flex items-center gap-2 hover:text-indigo-100 transition"><Briefcase size={14}/> AI CV Maker</Link></li>
                    </ul>
                  </div>
                </aside>

                <main className="flex-1 min-w-0 flex flex-col">
                  {children}
                  
                  {/* Global Bottom Tools Section */}
                  <div className="mt-12 mb-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="text-indigo-500" size={20} /> Featured Applicant Tools
                    </h3>
                    <div className="flex overflow-x-auto pb-4 gap-4 snap-x hide-scrollbar">
                      <Link href="/tools/standard-form" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition text-center group">
                        <FileText className="mx-auto mb-2 text-indigo-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Standard Form</span>
                      </Link>
                      <Link href="/tools/salary-calculator" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:emerald-500 transition text-center group">
                        <CreditCard className="mx-auto mb-2 text-emerald-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Salary Calculator</span>
                      </Link>
                      <Link href="/tools/typing-test" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:teal-500 transition text-center group">
                        <Award className="mx-auto mb-2 text-teal-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Typing Test</span>
                      </Link>
                      <Link href="/tools/pdf-merger" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:rose-500 transition text-center group">
                        <Bookmark className="mx-auto mb-2 text-rose-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PDF Merger</span>
                      </Link>
                      <Link href="/tools/cgpa-converter" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:amber-500 transition text-center group">
                        <GraduationCap className="mx-auto mb-2 text-amber-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CGPA to %</span>
                      </Link>
                    </div>
                  </div>
                </main>
              </div>

              {/* Bottom Navigation for Mobile */}
              <nav className="md:hidden fixed bottom-0 w-full z-50 glass border-t border-slate-200 dark:border-slate-800 flex justify-around items-center p-3 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                <Link href="/" className="flex flex-col items-center text-indigo-600 dark:text-indigo-400">
                  <Home size={20} />
                  <span className="text-[10px] mt-1 font-medium">Home</span>
                </Link>
                <Link href="/tenders" className="flex flex-col items-center text-amber-500 hover:text-amber-600 transition">
                  <FileText size={20} />
                  <span className="text-[10px] mt-1 font-bold">Tenders</span>
                </Link>
                <Link href="/admit-cards" className="flex flex-col items-center text-slate-400 hover:text-indigo-500 transition">
                  <CreditCard size={20} />
                  <span className="text-[10px] mt-1 font-medium">Admits</span>
                </Link>
                <Link href="/results" className="flex flex-col items-center text-slate-400 hover:text-indigo-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="text-[10px] mt-1 font-medium">Results</span>
                </Link>
                <Link href="/tools" className="flex flex-col items-center text-slate-400 hover:text-amber-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  <span className="text-[10px] mt-1 font-medium">Tools</span>
                </Link>
              </nav>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
