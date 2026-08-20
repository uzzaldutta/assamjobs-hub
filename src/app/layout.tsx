import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { Sparkles, Home, Briefcase, CreditCard, Award, Bookmark, Search, MapPin, GraduationCap, FileText } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
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
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {/* Responsive main container */}
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
              {/* Header */}
              <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-gradient leading-tight">AssamJobs Hub</h1>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">অসম চাকৰি হাবে</span>
                </div>
                

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/" className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Home</Link>
                  <Link href="/saved" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition">Saved</Link>
                  <Link href="/ai-match" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><Sparkles size={14} /> AI Match</Link>
                  <Link href="/admit-cards" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition">Admit Cards</Link>
                  <Link href="/results" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition">Results</Link>
                  <Link href="/training" className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500 transition">Training</Link>
                  <Link href="/tenders" className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 transition">Tenders</Link>
                  <div className="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                    <a href="#" className="text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">Sign In</a>
                  </div>
                </nav>

                <button className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
              </header>
              
              {/* Main Content Area */}
              <main className="flex-1 flex flex-col relative z-10 pb-20 md:pb-8 mx-auto w-full max-w-7xl pt-4">
                {children}
              </main>

              {/* Bottom Navigation for Mobile */}
              <nav className="md:hidden fixed bottom-0 w-full z-50 glass border-t border-slate-200 dark:border-slate-800 flex justify-around items-center p-3 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                <Link href="/" className="flex flex-col items-center text-indigo-600 dark:text-indigo-400">
                  <Home size={20} />
                  <span className="text-[10px] mt-1 font-medium">Home</span>
                </Link>
                <Link href="/saved" className="flex flex-col items-center text-slate-400 hover:text-indigo-500 transition">
                  <Bookmark size={20} />
                  <span className="text-[10px] mt-1 font-medium">Saved</span>
                </Link>
                <Link href="/admit-cards" className="flex flex-col items-center text-slate-400 hover:text-indigo-500 transition">
                  <CreditCard size={20} />
                  <span className="text-[10px] mt-1 font-medium">Admits</span>
                </Link>
                <Link href="/results" className="flex flex-col items-center text-slate-400 hover:text-indigo-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="text-[10px] mt-1 font-medium">Results</span>
                </Link>
                <Link href="/training" className="flex flex-col items-center text-slate-400 hover:text-amber-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  <span className="text-[10px] mt-1 font-medium">Training</span>
                </Link>
              </nav>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
