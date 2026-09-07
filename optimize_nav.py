import re

with open("src/components/DesktopNav.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove SearchAutocomplete import
content = re.sub(r'import SearchAutocomplete from "./SearchAutocomplete";\n', '', content)

# Remove SearchAutocomplete component
content = re.sub(r'\{/\* Global Search Autocomplete \*/\}\s*<SearchAutocomplete className="w-64" />\s*', '', content)

# Reduce padding and gap
content = content.replace('lg:gap-3', 'xl:gap-2 gap-1')
content = content.replace('px-3', 'px-2')

# Let's wrap Tenders, Updates, Tools into a "More" Dropdown to save space
# Actually, just reducing the padding and removing the 256px search bar will solve 90% of the issue.

with open("src/components/DesktopNav.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("DesktopNav optimized")
