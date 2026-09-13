const fs = require('fs');
const paths = [
    'src/app/jobs/page.tsx',
    'src/app/admissions/page.tsx',
    'src/app/admit-cards/page.tsx',
    'src/app/results/page.tsx',
    'src/app/scholarships/page.tsx',
    'src/app/tenders/page.tsx',
    'src/app/search/page.tsx'
];

for (let p of paths) {
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/export const dynamic = ['"]force-dynamic['"];?/g, '');
        // make sure export const revalidate = 86400 is there
        if (!content.includes('export const revalidate')) {
            content = `export const revalidate = 86400;\n` + content;
        }
        fs.writeFileSync(p, content);
    }
}
console.log("Reverted force-dynamic");
