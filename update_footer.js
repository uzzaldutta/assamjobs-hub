const fs = require('fs');
let p = 'src/components/Footer.tsx';
let c = fs.readFileSync(p, 'utf8');

const navSection = `        {/* Navigation */}
        <div className="col-span-1 lg:col-span-1">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-sm">Navigation</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Latest Jobs</Link></li>
            <li><Link href="/admit-cards" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Admit Cards</Link></li>
            <li><Link href="/results" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Exam Results</Link></li>
            <li><Link href="/tenders" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Assam Tenders</Link></li>
          </ul>

          <h3 className="font-bold text-slate-800 dark:text-white mt-8 mb-4 uppercase tracking-wider text-sm">Legal & About</h3>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">About Us</Link></li>
            <li><Link href="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact Us</Link></li>
            <li><Link href="/editorial-policy" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Editorial Policy</Link></li>
            <li><Link href="/privacy-policy" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms & Conditions</Link></li>
          </ul>
        </div>
`;

c = c.replace(/\{\/\* Navigation \*\/\}[\s\S]*?<\/ul>\n        <\/div>/, navSection);

fs.writeFileSync(p, c);
console.log("Updated Footer");
