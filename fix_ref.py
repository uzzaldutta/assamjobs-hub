import re
with open("src/components/LatestUpdatesScroller.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("useRef<number>()", "useRef<number | undefined>(undefined)")

with open("src/components/LatestUpdatesScroller.tsx", "w", encoding="utf-8") as f:
    f.write(content)
