import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

drop_logic = """
      // Structure change and drop check
      if (lastRun && lastRun.items_discovered > 10) {
         if (itemsDiscovered === 0) {
             throw new Error("STRUCTURE_CHANGED: Unusual extraction drop detected. Previous run yielded records but current yielded 0.");
         }
         if (itemsDiscovered < (lastRun.items_discovered * 0.3)) {
             throw new Error("EXTRACTION_DROP_WARNING: Extraction suddenly dropped by over 70%.");
         }
      }
"""

content = re.sub(
    r'// Structure change check[\s\S]*?yielded 0\."\);\s*\}',
    drop_logic,
    content
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
