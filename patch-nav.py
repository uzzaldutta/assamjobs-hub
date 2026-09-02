with open("src/components/MobileBottomNav.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900',
    'className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800'
)

with open("src/components/MobileBottomNav.tsx", "w", encoding="utf-8") as f:
    f.write(content)
