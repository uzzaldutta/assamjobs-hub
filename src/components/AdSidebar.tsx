import Link from "next/link";
import { Sparkles, Phone } from "lucide-react";

export default function AdSidebar() {
  return (
    <aside className="lg:col-span-4 hidden lg:block">
      <div className="sticky top-24 flex flex-col gap-6">
        
        {/* AD PLACEHOLDER */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Sponsored Content</span>
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <h4 className="text-slate-600 dark:text-slate-400 font-bold mb-1">Ad Space Available</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-[200px]">This premium slot is perfectly optimized for AdSense or direct sponsors.</p>
        </div>

        {/* PROMO: AI MOCK TESTS */}
        <Link href="/mock-tests/ai-generator" className="block bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <h4 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
            <Sparkles size={20} />
            AI Mock Tests
          </h4>
          <p className="text-violet-100 text-sm mb-4 relative z-10 leading-relaxed">Generate realistic 20-question mock tests for APSC, ADRE, and Assam Police instantly.</p>
          <div className="bg-white text-violet-600 text-center text-sm font-bold px-4 py-2 rounded-lg w-full relative z-10 group-hover:bg-gray-50 transition-colors">Try it now &rarr;</div>
        </Link>

        {/* CTA: WHATSAPP */}
        <a href="#" className="block bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
            <Phone size={20} />
            Join Community
          </h4>
          <p className="text-emerald-600 dark:text-emerald-500/80 text-sm mb-4 leading-relaxed">Get instant alerts for admit cards, job updates, and results directly on your phone.</p>
          <div className="bg-emerald-500 group-hover:bg-emerald-600 text-white text-center text-sm font-bold px-4 py-2 rounded-lg w-full transition-colors shadow-sm">Join WhatsApp Group</div>
        </a>

      </div>
    </aside>
  );
}
