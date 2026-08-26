"use client";

import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// COLOR DICTIONARY - This forces Tailwind to compile these classes even if they come from the DB!
const SAFELIST = [
  "from-blue-600", "to-indigo-500", 
  "from-violet-600", "to-fuchsia-500", 
  "from-emerald-600", "to-teal-500", 
  "from-pink-600", "to-rose-500", 
  "from-orange-500", "to-amber-500", 
  "from-green-500", "to-emerald-600"
];

interface Banner {
  id: string;
  headline: string;
  subtext: string;
  cta_text: string;
  cta_link: string;
  gradient_from: string;
  gradient_to: string;
  badge_text?: string;
  badge_color?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  image_url?: string;
}

const defaultBanners: Banner[] = [
  {
    id: 'default',
    headline: 'Find Your Next Opportunity in Assam',
    subtext: 'Get live Govt & Private job alerts, download premium study materials, and outsmart the competition.',
    cta_text: 'Browse Jobs',
    cta_link: '/?search=Jobs',
    gradient_from: 'from-blue-600',
    gradient_to: 'to-indigo-500',
  }
];

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setTouchStart(e.touches[0].clientX);
    } else {
      setTouchStart((e as React.MouseEvent).clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    if ('touches' in e) {
      setTouchEnd(e.touches[0].clientX);
    } else {
      setTouchEnd((e as React.MouseEvent).clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
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

  const currentBanner = banners[currentSlide] || defaultBanners[0];

  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-4 pt-4 pb-6 md:pt-10 md:pb-10 rounded-[2rem] shadow-sm relative z-0 md:mt-4 overflow-hidden transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentBanner.gradient_from} ${currentBanner.gradient_to} transition-all duration-1000`}></div>
      
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            <ChevronLeft className="text-slate-700 dark:text-slate-300" size={24} />
          </button>
          <button onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            <ChevronRight className="text-slate-700 dark:text-slate-300" size={24} />
          </button>
        </>
      )}

      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto group">
        <div 
          className="w-full relative min-h-[170px] md:min-h-[200px] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          {banners.map((banner, idx) => (
            <div 
              key={banner.id}
              className={`absolute top-0 w-full transition-all duration-700 transform flex flex-col md:flex-row items-center justify-center gap-6 ${
                idx === currentSlide 
                  ? "opacity-100 translate-y-0 scale-100 z-10" 
                  : "opacity-0 -translate-y-8 scale-95 -z-10 pointer-events-none"
              }`}
            >
              <div className="flex flex-col items-center md:items-center text-center">
                {banner.badge_text && (
                  <div className={`mb-3 inline-block px-3 py-1 rounded-full text-xs font-bold bg-${banner.badge_color || 'indigo'}-100 text-${banner.badge_color || 'indigo'}-700 dark:bg-${banner.badge_color || 'indigo'}-900/30 dark:text-${banner.badge_color || 'indigo'}-400 border border-${banner.badge_color || 'indigo'}-200 dark:border-${banner.badge_color || 'indigo'}-800`}>
                    {banner.badge_text}
                  </div>
                )}
                
                <h2 className="text-xl md:text-3xl font-black mb-2 md:mb-3 leading-tight tracking-tight text-slate-900 dark:text-white px-4 md:px-8" style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${banner.gradient_from} ${banner.gradient_to}`}>
                    {banner.headline}
                  </span>
                </h2>
                
                <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm max-w-2xl font-medium mx-auto px-4 leading-relaxed">
                  {banner.subtext}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                  {banner.cta_text && banner.cta_link && (
                    <Link href={banner.cta_link} className={`inline-block bg-gradient-to-r ${banner.gradient_from} ${banner.gradient_to} text-white font-bold px-6 py-2.5 text-sm rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95`}>
                      {banner.cta_text}
                    </Link>
                  )}
                  {banner.secondary_cta_text && banner.secondary_cta_link && (
                    <Link href={banner.secondary_cta_link} className="inline-block bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold px-6 py-2.5 text-sm rounded-xl shadow-sm hover:shadow transition-all hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95">
                      {banner.secondary_cta_text}
                    </Link>
                  )}
                </div>
              </div>

              {banner.image_url && (
                <div className="hidden md:block flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 relative">
                  <Image src={banner.image_url} alt={banner.headline} fill className="object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSearch} className="w-full relative max-w-2xl mb-4 mt-8 md:mt-6 z-30">
          <input 
            type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs, exams, or organizations..." 
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-24 text-sm font-medium text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none transition-all shadow-md shadow-slate-200/50 dark:shadow-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 text-sm rounded-lg shadow-sm">Search</button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-medium z-30">
          <span className="text-slate-400 dark:text-slate-500">Popular:</span>
          <Link href="/?search=ADRE" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">ADRE</Link>
          <Link href="/?search=Assam+Police" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Assam Police</Link>
          <Link href="/?search=APSC" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">APSC</Link>
          <Link href="/private-jobs" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Private Jobs</Link>
        </div>

        {banners.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 z-30">
            {banners.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${idx === currentSlide ? `w-6 h-2 bg-gradient-to-r ${currentBanner.gradient_from} ${currentBanner.gradient_to}` : "w-2 h-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
