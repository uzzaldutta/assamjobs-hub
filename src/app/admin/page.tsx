"use client";

import { useState, useEffect } from "react";
import { Shield, PlusCircle, CheckCircle2, AlertCircle, Lock, Edit, Trash2, List, Image, X } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"manage" | "create" | "banners" | "sync" | "spam">("manage");
  const [bannedKeywords, setBannedKeywords] = useState<any[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [spamStatus, setSpamStatus] = useState("");

  // CMS State
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  
  // Banner Form State
  const [bannerFormData, setBannerFormData] = useState({
    headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0,
    badge_text: "", badge_color: "indigo", secondary_cta_text: "", secondary_cta_link: "", image_url: ""
  });

  const fetchBanners = async () => {
    setIsLoadingBanners(true);
    try {
      const { data } = await supabase.from("hero_banners").select("*").order("order_index", { ascending: true });
      if (data) setBanners(data);
    } catch (e) { console.error(e); }
    setIsLoadingBanners(false);
  };

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
        fetchJobs();
        fetchBanners();
        fetchBannedKeywords();
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
        .neq('category', 'BANNED_KEYWORD')
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

  const handleCleanDuplicates = async () => {
    if (!confirm("Are you sure you want to run the smart dedup cleaner? This will permanently delete duplicate entries from the database.")) return;
    
    try {
      const res = await fetch("/api/admin/clean-duplicates", {
        method: "GET"
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert(data.message);
        fetchJobs();
      } else {
        alert("Failed to clean duplicates: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("An error occurred while cleaning duplicates.");
    }
  };

  const handleCleanupOld = async () => {
    try {
      const res = await fetch(`/api/admin/cleanup-old?token=${password}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert(data.message);
        fetchJobs();
      } else {
        alert("Failed to clean old jobs: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("An error occurred while cleaning old jobs.");
    }
  };

  const fetchBannedKeywords = async () => {
    try {
      const res = await fetch("/api/admin/spam-control");
      const data = await res.json();
      if (res.ok) setBannedKeywords(data.keywords || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchBannedKeywords();
  }, [isAuthenticated]);

  const handleBlockKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpamStatus("loading");
    try {
      const res = await fetch("/api/admin/spam-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: newKeyword, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSpamStatus(`Success! Blocked "${newKeyword}" and deleted ${data.deletedCount} spam posts.`);
        setNewKeyword("");
        fetchBannedKeywords();
        fetchJobs();
      } else {
        setSpamStatus("Error: " + data.error);
      }
    } catch (error) {
      setSpamStatus("Error connecting to server.");
    }
    setTimeout(() => setSpamStatus(""), 5000);
  };

  const handleDeleteKeyword = async (id: string) => {
    if (!confirm("Remove this keyword from the blocklist?")) return;
    try {
      await fetch(`/api/admin/spam-control?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${password}` }
      });
      fetchBannedKeywords();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : "/api/admin/banners";
      const method = editingBanner ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(bannerFormData)
      });
      
      if (!res.ok) throw new Error("Failed");
      
      setStatus("success");
      setEditingBanner(null);
      setBannerFormData({ headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0, badge_text: "", badge_color: "indigo", secondary_cta_text: "", secondary_cta_link: "", image_url: "" });
      fetchBanners();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${password}` }
      });
      fetchBanners();
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      let finalPdfUrl = formData.official_pdf_url;

      // Handle PDF Upload to Supabase Storage
      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('pdfs')
          .upload(`study-materials/${fileName}`, pdfFile);
          
        if (error) {
          alert(`Failed to upload PDF: ${error.message}. Please create a public bucket named 'pdfs' in your Supabase dashboard first!`);
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage.from('pdfs').getPublicUrl(`study-materials/${fileName}`);
        finalPdfUrl = publicUrl;
      }

      const payload = { ...formData, official_pdf_url: finalPdfUrl };

      const res = await fetch("/api/admin/add-job", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add job");

      setStatus("success");
      setFormData({
        title: "", organization: "", job_type: formData.job_type, category: formData.category,
        vacancies: "", qualification: "", district: "All Assam", age_limit: "",
        application_fee: "None", selection_process: "", last_date: "",
        official_pdf_url: "", apply_url: "", unique_description: "", unique_description_assamese: ""
      });
      setPdfFile(null);
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
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Lock size={24} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Admin Hub</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
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
        <div className="flex gap-2 mb-6 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-full max-w-2xl flex-wrap">
          <button onClick={() => setActiveTab("manage")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "manage" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <List size={16} /> Manage Feeds
          </button>
          <button onClick={() => setActiveTab("create")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "create" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <PlusCircle size={16} /> Create Post
          </button>
          <button onClick={() => setActiveTab("banners")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "banners" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <Image size={16} /> Banners
          </button>
          <button onClick={() => setActiveTab("sync")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "sync" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <Shield size={16} /> Feed Sync
          </button>
          <button onClick={() => setActiveTab("spam")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "spam" ? "bg-white dark:bg-slate-700 shadow text-red-600 dark:text-red-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <AlertCircle size={16} /> Spam Control
          </button>
        </div>

        
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-bold mb-4">{editingBanner ? "Edit Banner" : "Add New Banner"}</h2>
              <form onSubmit={handleBannerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Headline" value={bannerFormData.headline} onChange={e => setBannerFormData({...bannerFormData, headline: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input required placeholder="Subtext" value={bannerFormData.subtext} onChange={e => setBannerFormData({...bannerFormData, subtext: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input required placeholder="Button Text" value={bannerFormData.cta_text} onChange={e => setBannerFormData({...bannerFormData, cta_text: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input required placeholder="Button Link" value={bannerFormData.cta_link} onChange={e => setBannerFormData({...bannerFormData, cta_link: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input required placeholder="Gradient From (e.g. from-blue-600)" value={bannerFormData.gradient_from} onChange={e => setBannerFormData({...bannerFormData, gradient_from: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input required placeholder="Gradient To (e.g. to-indigo-500)" value={bannerFormData.gradient_to} onChange={e => setBannerFormData({...bannerFormData, gradient_to: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input type="number" required placeholder="Order Index" value={bannerFormData.order_index} onChange={e => setBannerFormData({...bannerFormData, order_index: parseInt(e.target.value)})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                
                <input placeholder="Badge Text (Optional)" value={bannerFormData.badge_text || ""} onChange={e => setBannerFormData({...bannerFormData, badge_text: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Badge Color (e.g. red, emerald, indigo)" value={bannerFormData.badge_color || ""} onChange={e => setBannerFormData({...bannerFormData, badge_color: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Secondary Button Text (Optional)" value={bannerFormData.secondary_cta_text || ""} onChange={e => setBannerFormData({...bannerFormData, secondary_cta_text: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Secondary Button Link (Optional)" value={bannerFormData.secondary_cta_link || ""} onChange={e => setBannerFormData({...bannerFormData, secondary_cta_link: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Image URL (Optional)" value={bannerFormData.image_url || ""} onChange={e => setBannerFormData({...bannerFormData, image_url: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full md:col-span-2" />

                <div className="flex items-center gap-4 md:col-span-2">
                  <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl w-full">
                    {status === "loading" ? "Saving..." : (editingBanner ? "Update Banner" : "Create Banner")}
                  </button>
                  {editingBanner && (
                    <button type="button" onClick={() => { setEditingBanner(null); setBannerFormData({ headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0, badge_text: "", badge_color: "indigo", secondary_cta_text: "", secondary_cta_link: "", image_url: "" }); }} className="text-slate-500 font-bold">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-6">
              <h2 className="text-xl font-bold mb-4">Active Banners</h2>
              <div className="grid grid-cols-1 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <div>
                      <h3 className="font-bold">{b.headline}</h3>
                      <p className="text-sm text-slate-500">{b.subtext}</p>
                      <div className="text-xs mt-2 flex gap-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Order: {b.order_index}</span>
                        <span className={`bg-gradient-to-r ${b.gradient_from} ${b.gradient_to} text-white px-2 py-1 rounded`}>Colors</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingBanner(b); setBannerFormData(b); }} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteBanner(b.id)} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {activeTab === "manage" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">All Database Entries</h3>
              <div className="flex gap-4">
                <button onClick={handleCleanupOld} className="text-sm text-amber-600 font-medium hover:underline flex items-center gap-1"><Trash2 size={14}/> Clean Old Jobs</button>
                <button onClick={handleCleanDuplicates} className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"><Trash2 size={14}/> Clean Duplicates</button>
                <button onClick={fetchJobs} className="text-sm text-indigo-600 font-medium hover:underline">Refresh</button>
              </div>
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
            <div className="md:col-span-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Shield size={18} />
                </div>
                <h3 className="font-bold text-lg">AI Auto-Fill from URL</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Paste a link to a job posting, or paste the raw text if the website blocks scrapers. The AI will instantly fill out this form for you.</p>
              
              {/* URL Input */}
              <div className="flex gap-3 mb-3">
                <input 
                  type="url" 
                  id="autoFillUrl"
                  placeholder="https://example.com/job-post" 
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-xl"
                />
                <button 
                  type="button"
                  id="autoFillBtn"
                  onClick={async () => {
                    const urlInput = document.getElementById('autoFillUrl') as HTMLInputElement;
                    const btn = document.getElementById('autoFillBtn') as HTMLButtonElement;
                    if (!urlInput.value) return alert("Please enter a URL first.");
                    
                    btn.disabled = true;
                    btn.innerHTML = "Processing...";
                    
                    try {
                      const res = await fetch("/api/admin/fetch-url", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
                        body: JSON.stringify({ url: urlInput.value })
                      });
                      
                      const json = await res.json();
                      if (res.ok && json.success) {
                        setFormData({
                          ...formData,
                          title: json.data.title || "",
                          organization: json.data.organization || "",
                          job_type: json.data.job_type || formData.job_type,
                          category: json.data.category || formData.category,
                          vacancies: json.data.vacancies || "",
                          district: json.data.district || "",
                          age_limit: json.data.ageLimit || "",
                          qualification: json.data.qualification || "",
                          unique_description: json.data.unique_description || formData.unique_description,
                          unique_description_assamese: json.data.unique_description_assamese || formData.unique_description_assamese,
                          apply_url: urlInput.value
                        });
                        alert("Successfully auto-filled from URL!");
                      } else {
                        alert("Failed: " + (json.error || "Unknown error"));
                      }
                    } catch (error) {
                      alert("Network error connecting to AI.");
                    }
                    
                    btn.disabled = false;
                    btn.innerHTML = "Auto-Fill URL";
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition whitespace-nowrap"
                >
                  Auto-Fill URL
                </button>
              </div>

              {/* Raw Text Input */}
              <div className="flex gap-3">
                <textarea 
                  id="autoFillText"
                  placeholder="Or paste the website's raw text here if the URL is blocked..." 
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-xl h-14 resize-y"
                />
                <button 
                  type="button"
                  id="autoFillTextBtn"
                  onClick={async () => {
                    const textInput = document.getElementById('autoFillText') as HTMLTextAreaElement;
                    const btn = document.getElementById('autoFillTextBtn') as HTMLButtonElement;
                    if (!textInput.value) return alert("Please paste some text first.");
                    
                    btn.disabled = true;
                    btn.innerHTML = "Processing...";
                    
                    try {
                      const res = await fetch("/api/admin/fetch-url", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
                        body: JSON.stringify({ text: textInput.value })
                      });
                      
                      const json = await res.json();
                      if (res.ok && json.success) {
                        setFormData({
                          ...formData,
                          title: json.data.title || "",
                          organization: json.data.organization || "",
                          job_type: json.data.job_type || formData.job_type,
                          category: json.data.category || formData.category,
                          vacancies: json.data.vacancies || "",
                          district: json.data.district || "",
                          age_limit: json.data.ageLimit || "",
                          qualification: json.data.qualification || "",
                          unique_description: json.data.unique_description || formData.unique_description,
                          unique_description_assamese: json.data.unique_description_assamese || formData.unique_description_assamese,
                        });
                        alert("Successfully auto-filled from Text!");
                      } else {
                        alert("Failed: " + (json.error || "Unknown error"));
                      }
                    } catch (error) {
                      alert("Network error connecting to AI.");
                    }
                    
                    btn.disabled = false;
                    btn.innerHTML = "Auto-Fill Text";
                  }}
                  className="px-6 py-3 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 text-indigo-700 dark:text-indigo-400 font-bold rounded-xl transition whitespace-nowrap border border-indigo-200 dark:border-indigo-800"
                >
                  Auto-Fill Text
                </button>
              </div>
            </div>

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
                  <option value="TENDER">Tender</option>
                  <option value="ADMISSION">Admission</option>
                  <option value="STUDY_MATERIAL">Study Material (PDF)</option>
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
                <label className="text-sm font-semibold">Upload PDF (Overrides URL below)</label>
                <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">OR Paste PDF Link</label>
                <input type="url" name="official_pdf_url" value={formData.official_pdf_url} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Category / Subject</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <option value="ASSAM_STATE">Assam State</option>
                  <option value="CENTRAL_GOVT">Central Govt</option>
                  <option value="SYLLABUS">Syllabus</option>
                  <option value="PREVIOUS_PAPERS">Previous Year Papers</option>
                  <option value="NOTES">Study Notes & Books</option>
                  <option value="CURRENT_AFFAIRS">Current Affairs & GK</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold flex justify-between">
                  <span>Markdown Description (English)</span>
                  <span className="text-xs text-indigo-500">Supports Markdown</span>
                </label>
                <ReactQuill 
                  theme="snow"
                  value={formData.unique_description} 
                  onChange={(val) => setFormData({ ...formData, unique_description: val })}
                  className="bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden"
                  style={{ height: '300px', marginBottom: '40px' }}
                />
              </div>
            </div>

            <button type="submit" disabled={status === "loading"} className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
              <PlusCircle size={20} /> {status === "loading" ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        )}

        {activeTab === "sync" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center max-w-2xl mx-auto">
              <Shield className="mx-auto text-indigo-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold mb-2">Manual Feed Sync</h2>
              <p className="text-slate-500 mb-8">Trigger background scrapers and API synchronizations to instantly pull in new jobs.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = "Syncing...";
                    try {
                      const res = await fetch("/api/jobs/scrape-nfr", {
                        headers: { "Authorization": `Bearer ${password}` }
                      });
                      const data = await res.json();
                      alert(data.message || "Scrape triggered");
                    } catch(err) {
                      alert("Error triggering scrape");
                    }
                    btn.disabled = false;
                    btn.innerHTML = "Run NFR Scraper";
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-4 px-6 rounded-xl transition"
                >
                  Run NFR Scraper
                </button>
                
                <button 
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = "Syncing...";
                    try {
                      const res = await fetch("/api/jobs/sync", {
                        headers: { "Authorization": `Bearer ${password}` }
                      });
                      const data = await res.json();
                      alert(data.message || data.error || "Sync complete");
                    } catch(err) {
                      alert("Error triggering sync");
                    }
                    btn.disabled = false;
                    btn.innerHTML = "Sync Adzuna API";
                  }}
                  className="bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 text-indigo-700 dark:text-indigo-400 font-bold py-4 px-6 rounded-xl transition border border-indigo-200 dark:border-indigo-800"
                >
                  Sync Adzuna API
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "spam" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Spam Control & Blocklist</h2>
                  <p className="text-slate-500 text-sm">Add keywords to block scrapers from adding them, and instantly delete existing ones.</p>
                </div>
              </div>

              <form onSubmit={handleBlockKeyword} className="flex gap-4 mb-8">
                <input
                  type="text"
                  required
                  placeholder="e.g. JobAssam, combiner tool..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-xl"
                />
                <button
                  type="submit"
                  disabled={spamStatus === "loading"}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition"
                >
                  {spamStatus === "loading" ? "Processing..." : "Block & Purge"}
                </button>
              </form>

              {spamStatus && spamStatus !== "loading" && (
                <div className="mb-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold">
                  {spamStatus}
                </div>
              )}

              <h3 className="font-bold mb-4">Currently Blocked Keywords</h3>
              <div className="flex flex-wrap gap-3">
                {bannedKeywords.length === 0 && <span className="text-slate-500 text-sm">No blocked keywords.</span>}
                {bannedKeywords.map((kw) => (
                  <div key={kw.id} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                    <span className="font-mono text-sm">{kw.title}</span>
                    <button
                      onClick={() => handleDeleteKeyword(kw.id)}
                      className="text-slate-400 hover:text-red-500 transition ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
