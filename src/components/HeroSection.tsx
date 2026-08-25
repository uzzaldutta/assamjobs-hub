"use client";

import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Banner {
  id: string;
  headline: string;
  subtext: string;
  cta_text: string;
  cta_link: string;
  gradient_from: string;
  gradient_to: string;
}

const defaultBanners: Banner[] = [
  {
    id: 'default',
    headline: 'Find Your Next Opportunity in Assam',
    subtext: 'Get live Govt & Private job alerts, download premium study materials, and outsmart the competition.',
    cta_text: '',
    cta_link: '',
    gradient_from: 'from-blue-600',
    gradient_to: 'to-emerald-500',
  }
];

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Fetch dynamic banners from API
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        const data = await res.json();
        if (data && data.length > 0) {
          setBanners(data);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isHovered, banners.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search)}`);
    }
  };

  const currentBanner = banners[currentSlide];

  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-5 pt-6 pb-8 md:pt-10 md:pb-10 rounded-[2rem] shadow-sm relative z-0 md:mt-4 overflow-hidden transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Dynamic Gradient Bar */}
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentBanner.gradient_from} ${currentBanner.gradient_to} transition-all duration-1000`}></div>
      
      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Slider Controls */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          >
            <ChevronLeft className="text-slate-700 dark:text-slate-300" size={24} />
          </button>
          
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          >
            <ChevronRight className="text-slate-700 dark:text-slate-300" size={24} />
          </button>
        </>
      )}

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto group">
        
        {/* Animated Banner Content */}
        <div className="w-full relative min-h-[140px] md:min-h-[160px] flex flex-col items-center justify-center">
          {banners.map((banner, idx) => (
            <div 
              key={banner.id}
              className={`absolute top-0 w-full transition-all duration-700 transform flex flex-col items-center ${
                idx === currentSlide 
                  ? "opacity-100 translate-y-0 scale-100 z-10" 
                  : "opacity-0 -translate-y-8 scale-95 -z-10 pointer-events-none"
              }`}
            >
              <h2 className="text-2xl md:text-4xl font-black mb-3 leading-tight tracking-tight text-slate-900 dark:text-white">
                {banner.headline.includes("Opportunity") ? (
                  <>Find Your Next <span className={`text-transparent bg-clip-text bg-gradient-to-r ${banner.gradient_from} ${banner.gradient_to}`}>Opportunity</span> in Assam</>
                ) : (
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${banner.gradient_from} ${banner.gradient_to}`}>
                    {banner.headline}
                  </span>
                )}
              </h2>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl font-medium mx-auto">
                {banner.subtext}
              </p>

              {banner.cta_text && banner.cta_link && (
                <Link 
                  href={banner.cta_link} 
                  className={`mt-4 inline-block bg-gradient-to-r ${banner.gradient_from} ${banner.gradient_to} text-white font-bold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95`}
                >
                  {banner.cta_text}
                </Link>
              )}
            </div>
          ))}
        </div>
        
        {/* Compact Search Bar */}
        <form onSubmit={handleSearch} className="w-full relative max-w-2xl mb-5 mt-4 z-20">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, exams, or organizations..." 
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-28 text-base font-medium text-slate-800 dark:text-slate-200 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all shadow-md shadow-slate-200/50 dark:shadow-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-lg transition-colors shadow-sm">
            Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-medium z-20">
          <span className="text-slate-400 dark:text-slate-500">Popular:</span>
          <Link href="/?search=ADRE" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">ADRE</Link>
          <Link href="/?search=Assam+Police" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Assam Police</Link>
          <Link href="/?search=APSC" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">APSC</Link>
          <Link href="/private-jobs" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Private Jobs</Link>
        </div>

        {/* Dots Pagination */}
        {banners.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide 
                    ? `w-6 h-2 bg-gradient-to-r ${currentBanner.gradient_from} ${currentBanner.gradient_to}`
                    : "w-2 h-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
