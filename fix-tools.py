import re

with open('src/app/tools/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Keyboard } from "lucide-react";', 'Keyboard, Shield } from "lucide-react";')

tool_insert = '{ name: "Am I Eligible?", icon: <Shield className="text-emerald-500" size={24} />, link: "/tools/eligibility-checker", color: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800" },\n      { name: "Career Advisor"'

content = content.replace('{ name: "Career Advisor"', tool_insert)

with open('src/app/tools/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
