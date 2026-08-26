"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  // Delay showing the widget slightly so it doesn't distract immediately on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="https://whatsapp.com/channel/0029VaA2B5m9MF92" // Dummy/Placeholder WhatsApp link
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-1/2 -translate-y-1/2 right-2 md:right-4 z-50 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-105 transition-all animate-in slide-in-from-right-8 fade-in duration-700"
    >
      <div className="relative flex h-3 w-3 absolute -top-1 -right-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </div>
      <MessageCircle size={22} className="fill-white" />
      <span className="font-bold text-sm hidden sm:block shadow-sm">Join WhatsApp Group</span>
    </a>
  );
}
