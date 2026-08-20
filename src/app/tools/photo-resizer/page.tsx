"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Download, Upload } from "lucide-react";

export default function PhotoResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(250);
  const [height, setHeight] = useState<number>(250);
  const [quality, setQuality] = useState<number>(0.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      // Draw and resize
      ctx.drawImage(img, 0, 0, width, height);
      
      // Export
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      const link = document.createElement("a");
      link.download = "resized-photo-assamjobs.jpg";
      link.href = dataUrl;
      link.click();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
            <ImageIcon className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Photo & Signature Resizer</h1>
          <p className="text-slate-500 mt-2 max-w-md">Resize and compress your passport photo or signature for Govt job applications directly in your browser. (100% Private, no data uploaded).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="flex flex-col gap-4">
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/50 min-h-[250px]">
              <Upload size={32} className="text-slate-400 mb-3" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Click to Upload Image</span>
              <span className="text-xs text-slate-500 mt-1">JPG, PNG supported</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Controls Section */}
          <div className="space-y-5 flex flex-col justify-center">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Width (pixels)</label>
              <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Height (pixels)</label>
              <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Compression Quality</span>
                <span className="text-blue-600">{Math.round(quality * 100)}%</span>
              </label>
              <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-blue-600" />
              <p className="text-xs text-slate-400 mt-1">Lower quality = Smaller file size (KB)</p>
            </div>

            <button 
              onClick={handleDownload}
              disabled={!image}
              className={`w-full py-3.5 flex justify-center items-center gap-2 font-bold rounded-xl transition shadow-md ${image ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
            >
              <Download size={18} /> Download Resized Image
            </button>
          </div>
        </div>

        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

      </div>
    </div>
  );
}
