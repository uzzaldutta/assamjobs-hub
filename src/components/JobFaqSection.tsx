"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface JobFaqSectionProps {
  faqs: FaqItem[];
  title?: string;
}

export default function JobFaqSection({ faqs, title = "Frequently Asked Questions (FAQs)" }: JobFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <HelpCircle className="text-indigo-500" size={20} /> {title}
        </h2>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-indigo-500" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
