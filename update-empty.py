import os
import re

routes = [
    {"folder": "tenders", "typeLabel": "tenders"},
    {"folder": "admissions", "typeLabel": "admissions"},
    {"folder": "results", "typeLabel": "results"},
    {"folder": "admit-cards", "typeLabel": "admit cards"},
    {"folder": "scholarships", "typeLabel": "scholarships"}
]

empty_state_template = """          {(!{var_name} || {var_name}.length === 0) && (() => {
            const hasFilters = q || org || status !== "ALL";
            return (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {hasFilters ? "No {typeLabel} match these filters." : "No {typeLabel} available right now."}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {hasFilters ? "Try adjusting your filters or search terms." : "Check back later for new updates."}
                </p>
                {hasFilters && (
                  <Link href="/{folder}" className="inline-block px-6 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                    Clear All Filters
                  </Link>
                )}
              </div>
            );
          })()}"""

for r in routes:
    filepath = f"src/app/{r['folder']}/page.tsx"
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We need to find the old empty state
    # Usually looks like: {(!tenders || tenders.length === 0) && ( ... )}
    
    # Find var_name
    match = re.search(r"\{\(!(\w+) \|\| \1\.length === 0\)", content)
    if not match:
        continue
    
    var_name = match.group(1)
    
    new_empty = empty_state_template.replace("{var_name}", var_name).replace("{typeLabel}", r['typeLabel']).replace("{folder}", r['folder'])
    
    # Regex to replace old block
    # Start: {(!var_name || var_name.length === 0) && (
    # End: )}
    # Note: because it's a JSX block, simple regex might fail if there are nested parenthesis.
    # Let's do a basic string split based on known structure.
    
    start_str = f"{{(!{var_name} || {var_name}.length === 0) && ("
    start_idx = content.find(start_str)
    
    if start_idx != -1:
        end_str = ")}\n"
        end_idx = content.find(end_str, start_idx)
        if end_idx != -1:
            # Check if there is another )} near by
            real_end = end_idx + len(end_str)
            content = content[:start_idx] + new_empty + content[real_end:]
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated empty state in {r['folder']}")

