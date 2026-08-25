import re

with open('src/components/FeedList.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

banner_jsx = """
        {/* Global Safety Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Safety & Fraud Alert</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
              AssamJobs Hub never asks for money to provide jobs. Be cautious of fraudulent calls or emails demanding payment for recruitment. Verify official notifications before applying.
            </p>
          </div>
        </div>
"""

# Insert it before the "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" which renders the cards
insertion_point = content.find('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">')

content = content[:insertion_point] + banner_jsx + content[insertion_point:]

with open('src/components/FeedList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
