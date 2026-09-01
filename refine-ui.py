import re

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# UI Refinement: Remove glassmorphism/gradients
content = content.replace('bg-indigo-50 dark:bg-indigo-900/30', 'bg-slate-100 dark:bg-slate-800')
content = content.replace('border-indigo-100 dark:border-indigo-800', 'border-slate-200 dark:border-slate-700')
content = content.replace('text-indigo-700 dark:text-indigo-300', 'text-slate-800 dark:text-slate-200')
content = content.replace('bg-indigo-600 text-white', 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900')

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ExamDashboardClient UI")
