import re

with open('src/app/tools/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Camera icon import
content = content.replace('Keyboard, Shield } from "lucide-react";', 'Keyboard, Shield, Camera } from "lucide-react";')

tool_insert = r'''{ name: "Passport Photo Maker", icon: <Camera className="text-pink-500" size={24} />, link: "/tools/photo-maker", color: "bg-pink-50 dark:bg-pink-900/30", border: "border-pink-200 dark:border-pink-800" },
      { name: "Typing Test"'''

content = content.replace('{ name: "Typing Test"', tool_insert)

with open('src/app/tools/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
