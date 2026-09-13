const fs = require('fs');

function addDesktopLink() {
    let content = fs.readFileSync('src/components/DesktopNav.tsx', 'utf8');
    const targetStr = `<Link href="/results" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_results")}</Link>`;
    const insertStr = `${targetStr}\n          <Link href="/scholarships" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Govt Schemes & Scholarships</Link>`;
    
    if (!content.includes('Govt Schemes & Scholarships')) {
        content = content.replace(targetStr, insertStr);
        fs.writeFileSync('src/components/DesktopNav.tsx', content);
        console.log("DesktopNav updated.");
    } else {
        console.log("DesktopNav already has link.");
    }
}

function addMobileLink() {
    let content = fs.readFileSync('src/components/MobileMenu.tsx', 'utf8');
    const targetStr = `<Link onClick={() => setIsOpen(false)} href="/admissions" className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300">All-India Admissions</Link>`;
    const insertStr = `${targetStr}\n                  <Link onClick={() => setIsOpen(false)} href="/scholarships" className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl font-medium text-sm text-pink-700 dark:text-pink-400">Govt Schemes & Scholarships</Link>`;
    
    if (!content.includes('Govt Schemes & Scholarships')) {
        content = content.replace(targetStr, insertStr);
        fs.writeFileSync('src/components/MobileMenu.tsx', content);
        console.log("MobileMenu updated.");
    } else {
        console.log("MobileMenu already has link.");
    }
}

addDesktopLink();
addMobileLink();
