"use client";
import { memo } from "react";
export const AdSkyscraperTall = memo(function AdSkyscraperTall({ className = "" }: { className?: string }) {
  const html = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style></head><body><script type="text/javascript">atOptions = {'key' : '8b1f0292aa3de027a810fb3464c7b398','format' : 'iframe','height' : 600,'width' : 160,'params' : {}};</script><script type="text/javascript" src="https://www.highrevenueformat.com/8b1f0292aa3de027a810fb3464c7b398/invoke.js"></script></body></html>`;
  return (<div className={`flex justify-center items-center overflow-hidden w-full max-w-[160px] mx-auto bg-slate-50/50 dark:bg-slate-900/30 rounded-lg min-h-[600px] ${className}`}><iframe srcDoc={html} width="160" height="600" frameBorder="0" scrolling="no" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin" className="w-[160px] h-[600px] max-w-full" title="Ad" /></div>);
});
