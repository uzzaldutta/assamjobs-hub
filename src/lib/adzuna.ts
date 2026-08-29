import crypto from 'crypto';

export interface AdzunaJobPayload {
  results: Array<{
    id: string;
    title: string;
    company: { display_name: string };
    description: string;
    location: { display_name: string };
    redirect_url: string;
    created: string;
  }>;
}

export function generateHash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function fetchAdzunaJobs(appId: string, appKey: string) {
  // Querying for jobs in Assam, India
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&where=Assam&results_per_page=20`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Adzuna API Error: ${response.statusText}`);
    }
    
    const data: AdzunaJobPayload = await response.json();
    return mapAdzunaToPrisma(data);
  } catch (error) {
    console.error("Failed to fetch jobs from Adzuna:", error);
    return [];
  }
}

function mapAdzunaToPrisma(data: AdzunaJobPayload) {
  return data.results.map((job) => {
    // Generate a unique hash using the job URL
    const hash = generateHash(job.redirect_url);
    
    return {
      hash,
      title: job.title,
      organization: job.company?.display_name || "Private Employer",
      jobType: "PRIVATE", // Matches Prisma JobType enum
      category: "LOCAL_PRIVATE", // Matches Prisma JobCategory enum
      vacancies: "Not Specified",
      qualification: [], // Adzuna doesn't explicitly provide this in standard response
      district: job.location?.display_name || "Assam",
      ageLimit: "Not Specified",
      lastDate: "TBD",
      officialPdfUrl: null,
      applyUrl: job.redirect_url,
      status: "PUBLISHED", // Private jobs can go live immediately
      sourceName: "Adzuna",
    };
  });
}
