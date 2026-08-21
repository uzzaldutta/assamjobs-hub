"use client";

import { useState } from "react";
import { FileDown, ImagePlus, X, FileSignature } from "lucide-react";
import jsPDF from "jspdf";

export default function PDFMerger() {
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        img.src = images[i];
        
        await new Promise((resolve) => {
          img.onload = () => {
            // A4 dimensions are 210 x 297 mm
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 10;
            
            const maxImgWidth = pageWidth - (margin * 2);
            const maxImgHeight = pageHeight - (margin * 2);

            let renderWidth = maxImgWidth;
            let renderHeight = (img.height * renderWidth) / img.width;

            if (renderHeight > maxImgHeight) {
              renderHeight = maxImgHeight;
              renderWidth = (img.width * renderHeight) / img.height;
            }

            // Center the image
            const x = (pageWidth - renderWidth) / 2;
            const y = (pageHeight - renderHeight) / 2;

            if (i > 0) pdf.addPage();
            
            // Add image with FAST compression to keep file size tiny
            pdf.addImage(img, 'JPEG', x, y, renderWidth, renderHeight, undefined, 'FAST');
            resolve(true);
          };
        });
      }

      pdf.save("Merged_Documents_AssamJobs.pdf");
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/50 rounded-full mb-4">
            <FileSignature className="text-rose-600 dark:text-rose-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Image to PDF Merger</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Select your Marksheets, PRC, and ID Proof to instantly merge them into a single, compressed PDF file for APSC and ADRE applications. 100% private.</p>
        </div>

        <div className="mb-8">
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/50">
            <ImagePlus size={40} className="text-slate-400 mb-4" />
            <span className="font-bold text-lg text-slate-700 dark:text-slate-300">Click to Select Images</span>
            <span className="text-sm text-slate-500 mt-2 max-w-sm">You can select multiple images at once (JPG, PNG). They will be added in order.</span>
            <input type="file" multiple accept="image/jpeg, image/png" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {images.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
              <span>Selected Documents ({images.length})</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 aspect-[3/4] bg-slate-100 dark:bg-slate-800">
                  <img src={img} alt={`Document ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button onClick={() => removeImage(index)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-white text-xs font-bold text-center py-1.5">
                    Page {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button 
            onClick={generatePDF}
            disabled={images.length === 0 || isGenerating}
            className={`w-full md:w-auto px-10 py-4 flex items-center justify-center gap-2 font-bold rounded-xl transition shadow-lg ${
              images.length > 0 ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <span className="animate-pulse">Compressing and Generating PDF...</span>
            ) : (
              <>
                <FileDown size={20} />
                Generate Merged PDF
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
