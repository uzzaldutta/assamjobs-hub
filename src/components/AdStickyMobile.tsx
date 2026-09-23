"use client";

import { memo, useState } from "react";
import { X } from "lucide-react";

const AdStickyMobile = memo(function AdStickyMobile() {
  const [isVisible, setIsVisible] = useState(true);
  const adsterraKey = 'df2a66dc0a1de9a4602e381a3715bd36';
  
  if (!isVisible) return null;

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
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/${adsterraKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="fixed bottom-[60px] sm:bottom-0 left-0 right-0 z-[60] flex justify-center items-end pointer-events-none md:hidden pb-2 px-2">
      <div className="relative pointer-events-auto bg-white dark:bg-slate-900 rounded-lg shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-700 flex flex-col items-center p-1 animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10"
          aria-label="Close Ad"
        >
          <X size={14} strokeWidth={3} />
        </button>

        {/* Ad Container */}
        <div className="w-[320px] h-[50px] overflow-hidden flex justify-center items-center bg-slate-100 dark:bg-slate-800 rounded">
          <iframe 
            srcDoc={html} 
            width="320" 
            height="50" 
            frameBorder="0" 
            scrolling="no" 
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
            className="w-[320px] h-[50px]"
            title="Mobile Advertisement"
          />
        </div>
        
      </div>
    </div>
  );
});

export default AdStickyMobile;
