file_path = "src/app/search/DiscoveryLanding.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()

old_link = """<Link href="/tests" className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group opacity-50 cursor-not-allowed" title="Coming Soon">"""
new_link = """<Link href="/mock-tests" className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group">"""

content = content.replace(old_link, new_link)

# Also fix the practice link to point to /practice if it exists? Wait, /practice route is dynamic `/practice/[topicId]`. There's no `/practice` listing page?
# Let's check if `/practice` exists.
with open(file_path, "w", encoding="utf-8") as f: f.write(content)
print("Fixed Mock Tests link")
