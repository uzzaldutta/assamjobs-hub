import os

with open("src/app/search/SearchClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the component signature destructuring
content = content.replace('export default function SearchClient({ initialQuery, initialType, results }: { initialQuery: string; initialType: string; paginatedData: PaginatedSearchResult })', 'export default function SearchClient({ initialQuery, initialType, paginatedData }: { initialQuery: string; initialType: string; paginatedData: PaginatedSearchResult })')

with open("src/app/search/SearchClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
