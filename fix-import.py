import re

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'import { ChevronDown, ChevronRight, BookOpen, Activity, FileText, Lock, PlayCircle, Layers } from "lucide-react";',
    'import { ChevronDown, ChevronRight, ChevronLeft, BookOpen, Activity, FileText, Lock, PlayCircle, Layers } from "lucide-react";'
)

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed import")
