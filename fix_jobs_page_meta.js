const fs = require('fs');
let p = 'src/app/jobs/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const target = `// export const metadata = {
  title: "Jobs in Assam",
  description: "Latest Government & Private jobs in Assam. Apply online for Assam Police, ADRE, APSC and other recruitment.",
  alternates: {
    canonical: "/jobs",
  }
};`;

// Also check with \r\n
const targetCRLF = target.replace(/\n/g, '\r\n');

c = c.replace(target, '');
c = c.replace(targetCRLF, '');

fs.writeFileSync(p, c);
console.log("Removed dangling metadata object completely.");
