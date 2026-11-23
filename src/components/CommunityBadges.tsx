"use client";

import React from "react";
import { MessageCircle, Users, Bell, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface CommunityBadgesProps {
  variant?: "banner" | "card" | "compact";
  className?: string;
}

export function trackCommunityClick(platform: "whatsapp", location: string) {
  try {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "join_community", {
        platform,
        location,
        event_category: "engagement",
        event_label: `${platform}_${location}`,
      });
    }
  } catch (err) {
    // Non-blocking telemetry
  }
}

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "https://whatsapp.com/channel/0029VaA2B5m9MF92";

export default function CommunityBadges({ variant = "banner", className = "" }: CommunityBadgesProps) {
  const { lang } = useLanguage();
  const isAssamese = lang === "as";

  // 1. COMPACT / SIDEBAR CARD VARIANT
  if (variant === "compact" || variant === "card") {
    return (
      <div
        className={`bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              {isAssamese ? "লাইভ চাকৰিৰ এলাৰ্ট" : "Instant Job Alerts"}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isAssamese ? "কোনো বিজ্ঞাপন নাই, পোনপটীয়া তথ্য" : "Direct updates, 100% spam-free"}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
          {isAssamese
            ? "অসম চৰকাৰৰ সকলো নতুন চাকৰি আৰু এডমিট কাৰ্ড হোৱাটছএপত তৎক্ষণাত লাভ কৰক।"
            : "Get official notifications, admit cards & result alerts delivered straight to your WhatsApp."}
        </p>

        {/* Member Counter Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold mb-3.5">
          <Users size={12} className="text-emerald-600 dark:text-emerald-400" />
          <span>45,000+ {isAssamese ? "পৰীক্ষাৰ্থী যুক্ত" : "Aspirants Joined"}</span>
        </div>

        {/* Action Buttons */}
        <div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("whatsapp", "sidebar_card")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-sm hover:shadow transition-all group"
          >
            <MessageCircle size={15} className="fill-white group-hover:scale-110 transition-transform" />
            <span>{isAssamese ? "হোৱাটছএপ চেনেলত যোগ দিয়ক" : "Join Free WhatsApp Channel"}</span>
          </a>
        </div>
      </div>
    );
  }

  // 2. FULL HOMEPAGE BANNER VARIANT
  return (
    <section
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-700 text-white p-5 sm:p-7 shadow-lg border border-emerald-400/30 ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Value Proposition */}
        <div className="space-y-2 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} className="text-amber-300" />
            <span>{isAssamese ? "অসমৰ সৰ্ববৃহৎ চাকৰিৰ সম্প্ৰদায়" : "Assam's Fastest Career Alerts"}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            {isAssamese
              ? "এটাও নিযুক্তিৰ খবৰ বাদ নপৰিব"
              : "Never Miss a Single Assam Govt Job Update"}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-lg">
            {isAssamese
              ? "ADRE 2.0, APSC, অসম পুলিচ, শিক্ষা বিভাগৰ প্ৰতিটো অফিচিয়েল জাননী আৰু এডমিট কাৰ্ড পোনপটীয়াকৈ পাওক।"
              : "Instant verified alerts for ADRE 2.0, APSC, Assam Police, Health, TET & Grade III/IV directly on your mobile."}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-emerald-100">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-300" /> {isAssamese ? "১০০% বিজ্ঞাপন মুক্ত" : "100% Spam-Free"}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-300" /> {isAssamese ? "অফিচিয়েল গেজেট লিংক" : "Direct Official PDF Links"}
            </span>
            <span className="flex items-center gap-1 font-semibold text-white">
              <Users size={13} className="text-emerald-300" /> 45,000+ {isAssamese ? "পৰীক্ষাৰ্থী" : "Aspirants"}
            </span>
          </div>
        </div>

        {/* Right: Conversion Action Buttons */}
        <div className="flex flex-col gap-3 shrink-0 lg:w-72">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("whatsapp", "homepage_banner")}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebd53] text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center group border border-white/20"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle size={20} className="fill-white" />
            </div>
            <div className="text-left">
              <div className="text-xs text-emerald-100 font-medium leading-none">
                {isAssamese ? "হোৱাটছএপ চেনেল" : "Join Free WhatsApp"}
              </div>
              <div className="font-black leading-tight text-white text-base">
                {isAssamese ? "হোৱাটছএপত যোগ দিয়ক" : "WhatsApp Channel"}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
