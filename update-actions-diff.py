import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

safe_diff = """       if (item.change_diff && item.change_diff.length > 0) {
         item.change_diff.forEach((diff: any) => {
           // Field-Level Source Authority: Do NOT overwrite good existing data with nulls or empty values
           const isInvalidNew = diff.new_value === null || diff.new_value === undefined || diff.new_value === 'Unknown' || diff.new_value === '';
           if (!isInvalidNew) {
              updates[diff.field] = diff.new_value;
           }
         });
       }"""

content = re.sub(
    r'if \(item\.change_diff && item\.change_diff\.length > 0\) \{[\s\S]*?\}\s*\}',
    safe_diff + "\n",
    content
)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
