import os

with open("src/app/search/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

page = page.replace('paginatedResults={paginatedResults}', 'paginatedData={paginatedResults}')

with open("src/app/search/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)
