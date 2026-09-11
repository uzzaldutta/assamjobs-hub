import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { profile, job } = await req.json();

    if (!profile || !job) {
      return NextResponse.json({ success: false, error: 'Missing profile or job data' }, { status: 400 });
    }

    const prompt = `
You are an expert career counselor for government and private jobs in Assam, India.
A candidate wants to know if they are eligible for a specific job based on their profile.

CANDIDATE PROFILE:
- Age: ${profile.age}
- Qualification: ${profile.qualification}
- Caste Category: ${profile.category}

JOB DETAILS:
- Title: ${job.title}
- Organization: ${job.organization}
- Required Qualification (if specified): ${job.qualification || 'Not explicitly stated'}
- Age Limit (if specified): ${job.age_limit || 'Not explicitly stated'}

EVALUATION RULES:
1. Compare the candidate's qualification with the required qualification. (e.g. if job requires 12th pass, and candidate has Graduation, they are usually eligible unless specified otherwise).
2. Compare the candidate's age with the age limit. Note that in Assam/India, reserved categories (OBC/MOBC, SC, ST) generally receive a 3 to 5-year age relaxation on the upper age limit.
3. If the job details lack specific age or qualification data, assume they MIGHT be eligible but state that they should read the official notification.

Respond with a structured evaluation.

`;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        eligible: {
          type: SchemaType.BOOLEAN,
          description: "True if the candidate appears eligible, false if they clearly do not meet the criteria."
        },
        reason: {
          type: SchemaType.STRING,
          description: "A short, friendly 1-2 sentence explanation of why they are or aren't eligible, or advising them to check the notification if data is missing."
        }
      },
      required: ["eligible", "reason"]
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return NextResponse.json({ success: true, evaluation: parsed });

  } catch (error: any) {
    console.error("Single job eligibility check error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
