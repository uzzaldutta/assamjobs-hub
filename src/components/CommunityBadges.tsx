"use client";

import React from "react";
import { MessageCircle, Send, Users, Bell, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface CommunityBadgesProps {
  variant?: "banner" | "card" | "compact";
  className?: string;
}

export function trackCommunityClick(platform: "whatsapp" | "telegram", location: string) {
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
const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || "https://t.me/assamjobshub_official";

export default function CommunityBadges({ variant = "banner", className = "" }: CommunityBadgesProps) {
  const { lang } = useLanguage();
  const isAssamese = lang === "as";

  // 1. COMPACT / SIDEBAR CARD VARIANT
  if (variant === "compact" || variant === "card") {
    return (
      <div
        className={`bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/90 rounded-2xl p-4 border border-emerald-200/60 dark:border-emerald-900/40 shadow-sm relative overflow-hidden ${className}`}
      >
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {isAssamese ? "লাইভ চাকৰিৰ এলাৰ্ট" : "Instant Job Alerts"}
          </span>
        </div>

        <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1 leading-snug">
          {isAssamese ? "হোৱাটছএপ আৰু টেলিগ্ৰাম গোট" : "AssamJobs Community"}
        </h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-3.5 leading-relaxed">
          {isAssamese
            ? "সৰ্বপ্ৰথম অসম চৰকাৰী চাকৰি, এডমিট কাৰ্ড আৰু ফলাফলৰ জাননী পাবলৈ যোগ দিয়ক।"
            : "Get 1-tap alerts for ADRE, APSC, Police, results & hall tickets."}
        </p>

        {/* Member Counter Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold mb-3.5">
          <Users size={12} className="text-emerald-600 dark:text-emerald-400" />
          <span>45,000+ {isAssamese ? "পৰীক্ষাৰ্থী যুক্ত" : "Aspirants Joined"}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("whatsapp", "sidebar_card")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-sm hover:shadow transition-all group"
          >
            <MessageCircle size={15} className="fill-white group-hover:scale-110 transition-transform" />
            <span>{isAssamese ? "হোৱাটছএপ চেনেলত যোগ দিয়ক" : "Join WhatsApp Channel"}</span>
          </a>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("telegram", "sidebar_card")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs shadow-sm hover:shadow transition-all group"
          >
            <Send size={14} className="group-hover:scale-110 transition-transform" />
            <span>{isAssamese ? "টেলিগ্ৰাম গ্ৰুপত যোগ দিয়ক" : "Join Telegram Group"}</span>
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
      {/* Glow Orbs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Text & Badges */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
            <Bell size={12} className="animate-bounce" />
            <span>{isAssamese ? "দ্ৰুততম চাকৰিৰ নটিফিকেচন" : "Official Alert Community 2026"}</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">
            {isAssamese
              ? "অসমৰ #১ হোৱাটছএপ আৰু টেলিগ্ৰাম চাকৰিৰ নেটৱৰ্কত যোগদান কৰক"
              : "Never Miss an Assam Govt Job, Admit Card or Result!"}
          </h3>

          <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed font-medium">
            {isAssamese
              ? "ADRE 2.0, APSC, Assam Police, শিক্ষক নিযুক্তি আৰু কেন্দ্ৰীয় চাকৰিৰ সকলো খবৰ পোনপটীয়াকৈ মোবাইলত পাবলৈ বিনামূলীয়াকৈ যোগ দিয়ক।"
              : "Join 45,000+ candidates receiving instant direct PDF downloads, application reminders & admit card notices on their mobile."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] sm:text-xs text-emerald-100 font-bold">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-300" /> {isAssamese ? "১০০% বিনামূলীয়া" : "100% Free Forever"}
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-300" /> {isAssamese ? "কোনো স্পাম নাই" : "Zero Spam / Only Verified Jobs"}
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-300" /> {isAssamese ? "প্ৰতিদিনে লাইভ আপডেট" : "Daily 24/7 Updates"}
            </span>
          </div>
        </div>

        {/* Right: Conversion Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-72">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("whatsapp", "homepage_banner")}
            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebd53] text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center group border border-white/20"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle size={18} className="fill-white" />
            </div>
            <div className="text-left">
              <div className="text-xs text-emerald-100 font-medium leading-none">
                {isAssamese ? "হোৱাটছএপ চেনেল" : "Join Free WhatsApp"}
              </div>
              <div className="font-black leading-tight text-white">
                {isAssamese ? "হোৱাটছএপত যোগ দিয়ক" : "WhatsApp Channel"}
              </div>
            </div>
          </a>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("telegram", "homepage_banner")}
            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center group border border-white/20"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left">
              <div className="text-xs text-sky-100 font-medium leading-none">
                {isAssamese ? "টেলিগ্ৰাম সম্প্ৰদায়" : "Join Telegram Alerts"}
              </div>
              <div className="font-black leading-tight text-white">
                {isAssamese ? "টেলিগ্ৰামত যোগ দিয়ক" : "Telegram Channel"}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
