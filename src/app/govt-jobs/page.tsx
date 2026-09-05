
import { redirect } from "next/navigation";

export default function GovtJobsPage() {
  redirect("/jobs?type=GOVERNMENT");
}
