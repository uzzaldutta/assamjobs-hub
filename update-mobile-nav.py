import re

with open("src/components/MobileBottomNav.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('href="/mock-tests"', 'href="/search"')
content = content.replace('pathname.includes("/mock-tests")', 'pathname.includes("/search")')
content = content.replace('BookCheck', 'Search')
content = content.replace('t("nav_mock")', '"Search"')

with open("src/components/MobileBottomNav.tsx", "w", encoding="utf-8") as f:
    f.write(content)
