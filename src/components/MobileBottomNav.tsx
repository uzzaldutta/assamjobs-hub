"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, CreditCard, LayoutDashboard, Wrench } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav_home"), href: "/", icon: Home },
    { name: t("nav_study"), href: "/study-materials", icon: BookOpen },
    { name: t("nav_admits"), href: "/admit-cards", icon: CreditCard },
    { name: t("nav_results"), href: "/results", icon: LayoutDashboard },
    { name: t("nav_tools"), href: "/tools", icon: Wrench },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 glass border border-slate-200/50 dark:border-slate-700/50 flex justify-around items-center p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${
              isActive 
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <item.icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} className="transition-all duration-300" />
            <span className={`text-[10px] mt-0.5 transition-all duration-300 ${isActive ? "font-bold" : "font-medium"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
