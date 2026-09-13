const fs = require('fs');
let content = fs.readFileSync('src/components/JobCard.tsx', 'utf8');

const target = `) : null}`;
const replacement = `) : null}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEligibility(true); }}
            className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold py-2.5 px-3.5 rounded-lg transition-colors flex-1 sm:flex-none"
          >
            <CheckCircle2 size={12} /> Am I Eligible?
          </button>`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/JobCard.tsx', content);
    console.log("Patched JobCard.tsx successfully");
} else {
    console.log("Could not find target string.");
}
