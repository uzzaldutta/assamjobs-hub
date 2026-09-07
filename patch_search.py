file_path = "src/app/search/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_meta = """export const metadata = {
  title: "Search Jobs, Exams, Practice & Mocks | AssamJobs Hub",
  description: "Global unified search for AssamJobs Hub. Find government jobs, syllabus, practice questions, and mock tests instantly."
};"""

new_meta = """export const metadata = {
  title: "Search Jobs, Exams, Practice & Mocks | AssamJobs Hub",
  description: "Global unified search for AssamJobs Hub. Find government jobs, syllabus, practice questions, and mock tests instantly.",
  robots: {
    index: false,
    follow: true,
  }
};"""

if old_meta in content:
    content = content.replace(old_meta, new_meta)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added noindex to search page.")
