import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://y-ruddy-nine-46.vercel.app';
  
  // Core routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/admit-cards`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/results`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tenders`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/syllabus`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/saved`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    
    // Tools
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools/study-planner`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/interview-prep`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/tender-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/fee-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/marks-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/typing-test`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/salary-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/cgpa-converter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/pdf-merger`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/photo-resizer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/age-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/cv-maker`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/standard-form`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    
    // Mock Tests
    { url: `${baseUrl}/mock-tests`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/mock-tests/assam-gk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/mock-tests/english-grammar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/mock-tests/logical-reasoning`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Fetch jobs for dynamic URLs
  try {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, scraped_at')
      .order('scraped_at', { ascending: false })
      .limit(5000); // Limit to 5000 to avoid massive sitemaps crashing edge functions

    if (jobs && jobs.length > 0) {
      const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.id}`,
        lastModified: new Date(job.scraped_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      
      return [...routes, ...jobRoutes];
    }
  } catch (e) {
    console.error("Failed to generate sitemap for jobs", e);
  }

  return routes;
}
