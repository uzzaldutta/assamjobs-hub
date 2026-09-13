const fs = require('fs');

let pagePath = 'src/components/MobileBottomNav.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// Add Bookmark import
if (!content.includes('Bookmark')) {
    content = content.replace(
        'import { Home, Briefcase, BookOpen, Brain, Bell, FileText, ClipboardList, GraduationCap, X, FolderOpen } from "lucide-react";',
        'import { Home, Briefcase, BookOpen, Brain, Bell, FileText, ClipboardList, GraduationCap, X, FolderOpen, Bookmark } from "lucide-react";'
    );
}

// Add Saved Jobs link inside the jobs popup
const target = '<div className="grid grid-cols-2 gap-3">';
if (content.includes(target) && !content.includes('Saved Jobs')) {
    content = content.replace(
        '<div className="grid grid-cols-2 gap-3">',
        '<div className="grid grid-cols-2 gap-3">\n            <Link href="/saved" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors group col-span-2">\n              <div className="p-3 bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-400 rounded-full group-hover:scale-110 transition-transform"><Bookmark size={24} /></div>\n              <span className="font-bold text-rose-900 dark:text-rose-300 text-sm">Saved Jobs</span>\n            </Link>'
    );
    fs.writeFileSync(pagePath, content);
    console.log("Patched MobileBottomNav");
} else {
    console.log("MobileBottomNav target not found or already patched");
}
