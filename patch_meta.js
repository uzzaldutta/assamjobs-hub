const fs = require('fs');
const glob = require('glob');

const paths = [
    'src/app/jobs/[id]/page.tsx',
    'src/app/admit-cards/[id]/page.tsx',
    'src/app/admissions/[id]/page.tsx',
    'src/app/scholarships/[id]/page.tsx',
    'src/app/results/[id]/page.tsx',
    'src/app/tenders/[id]/page.tsx',
    'src/app/study-materials/[materialId]/page.tsx',
    'src/app/mock-tests/[testId]/page.tsx'
];

for (let p of paths) {
    if (!fs.existsSync(p)) continue;
    let content = fs.readFileSync(p, 'utf8');
    
    // Check if generateMetadata needs params awaited
    if (content.includes('generateMetadata({ params }: { params: { id: string } })')) {
        content = content.replace(
            'export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {',
            'export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {\n  const params = await props.params;'
        );
        fs.writeFileSync(p, content);
        console.log("Patched", p);
    }
}
