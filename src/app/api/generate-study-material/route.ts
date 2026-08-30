import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

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
    
    const prompt = `You are an expert educator creating high-yield, concise study materials for competitive exams (like ADRE, APSC, Assam Police).
Create a short, highly-concentrated study guide on the topic: "${topic}".

CRITICAL INSTRUCTIONS:
1. Keep it SMALL IN SIZE and CONCISE (maximum 400 words).
2. Focus ONLY on the most important facts, dates, formulas, or core concepts that frequently appear in exams.
3. Use beautiful HTML formatting: Use <h3> for headings, <ul> and <li> for bullet points.
4. If there is structured data (like important dates or definitions), use a clean HTML <table>.
5. Do NOT output any markdown code block wrappers like \`\`\`html. Return pure HTML.
`;

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-flash-latest"];
    let text = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        text = result.response.text();
        break; // Success
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next... Error: ${err.message}`);
      }
    }

    if (!text) {
      throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
    }
    
    // Save to database
    const materialId = `study_material_${Date.now()}`;
    const { error: dbError } = await supabase.from('jobs').insert({
      id: materialId,
      title: topic,
      category: 'STUDY_MATERIAL',
      job_type: 'GOVERNMENT', // placeholder
      organization: 'AssamJobs Hub AI',
      district: 'All Assam',
      status: 'PUBLISHED',
      unique_description: text,
      scraped_at: new Date().toISOString()
    });

    if (dbError) {
      console.error("Failed to save study material to DB:", dbError);
    }

    return NextResponse.json({ materialId, content: text });

  } catch (error: any) {
    console.error("Study Material Generation Error:", error.message || error);
    return NextResponse.json({ error: "Failed to generate study material. Please try again." }, { status: 500 });
  }
}
