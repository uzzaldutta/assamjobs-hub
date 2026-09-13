"use client";
import { useEffect } from "react";

export default function HeaderScrollTracker() {
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      const inner = document.getElementById("header-inner");
      const logo = document.getElementById("header-logo");
      const header = document.getElementById("main-header");
      
      if (isScrolled) {
        if (inner) {
          inner.classList.remove("md:h-20", "h-16");
          inner.classList.add("md:h-16", "h-14");
        }
        if (logo) {
          logo.classList.remove("h-20");
          logo.classList.add("h-14");
        }
        if (header) {
          header.classList.add("shadow-md", "bg-white/95", "dark:bg-slate-900/95");
          header.classList.remove("bg-white/90", "dark:bg-slate-900/90");
        }
      } else {
        if (inner) {
          inner.classList.remove("md:h-16", "h-14");
          inner.classList.add("md:h-20", "h-16");
        }
        if (logo) {
          logo.classList.remove("h-14");
          logo.classList.add("h-20");
        }
        if (header) {
          header.classList.remove("shadow-md", "bg-white/95", "dark:bg-slate-900/95");
          header.classList.add("bg-white/90", "dark:bg-slate-900/90");
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount in case the page is already scrolled
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return null;
}
