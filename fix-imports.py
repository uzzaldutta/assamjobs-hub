with open('src/components/MobileBottomNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken imports
content = content.replace('import { Calendar, usePathname } from "next/navigation";', 'import { usePathname } from "next/navigation";')
content = content.replace('import { Calendar, Home,', 'import { Calendar, Home,') # This one should actually have Calendar from lucide-react!
content = content.replace('import { Calendar, useLanguage } from "./LanguageContext";', 'import { useLanguage } from "./LanguageContext";')
content = content.replace('import { Calendar, useState } from "react";', 'import { useState } from "react";')

with open('src/components/MobileBottomNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed MobileBottomNav imports")
