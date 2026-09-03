with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# let's just inspect the last 15 lines
print("".join(lines[-15:]))
