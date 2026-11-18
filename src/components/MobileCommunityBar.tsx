"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Send, X, Bell } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { trackCommunityClick } from "./CommunityBadges";

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "https://whatsapp.com/channel/0029VaA2B5m9MF92";
const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || "https://t.me/assamjobshub_official";

export default function MobileCommunityBar() {
  const { lang } = useLanguage();
  const isAssamese = lang === "as";
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if dismissed in this session
    const isHidden = sessionStorage.getItem("ajh_mobile_community_dismissed");
    if (!isHidden) {
      // Delay entrance by 1.5 seconds for pleasant UX
      const timer = setTimeout(() => setDismissed(false), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem("ajh_mobile_community_dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Community Job Alerts"
      className="md:hidden fixed bottom-16 inset-x-3 z-40 animate-in slide-in-from-bottom-4 duration-500"
    >
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white px-3 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-2">
        {/* Left: Indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider leading-none">
              {isAssamese ? "লাইভ এলাৰ্ট" : "Instant Alerts"}
            </div>
            <div className="text-xs font-bold text-slate-100 truncate mt-0.5">
              {isAssamese ? "চাকৰিৰ খবৰ পাবলৈ" : "Get Job Updates"}
            </div>
          </div>
        </div>

        {/* Right: Quick 1-tap join buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("whatsapp", "mobile_sticky_bar")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs shadow transition-all active:scale-95"
          >
            <MessageCircle size={14} className="fill-white" />
            <span>WhatsApp</span>
          </a>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCommunityClick("telegram", "mobile_sticky_bar")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-extrabold text-xs shadow transition-all active:scale-95"
          >
            <Send size={12} />
            <span>Telegram</span>
          </a>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss community banner"
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-0.5"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
