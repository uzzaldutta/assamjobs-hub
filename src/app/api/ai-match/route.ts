import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
    }

    // 1. Read Database
    const dbPath = path.join(process.cwd(), "src", "data", "db.json");
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Database not found" }, { status: 500 });
    }
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const allJobs = [...(db.jobs || []), ...(db.tenders || []), ...(db.results || []), ...(db.training || [])];

    // Prepare a concise list of jobs for the AI
    const jobsForAI = allJobs.map((j: any) => ({
      id: j.id,
      title: j.title,
      organization: j.organization,
      qualification: j.qualification || "",
      description: j.unique_description || ""
    }));

    // 2. Call Gemini 3.6 Flash via REST API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const prompt = `
You are an expert recruitment AI for the Assam Jobs Hub.
The user has provided their resume/skills profile.
Evaluate their profile against the provided JSON list of available jobs.
Find the top 3 best matching jobs for them.

User Profile:
${resumeText}

Available Jobs:
${JSON.stringify(jobsForAI)}

Return ONLY a raw JSON array of objects representing the matches, with NO markdown formatting, like this:
[
  {
    "job_id": "job id here",
    "score": 95,
    "reason": "Explain exactly why this job is a great fit for their specific skills."
  }
]
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      })
    });

    const aiData = await response.json();
    
    if (aiData.error) {
      console.error(aiData.error);
      return NextResponse.json({ error: "AI evaluation failed" }, { status: 500 });
    }

    const aiText = aiData.candidates[0].content.parts[0].text;
    const matches = JSON.parse(aiText);

    // Join AI match data back with full job objects
    const enrichedMatches = matches.map((match: any) => {
      const fullJob = allJobs.find((j: any) => String(j.id) === String(match.job_id));
      return {
        ...match,
        job: fullJob
      };
    }).filter((m: any) => m.job !== undefined); // Remove if AI halluncinated an ID

    return NextResponse.json({ matches: enrichedMatches });

  } catch (error: any) {
    console.error("AI Matcher Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
