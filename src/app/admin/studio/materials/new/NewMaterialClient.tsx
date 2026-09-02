
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createSignedUploadUrl, saveMaterialAction } from "../actions";
import { UploadCloud, File, CheckCircle, AlertTriangle, X, Loader2 } from "lucide-react";

export default function NewMaterialClient() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [hierarchy, setHierarchy] = useState<{ exams: any[]; subjects: any[]; topics: any[] }>({ exams: [], subjects: [], topics: [] });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PDF",
    exam_id: "",
    subject_id: "",
    topic_id: "",
    author: "",
    year: new Date().getFullYear().toString(),
    status: "DRAFT",
    tags: "",
    // PYQ specific metadata
    shift: "",
    duration: "",
    total_marks: ""
  });

  useEffect(() => {
    supabase.from("prep_exams").select("id, title").then(({ data }) => {
      if (data) setHierarchy(prev => ({ ...prev, exams: data }));
    });
  }, []);

  useEffect(() => {
    if (formData.exam_id) {
      supabase.from("prep_subjects").select("id, title").eq("exam_id", formData.exam_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, subjects: data || [] }));
      });
    } else {
      setHierarchy(prev => ({ ...prev, subjects: [], topics: [] }));
    }
  }, [formData.exam_id]);

  useEffect(() => {
    if (formData.subject_id) {
      supabase.from("prep_topics").select("id, title").eq("subject_id", formData.subject_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, topics: data || [] }));
      });
    } else {
      setHierarchy(prev => ({ ...prev, topics: [] }));
    }
  }, [formData.subject_id]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      
      // Auto-suggest title if empty
      if (!formData.title) {
        let name = f.name.replace(/\.[^/.]+$/, "");
        name = name.replace(/[-_]/g, " ");
        setFormData(prev => ({ ...prev, title: name }));
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!file) newErrors.file = "File is required";
    if (formData.type === 'PYQ' && !formData.year) newErrors.year = "Required for PYQs";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFileToSupabase = async (f: File, signedUrl: string) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      // We must not set Content-Type header manually if using browser default, 
      // but for Supabase storage PUTs, it's often good to set the mime type.
      xhr.setRequestHeader("Content-Type", f.type);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          reject(new Error("Upload failed with status: " + xhr.status));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(f);
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setUploadProgress(0);
    
    try {
      // 1. Get signed URL
      const { signedUrl, path } = await createSignedUploadUrl(file!.name);
      
      // 2. Upload to storage directly from browser using XHR to track progress
      await uploadFileToSupabase(file!, signedUrl);
      
      // 3. Save to database
      const payload: any = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        exam_id: formData.exam_id || null,
        subject_id: formData.subject_id || null,
        topic_id: formData.topic_id || null,
        author: formData.author,
        year: parseInt(formData.year) || null,
        status: formData.status,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        file_url: path,
      };

      if (formData.type === 'PYQ') {
        payload.metadata = {
          shift: formData.shift,
          duration: formData.duration,
          total_marks: formData.total_marks
        };
      }

      await saveMaterialAction(payload);
      
      alert("Material uploaded successfully!");
      router.push("/admin/studio/materials");
    } catch (e: any) {
      console.error(e);
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Upload Material</h1>
          <p className="text-slate-500 mt-1 text-sm">Add books, previous year papers, or PDFs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - File & Type */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">1. Select File</h3>
            
            {!file ? (
              <label className={`block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${errors.file ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'}`}>
                <UploadCloud size={32} className={`mx-auto mb-3 ${errors.file ? 'text-red-400' : 'text-slate-400'}`} />
                <span className="text-sm font-bold text-slate-700">Click or drag file here</span>
                <p className="text-xs text-slate-500 mt-1">PDF, DOCX, ZIP (Max 50MB)</p>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-4 relative">
                <button onClick={() => setFile(null)} disabled={loading} className="absolute top-2 right-2 p-1 hover:bg-indigo-100 rounded-full text-indigo-700 disabled:opacity-50">
                  <X size={16} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700"><File size={24} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-indigo-900 truncate">{file.name}</div>
                    <div className="text-xs text-indigo-700">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold text-indigo-800 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-indigo-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
                {uploadProgress === 100 && !loading && (
                   <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                     <CheckCircle size={14} /> Upload complete
                   </div>
                )}
              </div>
            )}
            {errors.file && <p className="text-xs font-bold text-red-500 mt-2">{errors.file}</p>}

            <h3 className="font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Material Type</h3>
            <div className="space-y-2">
              {['BOOK', 'PDF', 'PYQ', 'NOTE', 'SYLLABUS', 'PRACTICE_SET'].map(t => (
                <label key={t} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${formData.type === t ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="type" value={t} checked={formData.type === t} onChange={() => handleChange("type", t)} className="text-indigo-600 focus:ring-indigo-500" />
                  <span className="font-bold text-sm text-slate-700">{t.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white border-b pb-2">3. Primary Metadata</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Title <span className="text-red-500">*</span></label>
              <input type="text" value={formData.title} onChange={e => handleChange("title", e.target.value)} className={`w-full p-2.5 rounded-lg border ${errors.title ? 'border-red-400' : 'border-slate-200'} bg-slate-50 text-sm`} placeholder="e.g. Quantitative Aptitude Book" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
              <textarea value={formData.description} onChange={e => handleChange("description", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm min-h-[80px]" placeholder="Brief description of the contents..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Exam</label>
                <select value={formData.exam_id} onChange={e => handleChange("exam_id", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                  <option value="">Any / General</option>
                  {hierarchy.exams.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                <select value={formData.subject_id} onChange={e => handleChange("subject_id", e.target.value)} disabled={!formData.exam_id} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm disabled:opacity-50">
                  <option value="">Any / General</option>
                  {hierarchy.subjects.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Year</label>
                <input type="number" value={formData.year} onChange={e => handleChange("year", e.target.value)} className={`w-full p-2.5 rounded-lg border ${errors.year ? 'border-red-400' : 'border-slate-200'} bg-slate-50 text-sm`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Author / Source</label>
                <input type="text" value={formData.author} onChange={e => handleChange("author", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
              </div>
            </div>
          </div>

          {formData.type === 'PYQ' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-black text-amber-900 border-b border-amber-200 pb-2">PYQ Specific Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-800 mb-1">Shift</label>
                  <input type="text" value={formData.shift} onChange={e => handleChange("shift", e.target.value)} placeholder="e.g. Morning" className="w-full p-2.5 rounded-lg border border-amber-200 bg-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-800 mb-1">Duration</label>
                  <input type="text" value={formData.duration} onChange={e => handleChange("duration", e.target.value)} placeholder="e.g. 120 mins" className="w-full p-2.5 rounded-lg border border-amber-200 bg-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-800 mb-1">Total Marks</label>
                  <input type="text" value={formData.total_marks} onChange={e => handleChange("total_marks", e.target.value)} placeholder="e.g. 100" className="w-full p-2.5 rounded-lg border border-amber-200 bg-white text-sm" />
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
             <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tags (Comma separated)</label>
              <input type="text" value={formData.tags} onChange={e => handleChange("tags", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" placeholder="e.g. important, maths, adre" />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-500 mb-1">Initial Status</label>
              <select value={formData.status} onChange={e => handleChange("status", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold">
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} disabled={loading} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading || !file}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><UploadCloud size={18} /> Upload Material</>}
          </button>
        </div>
      </div>
    </div>
  );
}
