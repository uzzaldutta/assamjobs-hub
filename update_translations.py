import re
import codecs

with codecs.open('src/components/LanguageContext.tsx', 'r', 'utf-8') as f:
    content = f.read()

en_additions = """    nav_home: "Home",
    nav_tenders: "Tenders",
    nav_admits: "Admits",
    nav_results: "Results",
    nav_tools: "Tools",
    nav_study: "Study",
    nav_admissions: "Admissions",
    nav_mock_tests: "Mock Tests",
    nav_calendar: "Calendar",
    hero_title: "Accelerate your career in Assam",
    hero_subtitle: "Get instant updates on Govt & Private jobs, take free mock tests, and use AI tools.",
    hero_btn_mock: "Mock Tests",
    hero_btn_ai: "AI Tools",
    recent_jobs: "Recent Job Updates",
    active_tenders: "Active Tenders",
    recent_uploads: "Recent Uploads",
    all_india_admissions: "All-India & Assam Admissions",
"""

as_additions = """    nav_home: "হোম",
    nav_tenders: "টেণ্ডাৰ",
    nav_admits: "এডমিট",
    nav_results: "ফলাফল",
    nav_tools: "সঁজুলি",
    nav_study: "অধ্যয়ন",
    nav_admissions: "নামভৰ্তি",
    nav_mock_tests: "মক টেষ্ট",
    nav_calendar: "কেলেন্দাৰ",
    hero_title: "অসমত আপোনাৰ কেৰিয়াৰ ত্বৰান্বিত কৰক",
    hero_subtitle: "চৰকাৰী আৰু ব্যক্তিগত চাকৰিৰ তৎক্ষণাৎ আপডেট পাওক, বিনামূলীয়া মক টেষ্ট দিয়ক আৰু AI সঁজুলি ব্যৱহাৰ কৰক।",
    hero_btn_mock: "মক টেষ্ট",
    hero_btn_ai: "AI সঁজুলি",
    recent_jobs: "শেহতীয়া চাকৰিৰ আপডেট",
    active_tenders: "সক্ৰিয় টেণ্ডাৰ",
    recent_uploads: "শেহতীয়া আপল'ড",
    all_india_admissions: "সৰ্বভাৰতীয় আৰু অসমৰ নামভৰ্তি",
"""

content = content.replace('en: {\n', f'en: {{\n{en_additions}')
content = content.replace('as: {\n', f'as: {{\n{as_additions}')

with codecs.open('src/components/LanguageContext.tsx', 'w', 'utf-8') as f:
    f.write(content)

print("Translations updated successfully.")
