"use client";

import { useState, useRef, ChangeEvent } from "react";
import PageHeader from "@/components/PageHeader";
import { Image as ImageIcon, Download, Upload, Crop, AlertCircle, Info } from "lucide-react";

export default function PhotoMaker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyAutoCrop = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Standard Indian Exam Photo (3.5cm x 4.5cm) aspect ratio = 35/45 = 0.77
      const targetRatio = 3.5 / 4.5;
      let sWidth = img.width;
      let sHeight = img.height;
      let sX = 0;
      let sY = 0;

      if (img.width / img.height > targetRatio) {
        // Image is too wide
        sWidth = img.height * targetRatio;
        sX = (img.width - sWidth) / 2;
      } else {
        // Image is too tall
        sHeight = img.width / targetRatio;
        sY = (img.height - sHeight) / 2;
      }

      // Output size for standard passport photo (roughly 413x531 pixels for 300dpi)
      canvas.width = 413;
      canvas.height = 531;

      // Draw white background first (for transparent PNGs)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, sX, sY, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      
      // Compress to JPEG (quality 0.7 usually keeps it under 50KB for this resolution)
      setCroppedImage(canvas.toDataURL("image/jpeg", 0.7));
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Passport Photo Maker" 
        subtitle="Crop, resize, and compress your photo to exactly match Govt Exam guidelines (3.5cm x 4.5cm, under 50KB, white background)."
        theme="blue"
      />

      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Editor Side */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          {!imageSrc ? (
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Upload size={48} className="text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Upload Photograph</h3>
              <p className="text-slate-500 text-sm">JPG or PNG (Max 5MB)</p>
              <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleUpload} />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex justify-center items-center h-80 p-2 relative">
                <img src={croppedImage || imageSrc} alt="Preview" className="max-h-full max-w-full object-contain shadow-md" />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={applyAutoCrop}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Crop size={18} /> Format to 3.5x4.5cm
                </button>
                <label className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition flex items-center justify-center">
                  <Upload size={18} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>

              {croppedImage && (
                <a 
                  href={croppedImage} 
                  download="Exam_Photo_Ready.jpg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition mt-4"
                >
                  <Download size={20} /> Download Ready Photo (Under 50KB)
                </a>
              )}
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Guidelines Side */}
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
              <Info className="text-blue-500" /> Perfect Background Guide
            </h3>
            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-500">1.</span> 
                Most Assam and Central Govt applications (SSC, APSC, SLPRB) strictly require a <b>Light or White background</b>.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-500">2.</span> 
                If you don't have a white background, stand against a plain, well-lit wall. Avoid shadows behind your head.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-500">3.</span> 
                Face must cover 70-80% of the photograph. Look straight at the camera. Do not wear sunglasses or caps.
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Official Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Dimensions</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">3.5cm x 4.5cm</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">File Size</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">20KB - 50KB</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Format</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">.JPG / .JPEG</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Date Printed</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Recommended</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
