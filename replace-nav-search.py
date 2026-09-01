import os

with open("src/components/DesktopNav.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the search link with the autocomplete component
link_regex = r'\{\/\* Global Search \*\/\}\s*<Link href="\/search" className="[^"]+">\s*<Search size=\{16\} \/> Search\s*<\/Link>'
replacement = """
      {/* Global Search Autocomplete */}
      <SearchAutocomplete className="w-64" />
"""

import re
content = re.sub(link_regex, replacement, content)

# Need to import it
import_stmt = 'import SearchAutocomplete from "./SearchAutocomplete";\n'
content = content.replace('import { useLanguage }', import_stmt + 'import { useLanguage }')

with open("src/components/DesktopNav.tsx", "w", encoding="utf-8") as f:
    f.write(content)
