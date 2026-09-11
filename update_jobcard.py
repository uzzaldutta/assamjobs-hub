import os

path = "src/components/JobCard.tsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if "EligibilityCheckModal" not in content:
    # 1. Add Import
    import_statement = "import EligibilityCheckModal from './EligibilityCheckModal';\nimport { useState } from 'react';\n"
    content = content.replace('import { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";', 'import { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";\n' + import_statement)
    
    # 2. Add State inside JobCard
    state_code = "  const [showEligibility, setShowEligibility] = useState(false);\n\n  // Determine Deadline State"
    content = content.replace("  // Determine Deadline State", state_code)
    
    # 3. Add Button next to Save Button. 
    # Look for the bookmark button block.
    bookmark_btn = """<button 
            onClick={toggleSave}
            className={`p-2 rounded-full transition-colors ${saved ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'}`}
            title={saved ? "Remove from saved" : "Save job"}
          >
            <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${saved ? 'fill-current' : ''}`} />
          </button>"""
    
    eligibility_btn = bookmark_btn + """
          <button 
            onClick={() => setShowEligibility(true)}
            className="p-2 rounded-full transition-colors bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
            title="Am I Eligible?"
          >
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>"""
          
    content = content.replace(bookmark_btn, eligibility_btn)
    
    # 4. Add Modal at the end of the return statement
    modal_code = """      <EligibilityCheckModal 
        job={job}
        isOpen={showEligibility}
        onClose={() => setShowEligibility(false)}
      />
    </div>
  );
}"""
    content = content.replace("    </div>\n  );\n}", modal_code)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Updated JobCard.tsx")
else:
    print("Already updated.")
