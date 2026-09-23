"use client";

import { memo } from "react";

interface AdLeaderboardProps {
  className?: string;
}

const AdLeaderboard = memo(function AdLeaderboard({ className = "" }: AdLeaderboardProps) {
  const adsterraKey = 'b84af8aa8509d261adb4b77f09fa1d08';
  
  const html = `
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
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/${adsterraKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`flex justify-center items-center overflow-hidden w-full max-w-[728px] mx-auto my-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl min-h-[90px] ${className}`}>
      <iframe 
        srcDoc={html} 
        width="728" 
        height="90" 
        frameBorder="0" 
        scrolling="no" 
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        className="w-[728px] h-[90px] max-w-full"
        title="Advertisement"
      />
    </div>
  );
});

export default AdLeaderboard;
