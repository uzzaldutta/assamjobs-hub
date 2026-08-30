with open('src/components/MobileMenu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_study = """                    <Link onClick={() => setIsOpen(false)} href="/study-materials" className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl font-medium text-sm text-fuchsia-700 dark:text-fuchsia-400">Study Materials (PDF)</Link>"""
new_study = """                    <Link onClick={() => setIsOpen(false)} href="/study-materials" className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl font-medium text-sm text-fuchsia-700 dark:text-fuchsia-400">Interactive Study Books</Link>
                    <Link onClick={() => setIsOpen(false)} href="/previous-papers" className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl font-medium text-sm text-teal-700 dark:text-teal-400">Previous Year Papers</Link>
                    <Link onClick={() => setIsOpen(false)} href="/mock-tests" className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl font-medium text-sm text-orange-700 dark:text-orange-400">AI Mock Tests</Link>"""

content = content.replace(old_study, new_study)

with open('src/components/MobileMenu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MobileMenu")
