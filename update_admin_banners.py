import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Image icon if missing
if "Image" not in content[:500]:
    content = content.replace('Trash2, List } from "lucide-react";', 'Trash2, List, Image } from "lucide-react";')

# Update activeTab state
content = content.replace('useState<"manage" | "create">("manage")', 'useState<"manage" | "create" | "banners">("manage")')

# Add Banners state
state_injection = """
  // CMS State
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  
  // Banner Form State
  const [bannerFormData, setBannerFormData] = useState({
    headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0
  });

  const fetchBanners = async () => {
    setIsLoadingBanners(true);
    try {
      const { data } = await supabase.from("hero_banners").select("*").order("order_index", { ascending: true });
      if (data) setBanners(data);
    } catch (e) { console.error(e); }
    setIsLoadingBanners(false);
  };
"""
content = content.replace("  // CMS State\n  const [jobs, setJobs] = useState<any[]>([]);", state_injection + "\n  const [jobs, setJobs] = useState<any[]>([]);")

# Add fetchBanners to verifyToken
content = content.replace("fetchJobs(); // Fetch CMS data", "fetchJobs();\n        fetchBanners();")

# Add Banner Handlers
handlers_injection = """
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
      setBannerFormData({ headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0 });
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
"""
content = content.replace("  const handleJobSubmit = async (e: React.FormEvent) => {", handlers_injection + "\n  const handleJobSubmit = async (e: React.FormEvent) => {")

# Add Tab Button
tab_button = """          <button onClick={() => setActiveTab("banners")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "banners" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <Image size={16} /> Banners
          </button>
        </div>"""
content = content.replace('        </div>\n\n        {activeTab === "manage" && (', tab_button + '\n\n        {activeTab === "manage" && (')

# Add Banners UI
banners_ui = """
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
                <div className="flex items-center gap-4">
                  <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl w-full">
                    {status === "loading" ? "Saving..." : (editingBanner ? "Update Banner" : "Create Banner")}
                  </button>
                  {editingBanner && (
                    <button type="button" onClick={() => { setEditingBanner(null); setBannerFormData({ headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0 }); }} className="text-slate-500 font-bold">Cancel</button>
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
"""
content = content.replace('{activeTab === "manage" && (', banners_ui + '\n\n        {activeTab === "manage" && (')

# Make the tab buttons wider in the wrapper
content = content.replace('max-w-md', 'max-w-xl')

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Admin page rewritten successfully!")
