code = """
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateMCQsWithGemini(
  promptContext: string,
  count: number,
  metadata: {
    exam: string;
    subject: string;
    topic: string;
    difficulty: string;
    language: string;
    sourceGrounded: boolean;
  }
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const groundingInstruction = metadata.sourceGrounded 
    ? "STRICT SOURCE GROUNDING ENABLED: You MUST generate questions ONLY using facts present in the provided context. Do NOT invent facts. If the context does not contain enough information to generate the requested number of questions, output fewer questions."
    : "Use the provided context as inspiration, but you may use your general knowledge of competitive exams to create comprehensive questions.";

  const systemPrompt = `You are an expert competitive exam question generator for Assam Government exams, SSC, Banking, and Railways.
Generate ${count} multiple-choice questions based on the context.
Ensure the difficulty is strictly ${metadata.difficulty}.
Language: Generate the questions in ${metadata.language}.

${groundingInstruction}

Context: ${promptContext}
Exam: ${metadata.exam || "General"}
Subject: ${metadata.subject || "General"}
Topic: ${metadata.topic || "General"}

You must return a raw JSON array. DO NOT wrap it in markdown code blocks (\`\`\`json). Return ONLY the raw JSON array.
Each object in the array MUST strictly follow this schema:
{
  "question_text": "The actual question",
  "optionA": "First option text",
  "optionB": "Second option text",
  "optionC": "Third option text",
  "optionD": "Fourth option text",
  "correct_answer": "A" | "B" | "C" | "D",
  "explanation": "Detailed step-by-step explanation. For math, show steps. For facts, explain why.",
  "quality_score": number, // 0 to 100 based on clarity, options uniqueness, and explanation quality
  "quality_warnings": ["Warning 1", "Warning 2"] // Array of strings if any issues (e.g., 'Weak distractor', 'Ambiguous wording'), else empty array
}
No other fields. Ensure correct_answer is exactly one of the letters A, B, C, or D. Ensure no duplicate options.`;

  const result = await model.generateContent(systemPrompt);
  const text = result.response.text();
  
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json/, "");
    if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```/, "");
    if (cleaned.endsWith("```")) cleaned = cleaned.replace(/```$/, "");
    
    const parsed = JSON.parse(cleaned.trim());
    if (!Array.isArray(parsed)) throw new Error("Response is not a JSON array");
    return parsed;
  } catch (e) {
    console.error("Failed to parse Gemini output:", text);
    throw new Error("Failed to parse AI output into structured JSON.");
  }
}
"""
with open("src/lib/ai/gemini.ts", "w", encoding="utf-8") as f:
    f.write(code)
