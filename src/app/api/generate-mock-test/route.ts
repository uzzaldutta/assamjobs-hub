import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for speed and cost efficiency
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert exam setter for Indian Government jobs (especially Assam State Exams like ADRE, APSC, Assam Police).
Generate a mock test of exactly 20 multiple choice questions on the following topic: "${topic}".
The questions should be challenging, highly relevant to competitive exams, and strictly accurate.
Format your output EXACTLY as a valid JSON array of objects, with no markdown formatting, no code blocks, and no extra text.
Do NOT wrap the output in \`\`\`json. Just return the raw JSON array.

The JSON schema must exactly match this format for every object in the array:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswerIndex": number, // strictly 0 to 3
    "explanation": "string" // brief explanation of why the answer is correct
  }
]
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Fallback cleanup in case Gemini returns markdown blocks despite instructions
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const questions = JSON.parse(text);

    return NextResponse.json({ questions });

  } catch (error: any) {
    console.error("Mock Test Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate mock test. Please try again." }, { status: 500 });
  }
}
