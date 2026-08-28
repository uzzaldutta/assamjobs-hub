"use client";

import { useTheme } from "@teispace/next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Moon, Sun, Globe, Bell, Shield, Info, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, toggleLanguage } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto w-full p-4 pb-24 relative z-10">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 mt-4">Settings</h1>
      
      {/* Preferences Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 px-2">Preferences</h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Dark Mode</p>
                <p className="text-xs text-slate-500">Adjust the appearance of the app</p>
              </div>
            </div>
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute transition-transform shadow-sm ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Language</p>
                <p className="text-xs text-slate-500">Switch between English and Assamese</p>
              </div>
            </div>
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {lang === "en" ? "English" : "অসমীয়া"}
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Notifications</p>
                <p className="text-xs text-slate-500">Get alerts for new job updates</p>
              </div>
            </div>
            <button className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold">
              Subscribe
            </button>
          </div>

        </div>
      </div>

      {/* App Info Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 px-2">Information</h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          
          <Link href="#" className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Info size={20} />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">About Us</p>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </Link>

          <Link href="#" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                <Shield size={20} />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Privacy Policy</p>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </Link>

        </div>
      </div>

      {/* Community Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 px-2">Community</h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          
          <a href="https://whatsapp.com/channel/0029VaFw44C4yltQ06GqCj3B" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Join WhatsApp Channel</p>
                <p className="text-xs text-slate-500">Get instant job updates</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </a>

        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs mb-10">AssamJobs Hub PWA • Version 1.0.0</p>
    </div>
  );
}
