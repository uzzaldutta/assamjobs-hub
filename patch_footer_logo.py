file_path = "src/components/Footer.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()

old_footer_logo = """<Link href="/" className="font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-4">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">AJ</span>
            AssamJobs
          </Link>"""

new_footer_logo = """<Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
            <img src="/logo.png?v=5" alt="AssamJobs Hub Logo" className="h-12 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180" />
          </Link>"""

content = content.replace(old_footer_logo, new_footer_logo)
with open(file_path, "w", encoding="utf-8") as f: f.write(content)
print("Updated footer logo")
