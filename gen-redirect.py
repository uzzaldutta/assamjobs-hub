code = """
import { redirect } from "next/navigation";

export default function GovtJobsPage() {
  redirect("/jobs?type=GOVERNMENT");
}
"""
with open("src/app/govt-jobs/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("src/app/private-jobs/page.tsx", "w", encoding="utf-8") as f:
    f.write(code.replace("GOVERNMENT", "PRIVATE"))

