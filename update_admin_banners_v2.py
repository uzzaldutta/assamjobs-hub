import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Update banner form data initial state
old_form_state = 'setBannerFormData({ headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0'
new_form_state = 'setBannerFormData({ headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0, badge_text: "", badge_color: "indigo", secondary_cta_text: "", secondary_cta_link: "", image_url: ""'
content = content.replace(old_form_state, new_form_state)

old_form_state2 = 'bannerFormData: { headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0'
new_form_state2 = 'bannerFormData: { headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0, badge_text: "", badge_color: "indigo", secondary_cta_text: "", secondary_cta_link: "", image_url: ""'
content = content.replace(old_form_state2, new_form_state2)

# Find the useState definition
old_use_state = 'const [bannerFormData, setBannerFormData] = useState({\n    headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0\n  });'
new_use_state = 'const [bannerFormData, setBannerFormData] = useState({\n    headline: "", subtext: "", cta_text: "", cta_link: "", gradient_from: "from-blue-600", gradient_to: "to-indigo-500", order_index: 0,\n    badge_text: "", badge_color: "indigo", secondary_cta_text: "", secondary_cta_link: "", image_url: ""\n  });'
content = content.replace(old_use_state, new_use_state)

# Add form inputs
inputs_to_add = """
                <input placeholder="Badge Text (Optional)" value={bannerFormData.badge_text || ""} onChange={e => setBannerFormData({...bannerFormData, badge_text: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Badge Color (e.g. red, emerald, indigo)" value={bannerFormData.badge_color || ""} onChange={e => setBannerFormData({...bannerFormData, badge_color: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Secondary Button Text (Optional)" value={bannerFormData.secondary_cta_text || ""} onChange={e => setBannerFormData({...bannerFormData, secondary_cta_text: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Secondary Button Link (Optional)" value={bannerFormData.secondary_cta_link || ""} onChange={e => setBannerFormData({...bannerFormData, secondary_cta_link: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full" />
                <input placeholder="Image URL (Optional)" value={bannerFormData.image_url || ""} onChange={e => setBannerFormData({...bannerFormData, image_url: e.target.value})} className="p-3 border rounded-xl dark:bg-slate-950 dark:border-slate-700 w-full md:col-span-2" />
"""

# Insert inputs right before the submit button container
content = content.replace('<div className="flex items-center gap-4">', inputs_to_add + '\n                <div className="flex items-center gap-4 md:col-span-2">')
content = content.replace('<div className="flex items-center gap-4 md:col-span-2 md:col-span-2">', '<div className="flex items-center gap-4 md:col-span-2">') # just in case of double replace

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated Admin page")
