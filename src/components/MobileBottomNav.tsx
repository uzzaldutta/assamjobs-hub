"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, CreditCard, LayoutDashboard, Wrench } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Tenders", href: "/tenders", icon: FileText },
    { name: "Admits", href: "/admit-cards", icon: CreditCard },
    { name: "Results", href: "/results", icon: LayoutDashboard },
    { name: "Tools", href: "/tools", icon: Wrench },
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
