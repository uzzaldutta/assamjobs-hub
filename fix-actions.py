import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the merge logic to upgrade verification status
replacement = """
       const updates: any = {};
       
       // Upgrade verification if merging an official source
       if (sourceMeta?.is_official) {
         updates.verification_status = 'VERIFIED';
         updates.official_source_url = payload.sourceUrl;
       }

       if (item.change_diff && item.change_diff.length > 0) {
         item.change_diff.forEach((diff: any) => {
           updates[diff.field] = diff.new_value;
         });
       }
       
       if (Object.keys(updates).length > 0) {
         await supabase.from('jobs').update(updates).eq('id', targetId);
       }
"""

content = re.sub(
    r'if\s*\(item\.change_diff\s*&&\s*item\.change_diff\.length\s*>\s*0\)\s*\{[\s\S]*?await\s*supabase\.from\(\'jobs\'\)\.update\(updates\)\.eq\(\'id\',\s*targetId\);\s*\}',
    replacement,
    content
)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
