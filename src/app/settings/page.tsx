"use client";

import { useTheme } from "next-themes";
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

      {/* Admin Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Admin Area</h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          
          <Link href="/admin" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Lock size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Admin Dashboard</p>
                <p className="text-xs text-slate-500">Post new jobs and manage content</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </Link>

        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs mb-10">AssamJobs Hub PWA • Version 1.0.0</p>
    </div>
  );
}
