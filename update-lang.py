with open('src/components/LanguageContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'nav_calendar:\s*"Calendar"', 'nav_calendar: "Job Calendar"', content)

with open('src/components/LanguageContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LanguageContext.tsx")
