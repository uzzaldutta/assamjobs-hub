import re

with open('src/app/study-materials/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the overlapping button (-mt-16 to mt-4)
content = content.replace('<div className="flex justify-center -mt-16 mb-8 relative z-20">', '<div className="flex justify-center mt-4 mb-8 relative z-20">')

# 2. Rename AI Generated Guides
content = content.replace('AI Generated Guides', 'Interactive Study Library')
content = content.replace('No AI study materials generated yet.', 'No interactive study books found. Use the Admin Panel to add some!')

# 3. Add custom CSS to hide scrollbar more effectively if scrollbar-hide isn't working
hide_css = r'''<style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="mb-8 overflow-x-auto pb-2 hide-scrollbar">'''
content = content.replace('<div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">', hide_css)

with open('src/app/study-materials/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("UI Fixed")
