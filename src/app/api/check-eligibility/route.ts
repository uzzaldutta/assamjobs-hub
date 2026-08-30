import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const profile = await req.json();

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, title, organization, qualification, age_limit, job_type, last_date, scraped_at, created_at')
      .neq('category', 'STUDY_MATERIAL')
      .neq('category', 'MOCK_TEST')
      .order('scraped_at', { ascending: false })
      .limit(30);

    if (error || !jobs) {
      return NextResponse.json({ success: false, error: 'Failed to fetch jobs' });
    }

    const jobsListStr = jobs.map(j => `ID: ${j.id} | Title: ${j.title} | Org: ${j.organization} | Req. Qual: ${j.qualification} | Req. Age: ${j.age_limit}`).join('\n');

    const prompt = `
You are an expert career counselor. 
A candidate has the following profile:
- Age: ${profile.age}
- Qualification: ${profile.qualification}
- Caste Category: ${profile.category} (Note: Reserved categories often get 3-5 years age relaxation).

Here is a list of active job postings.
Evaluate each job and decide if this candidate is legally eligible to apply based on their Age and Qualification.
Return ONLY the IDs of the jobs they are eligible for.

Jobs:
${jobsListStr}
`;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        eligibleJobIds: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "List of job IDs the user is eligible for."
        }
      },
      required: ["eligibleJobIds"]
    };

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);
    const eligibleIds = parsed.eligibleJobIds || [];

    const eligibleJobs = jobs.filter(j => eligibleIds.includes(j.id.toString()));

    return NextResponse.json({ success: true, eligibleJobs });

  } catch (error: any) {
    console.error("Eligibility check error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}