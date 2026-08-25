import os

files_to_update = [
    r"src\app\admissions\page.tsx",
    r"src\app\admit-cards\page.tsx",
    r"src\app\results\page.tsx",
    r"src\app\study-materials\page.tsx",
    r"src\app\tenders\page.tsx",
    r"src\app\page.tsx"
]

for file_path in files_to_update:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the slices inside the RecentMarquee component call
    content = content.replace('.slice(0, 15)', '')
    content = content.replace('.slice(0, 8)', '')
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Removed slices from RecentMarquee props")
