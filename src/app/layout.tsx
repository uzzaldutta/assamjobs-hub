import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { Sparkles, Home, Briefcase, CreditCard, Award, Bookmark, Search, MapPin, GraduationCap, FileText, Calendar, Wallet, BookOpen, Compass, Mic } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import SubscribeForm from "@/components/SubscribeForm";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import MobileBottomNav from "@/components/MobileBottomNav";
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
  description: "Get the latest updates on Assam Govt Jobs, ADRE, Assam Police, APSC, Private Jobs, Admit Cards, and Results. Prepare with Free Mock Tests and AI Career Tools.",
  keywords: ["Assam Jobs", "Assam Govt Jobs", "ADRE Grade 3", "ADRE Grade 4", "Assam Police Recruitment", "APSC", "Assam Career", "Job in Assam", "Assam Tenders", "Mock Tests Assam"],
  alternates: {
    canonical: "https://y-ruddy-nine-46.vercel.app",
  },
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
              <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <img src="/logo.jpg" alt="AssamJobs Hub Logo" className="w-12 h-12 rounded-xl object-contain bg-white shadow-sm border border-slate-200 dark:border-slate-800" />
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gradient leading-tight">AssamJobs Hub</h1>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">& TENDERS</span>
                  </div>
                </Link>
                

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center p-1.5 bg-emerald-50/80 dark:bg-emerald-900/40 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-700/50 rounded-2xl shadow-sm">
                  <Link href="/" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">Home</Link>
                  <Link href="/calendar" className="text-sm font-bold text-pink-600 dark:text-pink-400 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"><Calendar size={14} /> Calendar</Link>
                  <Link href="/syllabus" className="text-sm font-bold text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all whitespace-nowrap">Syllabus</Link>
                  <Link href="/admissions" className="text-sm font-bold text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm hover:text-indigo-500 transition-all whitespace-nowrap">Admissions</Link>
                  <Link href="/admit-cards" className="text-sm font-bold text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm hover:text-indigo-500 transition-all whitespace-nowrap">Admit Cards</Link>
                  <Link href="/results" className="text-sm font-bold text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm hover:text-indigo-500 transition-all whitespace-nowrap">Results</Link>
                  <Link href="/mock-tests" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"><BookOpen size={14} /> Mock Tests</Link>
                  <Link href="/tenders" className="text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-1.5 whitespace-nowrap"><FileText size={16}/> Tenders</Link>
                  
                  {/* Tools Dropdown Group */}
                  <div className="relative group ml-1">
                    <button className="text-sm font-bold text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm hover:text-indigo-500 transition-all flex items-center gap-1.5 whitespace-nowrap">
                      Tools <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="p-2">
                        <Link href="/tools/career-advisor" className="block px-3 py-2 text-sm text-fuchsia-600 dark:text-fuchsia-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">🧭 AI Career Advisor</Link>
                        <Link href="/tools/study-planner" className="block px-3 py-2 text-sm text-cyan-600 dark:text-cyan-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">📅 AI Study Planner</Link>
                        <Link href="/tools/interview-prep" className="block px-3 py-2 text-sm text-yellow-600 dark:text-yellow-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">🎤 AI Interview Coach</Link>
                        <Link href="/tools/marks-calculator" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">SEBA/AHSEC Marks Calculator</Link>
                        <Link href="/tools/fee-calculator" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Exam Fee Calculator</Link>
                        <Link href="/tools/typing-test" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Typing Speed Tester</Link>
                        <Link href="/tools/salary-calculator" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Salary Calculator</Link>
                        <Link href="/tools/cgpa-converter" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">CGPA to Percentage</Link>
                      </div>
                      <div className="p-2">
                        <Link href="/tools/standard-form" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Auto Standard Form</Link>
                        <Link href="/tools/pdf-merger" className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Image to PDF Merger</Link>
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

                <div className="lg:hidden flex items-center gap-3">
                  <MobileMenu />
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
                        <Link href="/tools/interview-coach" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 -ml-1.5 rounded-lg transition text-amber-600 dark:text-amber-400">
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
                      <Link href="/tools/salary-calculator" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-emerald-500 transition text-center group">
                        <CreditCard className="mx-auto mb-2 text-emerald-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Salary Calculator</span>
                      </Link>
                      <Link href="/tools/typing-test" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-teal-500 transition text-center group">
                        <Award className="mx-auto mb-2 text-teal-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Typing Test</span>
                      </Link>
                      <Link href="/tools/pdf-merger" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-rose-500 transition text-center group">
                        <Bookmark className="mx-auto mb-2 text-rose-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PDF Merger</span>
                      </Link>
                      <Link href="/tools/age-calculator" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition text-center group">
                        <Calendar className="mx-auto mb-2 text-blue-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Age Calculator</span>
                      </Link>
                      <Link href="/tools/cgpa-converter" className="snap-start shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-amber-500 transition text-center group">
                        <GraduationCap className="mx-auto mb-2 text-amber-500 group-hover:scale-110 transition" size={24} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CGPA to %</span>
                      </Link>
                    </div>
                  </div>
                </main>
              </div>

              <Footer />

              <MobileBottomNav />
              <FloatingWhatsApp />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
