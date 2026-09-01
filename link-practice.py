import re

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the locked Practice button with a real Link
old_btn = """
                                                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-800 dark:text-slate-500 dark:group-hover:text-slate-200 bg-slate-100 dark:bg-slate-900 px-2 py-1.5 rounded-md transition-colors">
                                                  <Lock size={12} /> Practice
                                                </button>
"""
# Wait, my previous regex/replace removed gradients, so let's check the exact string
old_btn_regex = r'<button className="[^"]*">\s*<Lock size=\{12\} /> Practice\s*</button>'
new_btn = """
                                                <Link href={`/practice/${topic.id}`} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-md transition-all">
                                                  <PlayCircle size={14} /> Practice
                                                </Link>
"""

content = re.sub(old_btn_regex, new_btn.strip(), content)

# Remove the 'group-hover' text color change on the topic title, it's not needed if the button itself is clear
# But it's fine to leave it. Let's make sure the replacement worked.

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Linked Practice button")
