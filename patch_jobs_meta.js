const fs = require('fs');
let p = 'src/app/jobs/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "export const metadata = {",
  "export async function generateMetadata(props: { searchParams?: Promise<{ [key: string]: string }> }) {\n  const searchParams = await props.searchParams;\n  const hasFilters = searchParams && Object.keys(searchParams).length > 0 && !(Object.keys(searchParams).length === 1 && searchParams.page);\n  return {\n    title: \"Jobs in Assam\",\n    description: \"Latest Government & Private jobs in Assam. Apply online for Assam Police, ADRE, APSC and other recruitment.\",\n    alternates: {\n      canonical: \"/jobs\",\n    },\n    robots: {\n      index: !hasFilters,\n      follow: true\n    }\n  };\n}\n\n// export const metadata = {"
);

fs.writeFileSync(p, c);
console.log("Updated jobs page metadata for filter control");
