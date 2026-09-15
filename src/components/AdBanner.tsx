"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  className = ""
}: AdBannerProps) {
  const pathname = usePathname();
  const pushed = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pushed.current) return;
    
    let retryCount = 0;
    const maxRetries = 10;

    const pushAd = () => {
      // If component unmounted, stop
      if (!containerRef.current) return;

      // AdSense crashes if the container has 0 width (e.g., hidden via CSS 'hidden' class or unrendered flexbox)
      if (containerRef.current.clientWidth === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(pushAd, 300);
        }
        return;
      }

      try {
        pushed.current = true;
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense Error: ", err);
      }
    };

    // Delay slightly to let the browser paint the layout
    const timer = setTimeout(pushAd, 200);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div 
      ref={containerRef}
      className={`w-full overflow-hidden flex justify-center items-center bg-slate-50 dark:bg-slate-800/20 rounded-xl relative ${className}`}
      style={{ minHeight: '100px' }}
    >
      {/* Fallback placeholder (visible until ad loads) */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest -z-10 pointer-events-none">
        Advertisement
      </div>

      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-4651508083326671"}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
