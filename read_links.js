const fs = require('fs');
const content = fs.readFileSync('src/app/jobs/[id]/page.tsx', 'utf8');
const lines = content.split('\n');
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('apply_url') || lines[i].includes('official_pdf_url') || lines[i].includes('official_source_url')) {
        console.log(`Line ${i}: ${lines[i]}`);
    }
}
