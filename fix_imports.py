import re

with open("src/app/admin/studio/ingestion/queue/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure imports exist
if 'import { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher"' not in content:
    content = 'import { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";\n' + content

if 'FileText' not in content.split('lucide-react')[0]: # Just blindly add it to lucide-react
    content = content.replace('import { ShieldCheck, ShieldAlert, FileSearch, CheckCircle, XCircle, Search } from "lucide-react";', 'import { ShieldCheck, ShieldAlert, FileSearch, CheckCircle, XCircle, Search, FileText } from "lucide-react";')
    # Or just replace the whole line if it's slightly different
    content = re.sub(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];', lambda m: f'import {{{m.group(1)}{", FileText" if "FileText" not in m.group(1) else ""}}} from "lucide-react";', content)

with open("src/app/admin/studio/ingestion/queue/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed imports in queue/page.tsx")
