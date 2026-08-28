import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { topic, numQuestions = 10 } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are an expert exam setter for Indian Government competitive exams (especially Assam State Exams like ADRE, APSC, Assam Police).
Generate a high-quality, professional mock test of exactly ${numQuestions} multiple choice questions on the topic: "${topic}".

STRICT INSTRUCTIONS:
- The questions must be standard level, highly relevant to the topic, and strictly accurate.
- Each question must have exactly 4 plausible options.
- Only one option can be correct.
- Provide a brief, factual explanation for the correct answer.
- DO NOT wrap the output in markdown (e.g., no \`\`\`json). Just output the raw JSON array.

The output MUST perfectly match this JSON array schema:
[
  {
    "question": "string (the actual question)",
    "options": ["string", "string", "string", "string"],
    "correctAnswerIndex": number (strictly 0, 1, 2, or 3),
    "explanation": "string"
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
