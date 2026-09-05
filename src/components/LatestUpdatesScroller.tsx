"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

export interface FeedItem {
  id: string;
  title: string;
  organization: string;
  badge_text: string;
  url: string;
  last_date: string | null;
  created_at: string;
  isClosingSoon?: boolean;
}

interface LatestUpdatesScrollerProps {
  recentItems: FeedItem[];
  closingSoonItems: FeedItem[];
}

export default function LatestUpdatesScroller({ recentItems, closingSoonItems }: LatestUpdatesScrollerProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'closing'>('recent');
  const displayItems = activeTab === 'recent' ? recentItems : closingSoonItems;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  // Continuous smooth auto-scroll logic
  useEffect(() => {
    let lastTime = performance.now();
    
    const scroll = (time: number) => {
      if (!isHovered && scrollRef.current && displayItems.length > 0) {
        const deltaTime = time - lastTime;
        
        // Only move roughly 1 pixel per frame (approx 30px per second)
        if (deltaTime > 16) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          
          if (scrollLeft + clientWidth >= scrollWidth - 2) {
            scrollRef.current.scrollLeft = 0; // jump back to start
          } else {
            scrollRef.current.scrollLeft += 1.5; // adjust speed here
          }
          lastTime = time;
        }
      } else {
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };
    
    animationRef.current = requestAnimationFrame(scroll);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered, displayItems]);

  return (
    <section className="py-6 max-w-7xl mx-auto w-full relative">
      <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center mb-6 gap-6 px-4">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2 shrink-0">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Latest Updates
        </h2>
        <div className="flex bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800 shrink-0">
          <button 
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'recent' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400'}`}
          >
            <Sparkles size={16} /> Recent
          </button>
          <button 
            onClick={() => setActiveTab('closing')}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'closing' ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm dark:bg-red-900/20 dark:border-red-800' : 'text-slate-500 hover:text-red-600 dark:text-slate-400'}`}
          >
            <Clock size={16} /> Closing Soon
          </button>
        </div>
      </div>

      <div 
        className="w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsHovered(false), 2000);
        }}
      >
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 sm:gap-4 pb-6 px-4 snap-x snap-mandatory custom-scrollbar relative"
        >
          {displayItems.map((item, index) => {
            const isClosing = activeTab === 'closing' || item.isClosingSoon;
            
            return (
              <Link 
                key={`${item.badge_text}-${item.id}-${index}`} 
                href={item.url}
                className={`relative flex-shrink-0 w-[80vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] p-4 sm:p-5 rounded-2xl border snap-start transition-transform hover:-translate-y-1 ${
                  isClosing 
                    ? 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30' 
                    : 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30'
                }`}
              >
                <div className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 rounded-bl-xl rounded-tr-xl font-bold text-slate-400 text-xs border-b border-l border-slate-100 dark:border-slate-700 shadow-sm">
                  {index + 1}
                </div>
                
                <div className="flex justify-between items-center mb-3 pr-5">
                  <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
                    {item.badge_text}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-bold flex items-center gap-1 ${isClosing ? 'text-red-500' : 'text-emerald-500'}`}>
                    <span className={`w-1 h-1 rounded-full ${isClosing ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                    {isClosing ? 'Ends Soon' : 'New Match'}
                  </span>
                </div>
                
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 h-10 sm:h-12 leading-tight">
                  {item.title}
                </h3>
                
                <div className="flex justify-between items-end mt-auto pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate pr-3 max-w-[60%]">
                    {item.organization || 'Various Departments'}
                  </p>
                  {isClosing && item.last_date ? (
                    <span className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                      End: {new Date(item.last_date).toISOString().split('T')[0]}
                    </span>
                  ) : (
                    <span className="text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 whitespace-nowrap">
                      Read More <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
          {displayItems.length === 0 && (
            <div className="w-full py-10 text-center text-slate-500 italic border border-dashed border-slate-300 dark:border-slate-700 rounded-xl mx-4">
              No updates found for this category right now.
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
          border-radius: 10px;
          margin: 0 16px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
        }
        .custom-scrollbar {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }
      `}} />
    </section>
  );
}
