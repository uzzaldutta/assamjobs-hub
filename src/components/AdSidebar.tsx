import Link from "next/link";
import AdBanner from "./AdBanner";
import { AdSkyscraperHalf } from "./AdSkyscraperHalf";
import { Sparkles, Phone } from "lucide-react";

export default function AdSidebar() {
  return (
    <aside className="lg:col-span-4 hidden lg:block">
      <div className="sticky top-24 flex flex-col gap-6">
        
        {/* ADSTERRA BANNER */}
        <div className="flex justify-center w-full">
          <AdBanner />
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
        {/* BOTTOM ADSTERRA SKYSCRAPER */}
        <div className="flex justify-center w-full mt-4">
          <AdSkyscraperHalf />
        </div>

      </div>
    </aside>
  );
}

