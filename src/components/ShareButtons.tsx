"use client";

import { Share2, MessageCircle, Send } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this job on AssamJobs Hub: ${title}`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-medium transition shadow-sm"
      >
        <MessageCircle size={18} /> WhatsApp
      </a>
      
      <a 
        href={telegramUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl font-medium transition shadow-sm"
      >
        <Send size={18} /> Telegram
      </a>
      
      <a 
        href={facebookUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-medium transition shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        Facebook
      </a>
      
      <button 
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-medium transition shadow-sm"
      >
        <Share2 size={18} /> More (SMS, Insta)
      </button>
    </div>
  );
}
