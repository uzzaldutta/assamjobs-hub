
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ExamDashboardClient from "./ExamDashboardClient";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: exam } = await supabase.from("prep_exams").select("title, description").eq("slug", params.slug).single();
  if (!exam) return { title: "Exam Not Found" };
  return { title: `${exam.title} Preparation | AssamJobs Hub`, description: exam.description };
}

export default async function ExamPage({ params }: { params: { slug: string } }) {
  // 1. Fetch Exam
  const { data: exam } = await supabase.from("prep_exams").select("*").eq("slug", params.slug).single();
  if (!exam) notFound();

  // 2. Fetch Syllabus Hierarchy in parallel
  const [subRes, chapRes, topRes] = await Promise.all([
    supabase.from("prep_subjects").select("*").eq("exam_id", exam.id).order("order_index", { ascending: true }),
    supabase.from("prep_chapters").select("*, prep_subjects!inner(exam_id)").eq("prep_subjects.exam_id", exam.id).order("order_index", { ascending: true }),
    supabase.from("prep_topics").select("*, prep_chapters!inner(prep_subjects!inner(exam_id))").eq("prep_chapters.prep_subjects.exam_id", exam.id).order("order_index", { ascending: true })
  ]);

  const subjects = subRes.data || [];
  const chapters = chapRes.data || [];
  const topics = topRes.data || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <ExamDashboardClient 
        exam={exam} 
        subjects={subjects} 
        chapters={chapters} 
        topics={topics} 
      />
    </div>
  );
}
