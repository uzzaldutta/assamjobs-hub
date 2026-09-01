import re

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "useExamHistory" not in content:
    content = content.replace(
        'import Link from "next/link";',
        'import Link from "next/link";\nimport { useExamHistory } from "@/hooks/useExamHistory";'
    )

# Replace local storage logic
old_effect = """
  // Local-First Memory: Save to recently viewed
  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentExams") || "[]");
      const filtered = recent.filter((e: any) => e.id !== exam.id);
      filtered.unshift({ id: exam.id, title: exam.title, slug: exam.slug, viewedAt: new Date().toISOString() });
      localStorage.setItem("recentExams", JSON.stringify(filtered.slice(0, 5)));
    } catch (e) {}
  }, [exam]);
"""

new_effect = """
  const { addExam } = useExamHistory();
  useEffect(() => {
    if (exam) {
      addExam({ id: exam.id, title: exam.title, slug: exam.slug });
    }
  }, [exam]); // intentionally omitting addExam to avoid loop, or just trust stable ref
"""

content = content.replace(old_effect.strip(), new_effect.strip())

with open("src/app/exam/[slug]/ExamDashboardClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ExamDashboardClient hook usage")
