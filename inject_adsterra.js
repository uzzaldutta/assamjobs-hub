const fs = require('fs');

const adsterraKey = 'd8f486099a4c6a545205addb6b9dcfee';

const bannerCode = `"use client";

import { memo } from "react";

interface AdBannerProps {
  className?: string;
  dataAdSlot?: string; // Kept for backwards compatibility if any imports use it
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

const AdBanner = memo(function AdBanner({ className = "" }: AdBannerProps) {
  const html = \`
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adsterraKey}',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/${adsterraKey}/invoke.js"></script>
      </body>
    </html>
  \`;

  return (
    <div className={\`flex justify-center items-center my-4 overflow-hidden w-full max-w-[300px] mx-auto min-h-[250px] bg-slate-50/50 dark:bg-slate-900/30 rounded-lg \${className}\`}>
      <iframe 
        srcDoc={html} 
        width="300" 
        height="250" 
        frameBorder="0" 
        scrolling="no" 
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        className="w-[300px] h-[250px]"
        title="Advertisement"
      />
    </div>
  );
});

export default AdBanner;
`;

fs.writeFileSync('src/components/AdBanner.tsx', bannerCode);

let sidebar = fs.readFileSync('src/components/AdSidebar.tsx', 'utf8');
if (!sidebar.includes('import AdBanner')) {
  sidebar = sidebar.replace('import Link from "next/link";', 'import Link from "next/link";\nimport AdBanner from "./AdBanner";');
}

const adPlaceholderRegex = /\{\/\* AD PLACEHOLDER \*\/\}[\s\S]*?<\/div>\n/;
sidebar = sidebar.replace(adPlaceholderRegex, `
        {/* ADSTERRA BANNER */}
        <div className="flex justify-center">
          <AdBanner />
        </div>
`);

fs.writeFileSync('src/components/AdSidebar.tsx', sidebar);

console.log("Injected Adsterra codes securely using srcDoc iframes");
