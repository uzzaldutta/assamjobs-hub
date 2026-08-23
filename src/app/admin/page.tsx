"use client";

import { useState, useEffect } from "react";
import { Shield, PlusCircle, CheckCircle2, AlertCircle, Lock, Edit, Trash2, List } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"manage" | "create">("manage");

  // CMS State
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Form State
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    title: "", organization: "", job_type: "GOVERNMENT", category: "ASSAM_STATE",
    vacancies: "", qualification: "", district: "All Assam", age_limit: "",
    application_fee: "None", selection_process: "", last_date: "",
    official_pdf_url: "", apply_url: "", unique_description: "", unique_description_assamese: ""
  });

  // Check existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setPassword(token);
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: token }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("adminToken", token);
        fetchJobs(); // Fetch CMS data
      } else {
        localStorage.removeItem("adminToken");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyToken(password);
  };

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('scraped_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this post?")) return;
    
    try {
      const res = await fetch("/api/admin/delete-job", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/add-job", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add job");

      setStatus("success");
      setFormData({
        title: "", organization: "", job_type: formData.job_type, category: "ASSAM_STATE",
        vacancies: "", qualification: "", district: "All Assam", age_limit: "",
        application_fee: "None", selection_process: "", last_date: "",
        official_pdf_url: "", apply_url: "", unique_description: "", unique_description_assamese: ""
      });
      fetchJobs(); // Refresh the table
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Lock size={24} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Admin Hub</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Admin Password</label>
                <div className="mt-1">
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white" />
                </div>
              </div>
              <button type="submit" disabled={isLoggingIn} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {isLoggingIn ? "Verifying..." : "Unlock Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Universal Admin Hub</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Manage Auto Feeds & Manual Posts</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={() => { localStorage.removeItem("adminToken"); window.location.reload(); }} className="text-sm text-red-500 font-bold hover:underline">Log Out</button>
            <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">Back to Live Site</Link>
          </div>
        </div>

        {/* CMS Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-full max-w-md">
          <button onClick={() => setActiveTab("manage")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "manage" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <List size={16} /> Manage Feeds
          </button>
          <button onClick={() => setActiveTab("create")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "create" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <PlusCircle size={16} /> Create Post
          </button>
        </div>

        {activeTab === "manage" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">All Database Entries</h3>
              <button onClick={fetchJobs} className="text-sm text-indigo-600 font-medium hover:underline">Refresh</button>
            </div>
            
            <div className="overflow-x-auto">
              {isLoadingJobs ? (
                <div className="p-8 text-center text-slate-500">Loading feeds...</div>
              ) : jobs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No jobs found in the database.</div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/20">
                      <th className="p-4 font-semibold">Title</th>
                      <th className="p-4 font-semibold">Type</th>
                      <th className="p-4 font-semibold">Date Added</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate" title={job.title}>
                          {job.title}
                          <div className="text-xs text-slate-400 font-normal truncate mt-0.5">{job.organization}</div>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{job.job_type}</span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(job.scraped_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 flex gap-2 justify-end">
                          <Link href={`/admin/edit/${job.id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition" title="Edit Post">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(job.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition" title="Delete Post">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "create" && (
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
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold">Post Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Organization / Department</label>
                <input required type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Post Type</label>
                <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <option value="GOVERNMENT">Government Job</option>
                  <option value="PRIVATE">Private Job</option>
                  <option value="EXAM_UPDATE">Result / Admit Card</option>
                  <option value="ADMISSION">Admission</option>
                  <option value="TENDER">Tender</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Vacancies (Optional)</label>
                <input type="text" name="vacancies" value={formData.vacancies} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Last Date (Optional)</label>
                <input type="date" name="last_date" value={formData.last_date} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Apply URL (Optional)</label>
                <input type="url" name="apply_url" value={formData.apply_url} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Official PDF URL (Optional)</label>
                <input type="url" name="official_pdf_url" value={formData.official_pdf_url} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold flex justify-between">
                  <span>Markdown Description (English)</span>
                  <span className="text-xs text-indigo-500">Supports Markdown</span>
                </label>
                <textarea required rows={12} name="unique_description" value={formData.unique_description} onChange={handleChange} className="w-full p-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm"></textarea>
              </div>
            </div>

            <button type="submit" disabled={status === "loading"} className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
              <PlusCircle size={20} /> {status === "loading" ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
