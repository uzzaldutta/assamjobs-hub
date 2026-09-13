const fs = require('fs');
const glob = require('glob'); // Note: I can just hardcode the paths
const paths = [
    'src/app/admit-cards/[id]/page.tsx',
    'src/app/admissions/[id]/page.tsx',
    'src/app/scholarships/[id]/page.tsx',
    'src/app/results/[id]/page.tsx',
    'src/app/jobs/[id]/page.tsx',
    'src/app/tenders/[id]/page.tsx',
    'src/app/study-materials/[materialId]/page.tsx',
    'src/app/mock-tests/[testId]/page.tsx'
];

for (let p of paths) {
    if (!fs.existsSync(p)) continue;
    let content = fs.readFileSync(p, 'utf8');
    
    if (content.includes('remark-gfm')) continue; // Already patched
    
    // 1. Add import
    content = content.replace('import ReactMarkdown from "react-markdown";', 
        `import ReactMarkdown from "react-markdown";\nimport remarkGfm from "remark-gfm";`);
        
    // 2. Add remarkPlugins
    content = content.replace(/<ReactMarkdown>/g, '<ReactMarkdown remarkPlugins={[remarkGfm]}>');
    
    // Also patch if it's already using some props (though we didn't see any earlier)
    
    fs.writeFileSync(p, content);
    console.log(`Patched ${p}`);
}
