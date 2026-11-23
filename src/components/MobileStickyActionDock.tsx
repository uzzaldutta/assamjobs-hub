"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, MessageCircle, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface MobileStickyActionDockProps {
  title: string;
  applyUrl?: string | null;
  officialPdfUrl?: string | null;
  primaryActionLabel?: string;
  deadlineState?: string;
  category?: string;
}

export default function MobileStickyActionDock({
  title,
  applyUrl,
  officialPdfUrl,
  primaryActionLabel = "Apply Online",
  deadlineState = "ACTIVE",
}: MobileStickyActionDockProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // Show after small scroll or 1s delay for non-intrusive entrance
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Fallback: show after 2s anyway if page is short
    const timer = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check this job on AssamJobsHub: ${title}\n`
  )}${encodeURIComponent(currentUrl)}`;

  const isClosed = deadlineState === "CLOSED";
  const isClosingSoon = deadlineState === "CLOSING_SOON";

  if (!isVisible) return null;

  return (
    <div
      aria-label="Mobile Quick Action Dock"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 transition-all duration-300 ease-out"
    >
      {/* Minimized Tab Indicator */}
      {isMinimized ? (
        <div className="flex justify-end px-4 pb-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold shadow-lg backdrop-blur-md border border-slate-700/50 dark:border-slate-200 transition-transform active:scale-95"
          >
            <span>Show Actions</span>
            <ChevronUp size={14} />
          </button>
        </div>
      ) : (
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-8px_25px_rgba(0,0,0,0.12)] px-4 pt-2.5 pb-4 sm:pb-5">
          {/* Top micro-bar: Deadline Status + Minimize */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isClosed ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  Application Closed
                </span>
              ) : isClosingSoon ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900 animate-pulse">
                  ⚡ Closing Soon
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  ● Application Active
                </span>
              )}
            </div>

            {/* Minimize toggle */}
            <button
              onClick={() => setIsMinimized(true)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
              title="Minimize bar"
              aria-label="Minimize bar"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5">
            {/* 1. Quick Share to WhatsApp */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] shrink-0 transition-transform active:scale-95"
              title="Share to WhatsApp"
            >
              <MessageCircle size={22} className="fill-[#25D366]" />
            </a>

            {/* 2. Optional Official PDF / Source Link */}
            {officialPdfUrl && (
              <a
                href={officialPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official Notification PDF"
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shrink-0 transition-transform active:scale-95"
                title="View Official Notification"
              >
                <FileText size={20} />
              </a>
            )}

            {/* 3. Primary CTA: Apply Online / Download Admit Card */}
            {applyUrl ? (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 h-12 px-5 rounded-xl font-black text-sm text-white shadow-lg transition-all active:scale-[0.98] text-center ${
                  isClosed
                    ? "bg-slate-600 cursor-not-allowed opacity-80"
                    : "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 shadow-emerald-500/25"
                }`}
              >
                <span className="truncate">{primaryActionLabel}</span>
                <ExternalLink size={16} className="shrink-0" />
              </a>
            ) : officialPdfUrl ? (
              <a
                href={officialPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-12 px-5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98] text-center"
              >
                <span className="truncate">Official Notification</span>
                <ExternalLink size={16} className="shrink-0" />
              </a>
            ) : (
              <div className="flex-1 flex items-center justify-center h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">
                Check Details Above
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
