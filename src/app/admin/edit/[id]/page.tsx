"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [token, setToken] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle");
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    last_date: "",
    apply_url: "",
    unique_description: "",
    vacancies: "",
    qualification: "",
    age_limit: "",
  });

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) {
      router.push("/admin");
    } else {
      setToken(t);
      setIsAdmin(true);
      fetchJobData();
    }
  }, []);

  const fetchJobData = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (data) {
        setFormData({
          title: data.title || "",
          organization: data.organization || "",
          last_date: data.last_date || "",
          apply_url: data.apply_url || data.official_pdf_url || "",
          unique_description: data.unique_description || "",
          vacancies: data.vacancies || "",
          qualification: data.qualification || "",
          age_limit: data.age_limit || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoadingData(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/admin/edit-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: params.id,
          ...formData
        })
      });

      if (!res.ok) throw new Error("Failed to save");
      
      setStatus("success");
      setTimeout(() => {
        router.push(`/jobs/${params.id}`);
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (!isAdmin || isLoadingData) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href={`/jobs/${params.id}`} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 mb-6">
          <ArrowLeft size={16} /> Back to Job Post
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Edit Job Data</h1>
          
          {status === "success" && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 font-bold">
              <CheckCircle2 size={18} /> Changes saved successfully! Redirecting...
            </div>
          )}
          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle size={18} /> Failed to save changes.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Organization</label>
                <input required name="organization" value={formData.organization} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Last Date</label>
                <input type="date" name="last_date" value={formData.last_date} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Apply Link / PDF URL</label>
              <input required name="apply_url" value={formData.apply_url} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Vacancies</label>
                <input name="vacancies" value={formData.vacancies} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
                <input name="qualification" value={formData.qualification} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Age Limit</label>
                <input name="age_limit" value={formData.age_limit} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description (English)</label>
              <textarea rows={5} required name="unique_description" value={formData.unique_description} onChange={handleChange} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800" />
            </div>

            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 mt-6"
            >
              {status === "loading" ? "Saving..." : <><Save size={20} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
