import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userName, userSkills, jobTitle, jobOrg } = await req.json();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const prompt = `
You are an expert career coach helping a candidate from Assam apply for a job.
Generate a professional, highly persuasive cover letter for this candidate.

Candidate Name: ${userName || "[Candidate Name]"}
Candidate Skills/Background: ${userSkills || "General professional background"}

Target Job Title: ${jobTitle}
Target Organization: ${jobOrg}

Guidelines:
1. Make it professional but modern.
2. Highlight how their specific skills align with the job.
3. Keep it to 3-4 concise paragraphs.
4. Do NOT use markdown. Return plain text with line breaks (\\n).
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    const aiData = await response.json();
    
    if (aiData.error) {
      console.error(aiData.error);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const coverLetter = aiData.candidates[0].content.parts[0].text;
    return NextResponse.json({ coverLetter });

  } catch (error: any) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
