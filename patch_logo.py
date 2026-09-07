file_path = "src/app/layout.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()

old_logo = """<img src="/logo.png?v=5" alt="AssamJobs Hub Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180" />"""

new_logo = """
                      {/* Full Logo for Desktop */}
                      <img src="/logo.png?v=5" alt="AssamJobs Hub Logo" className="hidden md:block h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180" />
                      {/* Compact Logo for Mobile */}
                      <img src="/icon-192.png" alt="AssamJobs Hub Compact Logo" className="block md:hidden h-10 w-auto object-contain drop-shadow-sm rounded-lg" />
"""

content = content.replace(old_logo, new_logo)
with open(file_path, "w", encoding="utf-8") as f: f.write(content)
print("Updated logo variants")
