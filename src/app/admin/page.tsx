"use client";

import { useState } from "react";
import { Shield, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    job_type: "GOVERNMENT",
    category: "ASSAM_STATE",
    vacancies: "",
    qualification: "",
    district: "All Assam",
    age_limit: "",
    application_fee: "None",
    selection_process: "",
    last_date: "",
    official_pdf_url: "",
    apply_url: "",
    unique_description: "",
    unique_description_assamese: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/admin/add-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add job");

      setStatus("success");
      setFormData({
        title: "", organization: "", job_type: "GOVERNMENT", category: "ASSAM_STATE",
        vacancies: "", qualification: "", district: "All Assam", age_limit: "",
        application_fee: "None", selection_process: "", last_date: "",
        official_pdf_url: "", apply_url: "", unique_description: "", unique_description_assamese: ""
      });
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Manually publish updates to the live feed</p>
            </div>
          </div>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">Back to Live Site</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          
          {status === "success" && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={18} /> Successfully published to live feed!
            </div>
          )}
          {status === "error" && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-2">
              <AlertCircle size={18} /> Failed to publish. Check console.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" placeholder="e.g. Junior Assistant" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Organization / Department</label>
              <input required name="organization" value={formData.organization} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" placeholder="e.g. PWD Assam" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
              <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                <option value="GOVERNMENT">Government Job</option>
                <option value="PRIVATE">Private Job</option>
                <option value="EXAM_UPDATE">Exam Result / Admit Card</option>
                <option value="TENDER">Tender</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <input required name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" placeholder="e.g. ASSAM_STATE" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vacancies / Value</label>
              <input required name="vacancies" value={formData.vacancies} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" placeholder="e.g. 50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Date</label>
              <input required type="date" name="last_date" value={formData.last_date} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">District / Location</label>
              <input required name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Qualification</label>
              <input name="qualification" value={formData.qualification} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Application Fee</label>
              <input name="application_fee" value={formData.application_fee} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Selection Process</label>
              <input name="selection_process" value={formData.selection_process} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Official URL / Apply Link</label>
              <input name="apply_url" value={formData.apply_url} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">English Description (Paragraphs)</label>
              <textarea required rows={4} name="unique_description" value={formData.unique_description} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assamese Description (Paragraphs)</label>
              <textarea rows={4} name="unique_description_assamese" value={formData.unique_description_assamese} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "loading" ? "Publishing..." : <><PlusCircle size={18} /> Publish Live</>}
          </button>
        </form>
      </div>
    </div>
  );
}
