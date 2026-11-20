import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://assamjobshub.com';
  
  // Core routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/govt-jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/private-jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/railway-jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/admit-cards`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/results`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tenders`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/admissions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/scholarships`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/exams`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/syllabus`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/study-materials`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/previous-papers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/mock-tests`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/updates`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    
    // Tools & Utilities (High-Value Interactive Assets for AdSense & SEO)
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/career-advisor`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/study-planner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/interview-prep`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/marks-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/age-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/typing-test`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/standard-form`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/resume-builder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/cv-maker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/cgpa-converter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/eligibility-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/fee-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/salary-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/tender-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/photo-resizer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/photo-maker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/pdf-merger`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },

    // Institutional Trust & Legal Pages (AdSense Compliance)
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/editorial-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    // 1. Fetch published Jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, slug, scraped_at')
      .eq('status', 'PUBLISHED')
      .order('scraped_at', { ascending: false })
      .limit(1000);

    if (jobs) {
      jobs.forEach((job) => {
        routes.push({
          url: `${baseUrl}/jobs/${job.slug || job.id}`,
          lastModified: new Date(job.scraped_at || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }

    // 2. Tenders
    const { data: tenders } = await supabase.from('tenders').select('id, created_at').eq('status', 'PUBLISHED').limit(500);
    if (tenders) {
      tenders.forEach((t) => routes.push({ url: `${baseUrl}/tenders/${t.id}`, lastModified: new Date(t.created_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 }));
    }

    // 3. Admissions (Primary from jobs where job_type = ADMISSION + fallback admissions table)
    const { data: admissionsJobs } = await supabase.from('jobs').select('id, scraped_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').limit(500);
    if (admissionsJobs) {
      admissionsJobs.forEach((a) => routes.push({ url: `${baseUrl}/admissions/${a.id}`, lastModified: new Date(a.scraped_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 }));
    }

    // 4. Results (Dual sync: results table + jobs where job_type = RESULT)
    const seenResults = new Set<string>();
    const { data: results } = await supabase.from('results').select('id, created_at').eq('status', 'PUBLISHED').limit(500);
    if (results) {
      results.forEach((r) => {
        seenResults.add(r.id);
        routes.push({ url: `${baseUrl}/results/${r.id}`, lastModified: new Date(r.created_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 });
      });
    }
    const { data: resultsJobs } = await supabase.from('jobs').select('id, scraped_at').eq('status', 'PUBLISHED').eq('job_type', 'RESULT').limit(500);
    if (resultsJobs) {
      resultsJobs.forEach((r) => {
        if (!seenResults.has(r.id)) {
          routes.push({ url: `${baseUrl}/results/${r.id}`, lastModified: new Date(r.scraped_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 });
        }
      });
    }

    // 5. Admit Cards (Dual sync: admit_cards table + jobs where job_type = ADMIT_CARD)
    const seenAdmitCards = new Set<string>();
    const { data: admitCards } = await supabase.from('admit_cards').select('id, created_at').eq('status', 'PUBLISHED').limit(500);
    if (admitCards) {
      admitCards.forEach((a) => {
        seenAdmitCards.add(a.id);
        routes.push({ url: `${baseUrl}/admit-cards/${a.id}`, lastModified: new Date(a.created_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 });
      });
    }
    const { data: admitJobs } = await supabase.from('jobs').select('id, scraped_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMIT_CARD').limit(500);
    if (admitJobs) {
      admitJobs.forEach((a) => {
        if (!seenAdmitCards.has(a.id)) {
          routes.push({ url: `${baseUrl}/admit-cards/${a.id}`, lastModified: new Date(a.scraped_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 });
        }
      });
    }

    // 6. Scholarships
    const { data: scholarships } = await supabase.from('scholarships').select('id, created_at').eq('status', 'PUBLISHED').limit(500);
    if (scholarships) {
      scholarships.forEach((s) => routes.push({ url: `${baseUrl}/scholarships/${s.id}`, lastModified: new Date(s.created_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 }));
    }

    // 7. Exams
    const { data: exams } = await supabase.from('prep_exams').select('slug, updated_at').limit(100);
    if (exams) {
      exams.forEach((e) => routes.push({ url: `${baseUrl}/exam/${e.slug}`, lastModified: new Date(e.updated_at || Date.now()), changeFrequency: 'weekly', priority: 0.8 }));
    }

    // 8. Study Materials
    const { data: materials } = await supabase.from('prep_materials').select('id, updated_at').limit(500);
    if (materials) {
      materials.forEach((m) => routes.push({ url: `${baseUrl}/study-materials/${m.id}`, lastModified: new Date(m.updated_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 }));
    }

    // 9. Mock Tests
    const { data: tests } = await supabase.from('prep_mock_tests').select('id, updated_at').limit(500);
    if (tests) {
      tests.forEach((t) => routes.push({ url: `${baseUrl}/mock-tests/${t.id}`, lastModified: new Date(t.updated_at || Date.now()), changeFrequency: 'weekly', priority: 0.7 }));
    }

  } catch (e) {
    console.error("Failed to generate complete sitemap", e);
  }

  return routes;
}
