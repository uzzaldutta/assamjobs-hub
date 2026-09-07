file_path = "src/app/exam/[slug]/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_meta = """export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: exam } = await supabase.from("prep_exams").select("title, description").eq("slug", slug).single();
  if (!exam) return { title: "Exam Not Found" };
  return { title: `${exam.title} Preparation | AssamJobs Hub`, description: exam.description };
}"""

new_meta = """export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: exam } = await supabase.from("prep_exams").select("*").eq("slug", slug).single();
  
  if (!exam) return { title: "Exam Not Found", robots: { index: false } };
  
  const title = `${exam.title} Preparation, Syllabus & Mock Tests`;
  const desc = exam.description || `Prepare for ${exam.title} with complete syllabus, study materials, and mock tests.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';
  const url = `${baseUrl}/exam/${exam.slug}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    }
  };
}"""

content = content.replace(old_meta, new_meta)

schema_code = """
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": exam.title,
    "description": exam.description || `Preparation for ${exam.title}`,
    "provider": {
      "@type": "Organization",
      "name": "AssamJobs Hub"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
"""

content = content.replace('  return (\n    <ExamDashboardClient', schema_code + '      <ExamDashboardClient')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
