with open("src/components/FeedList.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make pagination buttons larger for mobile touch targets (w-10 h-10 or px-4 py-2 instead of tiny w-8 h-8)
content = content.replace('w-8 h-8', 'w-10 h-10')
content = content.replace('text-sm', 'text-base') # to prevent iOS zoom on inputs, also improves readability

with open("src/components/FeedList.tsx", "w", encoding="utf-8") as f:
    f.write(content)
