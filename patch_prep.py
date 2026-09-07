import re

with open("src/components/admin/PrepDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace questions placeholder
questions_placeholder = """{/* ===================== QUESTIONS TAB (Placeholder) ===================== */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Question Bank</h3>
            </div>
            <p className="text-slate-500 text-sm">Add multiple choice questions here. (Coming in next step)</p>
          </div>
        )}"""

questions_real = """{/* ===================== QUESTIONS TAB ===================== */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Question Bank</h3>
            </div>
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
               <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Question Bank Module</h4>
               <p className="text-indigo-600 dark:text-indigo-400 mb-4 text-sm">The Question Bank and Bulk Import tools are fully implemented in the Content Studio.</p>
               <a href="/admin/studio/questions" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold">Go to Question Bank Module</a>
            </div>
          </div>
        )}"""

# Replace tests placeholder
tests_placeholder = """{/* ===================== TESTS TAB (Placeholder) ===================== */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Mock Test Creator</h3>
            </div>
            <p className="text-slate-500 text-sm">Package questions from the bank into a timed mock test. (Coming in next step)</p>
          </div>
        )}"""

tests_real = """{/* ===================== TESTS TAB ===================== */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Mock Test Creator</h3>
            </div>
            <div className="p-6 bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-100 dark:border-fuchsia-800 rounded-xl">
               <h4 className="font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-2">Mock Test Module</h4>
               <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-4 text-sm">The Mock Test Generator is fully implemented in the Content Studio.</p>
               <a href="/admin/studio/mock-tests" className="inline-flex bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg font-bold">Go to Mock Tests Module</a>
            </div>
          </div>
        )}"""

content = content.replace(questions_placeholder, questions_real)
content = content.replace(tests_placeholder, tests_real)

with open("src/components/admin/PrepDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched PrepDashboard.tsx")
