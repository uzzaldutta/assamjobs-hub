const fs = require('fs');

let p = 'src/app/study-materials/[materialId]/page.tsx';
if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('generateMetadata({ params }: { params: { materialId: string } })')) {
        c = c.replace(
            'export async function generateMetadata({ params }: { params: { materialId: string } }): Promise<Metadata> {',
            'export async function generateMetadata(props: { params: Promise<{ materialId: string }> }): Promise<Metadata> {\n  const params = await props.params;'
        );
        fs.writeFileSync(p, c);
        console.log("Patched study");
    }
}

p = 'src/app/mock-tests/[testId]/page.tsx';
if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('generateMetadata({ params }: { params: { testId: string } })')) {
        c = c.replace(
            'export async function generateMetadata({ params }: { params: { testId: string } }): Promise<Metadata> {',
            'export async function generateMetadata(props: { params: Promise<{ testId: string }> }): Promise<Metadata> {\n  const params = await props.params;'
        );
        fs.writeFileSync(p, c);
        console.log("Patched mock");
    } else if (c.includes('generateMetadata({ params }: { params: Promise<{ testId: string }> })')) {
        c = c.replace(
            'export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }): Promise<Metadata> {\n  const { testId } = await params;',
            'export async function generateMetadata(props: { params: Promise<{ testId: string }> }): Promise<Metadata> {\n  const params = await props.params;\n  const { testId } = params;'
        );
        fs.writeFileSync(p, c);
        console.log("Patched mock (v2)");
    }
}
