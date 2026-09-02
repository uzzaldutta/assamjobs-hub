with open("src/app/admin/studio/actions.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
supabase_import_count = 0

for line in lines:
    if 'import { supabase } from "@/lib/supabase";' in line:
        if supabase_import_count == 0:
            new_lines.append(line)
            supabase_import_count += 1
    else:
        new_lines.append(line)

with open("src/app/admin/studio/actions.ts", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
