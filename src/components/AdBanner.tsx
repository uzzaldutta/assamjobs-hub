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

  useEffect(() => {
    if (pushed.current) return;
    try {
      pushed.current = true;
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense Error: ", err);
    }
  }, [pathname]); // Re-trigger if the path changes

  return (
    <div className={`w-full overflow-hidden flex justify-center items-center bg-slate-50 dark:bg-slate-800/20 rounded-xl relative ${className}`}>
      {/* Fallback placeholder (visible until ad loads) */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest -z-10 pointer-events-none">
        Advertisement
      </div>

      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
