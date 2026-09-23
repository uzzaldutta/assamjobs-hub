"use client";
import { memo } from "react";
export const AdHorizontal = memo(function AdHorizontal({ className = "" }: { className?: string }) {
  const html = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style></head><body><script type="text/javascript">atOptions = {'key' : '4598da1b035b538d3fa24b6b8391af3f','format' : 'iframe','height' : 60,'width' : 468,'params' : {}};</script><script type="text/javascript" src="https://www.highrevenueformat.com/4598da1b035b538d3fa24b6b8391af3f/invoke.js"></script></body></html>`;
  return (<div className={`flex justify-center items-center overflow-hidden w-full max-w-[468px] mx-auto bg-slate-50/50 dark:bg-slate-900/30 rounded-lg min-h-[60px] ${className}`}><iframe srcDoc={html} width="468" height="60" frameBorder="0" scrolling="no" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin" className="w-[468px] h-[60px] max-w-full" title="Ad" /></div>);
});
