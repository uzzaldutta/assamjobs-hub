const fs = require('fs');

let pagePath = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes('EligibilityDetailButton')) {
    content = content.replace(
        'import ShareButtons from "@/components/ShareButtons";',
        'import ShareButtons from "@/components/ShareButtons";\nimport EligibilityDetailButton from "@/components/EligibilityDetailButton";'
    );
    
    // Find where to insert it. Under the "Apply Now" block in the sticky sidebar
    const target = 'Data provided for informational purposes.';
    if (content.includes(target)) {
        content = content.replace(
            '<p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4 flex flex-col items-center gap-1">\n                <AlertCircle size={14} />\n                <span className="uppercase text-[10px] font-bold tracking-wider">Unverified Source</span>\n                Data provided for informational purposes.\n              </p>',
            '<p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4 flex flex-col items-center gap-1">\n                <AlertCircle size={14} />\n                <span className="uppercase text-[10px] font-bold tracking-wider">Unverified Source</span>\n                Data provided for informational purposes.\n              </p>\n              <EligibilityDetailButton job={job} />'
        );
        
        // Also handle the case where it's verified
        content = content.replace(
            '<p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4 flex flex-col items-center gap-1">\n                <CheckCircle2 size={14} className="text-emerald-500" />\n                <span className="uppercase text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Verified Source</span>\n                Data verified against official notification.\n              </p>',
            '<p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4 flex flex-col items-center gap-1">\n                <CheckCircle2 size={14} className="text-emerald-500" />\n                <span className="uppercase text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Verified Source</span>\n                Data verified against official notification.\n              </p>\n              <EligibilityDetailButton job={job} />'
        );
    }
    fs.writeFileSync(pagePath, content);
    console.log("Patched detail page");
}
