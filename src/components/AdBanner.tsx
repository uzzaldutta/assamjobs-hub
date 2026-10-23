"use client";

import { useEffect, memo } from "react";

interface AdBannerProps {
  className?: string;
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

const AdBanner = memo(function AdBanner({
  className = "",
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
}: AdBannerProps) {
  // If no real Google AdSense ad slot is assigned, return null so Google Auto Ads handles placements cleanly
  if (!dataAdSlot || dataAdSlot === "1234567890" || dataAdSlot === "YOUR_INFEED_SLOT_ID") {
    return null;
  }

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("Google AdSense error:", err);
    }
  }, []);

  return (
    <div className={`overflow-hidden my-4 text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4651508083326671"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
});

export default AdBanner;
