const fs = require('fs');

function setForceDynamic(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/export const revalidate = 86400;.*\n/g, '');
    if (!content.includes("export const dynamic = 'force-dynamic';")) {
        content = content.replace("export default async function", "export const dynamic = 'force-dynamic';\n\nexport default async function");
    }
    fs.writeFileSync(file, content);
}

setForceDynamic('src/app/scholarships/page.tsx');
setForceDynamic('src/app/admissions/page.tsx');
setForceDynamic('src/app/admit-cards/page.tsx');
setForceDynamic('src/app/results/page.tsx');
console.log("Set force-dynamic");
