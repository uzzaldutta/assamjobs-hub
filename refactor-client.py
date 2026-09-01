import os

with open("src/app/search/SearchClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace item_id with id, item_type with type
content = content.replace("item.item_id", "item.id")
content = content.replace("item.item_type", "item.type")
content = content.replace("r.item_type", "r.type")
content = content.replace("any[]", "any[]") # I'll just use any for now or import SearchResultItem

# Let's add the import
import_stmt = 'import { SearchResultItem } from "@/lib/search/searchTypes";\n'
content = content.replace('import Link from "next/link";', 'import Link from "next/link";\n' + import_stmt)
content = content.replace('results: any[]', 'results: SearchResultItem[]')
content = content.replace('item: any', 'item: SearchResultItem')

with open("src/app/search/SearchClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
