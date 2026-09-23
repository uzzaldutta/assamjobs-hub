const fs = require('fs');
let p = 'src/app/layout.tsx';
let c = fs.readFileSync(p, 'utf8');

const orgSchema = `
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AssamJobsHub",
    "url": "https://assamjobshub.com",
    "logo": "https://assamjobshub.com/logo.png"
  };
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AssamJobsHub",
    "url": "https://assamjobshub.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://assamjobshub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
`;

const schemaTags = `
        <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <Script id="website-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
`;

if (!c.includes('org-schema')) {
  // Insert logic before return
  const insertIndex = c.lastIndexOf('return (');
  c = c.slice(0, insertIndex) + orgSchema + '\n  ' + c.slice(insertIndex);
  
  // Insert tags in head
  const headIndex = c.indexOf('</head>');
  if (headIndex !== -1) {
    c = c.slice(0, headIndex) + schemaTags + c.slice(headIndex);
  } else {
    // try inside <body
    c = c.replace('<body className=', schemaTags + '\n        <body className=');
  }
  
  fs.writeFileSync(p, c);
  console.log("Added Org & WebSite schema to layout");
}
