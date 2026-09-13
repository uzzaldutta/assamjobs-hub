const fs = require('fs');

let pagePath = 'src/components/DesktopNav.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// First ensure Bookmark is imported from lucide-react
if (!content.includes('Bookmark')) {
    content = content.replace(
        'import { Home, Building2, GraduationCap, ChevronDown, Bell, Briefcase, FileText, Calendar, Wrench, Search, PenTool, Calculator, Compass, BookOpen } from "lucide-react";',
        'import { Home, Building2, GraduationCap, ChevronDown, Bell, Briefcase, FileText, Calendar, Wrench, Search, PenTool, Calculator, Compass, BookOpen, Bookmark } from "lucide-react";'
    );
}

// Add Saved Jobs link after Calendar
const target = '<Link href="/calendar" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">';

if (content.includes(target) && !content.includes('href="/saved"')) {
    content = content.replace(
        '<Link href="/calendar" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">',
        '<Link href="/saved" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">\n        <Bookmark size={16} /> Saved Jobs\n      </Link>\n\n      <Link href="/calendar" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">'
    );
    fs.writeFileSync(pagePath, content);
    console.log("Patched DesktopNav");
} else {
    console.log("DesktopNav target not found or already patched");
}
