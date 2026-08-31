with open('src/components/DesktopNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We will replace the plain buttons with glassmorphic pills
# Example: hover:text-emerald-600 -> hover:bg-emerald-500/10 hover:text-emerald-600 ...

def stylize_link(match):
    text = match.group(0)
    # Add glassmorphic base classes
    text = text.replace('py-4', 'px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent')
    text = text.replace('hover:text-emerald-600', 'hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600')
    return text

content = re.sub(r'className="flex items-center gap-1\.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors"', lambda m: stylize_link(m), content)

with open('src/components/DesktopNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated DesktopNav links")
