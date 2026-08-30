import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

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
    
    const questionSchema = {
      type: SchemaType.ARRAY,
      description: "List of multiple choice questions",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
            description: "The actual question text",
          },
          options: {
            type: SchemaType.ARRAY,
            description: "Exactly 4 plausible options for the multiple choice question",
            items: {
              type: SchemaType.STRING,
            },
          },
          correctAnswerIndex: {
            type: SchemaType.INTEGER,
            description: "The index of the correct option (0, 1, 2, or 3)",
          },
          explanation: {
            type: SchemaType.STRING,
            description: "Brief factual explanation of why the correct answer is correct",
          }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"],
      }
    };

    const prompt = `You are an expert exam setter for Indian Government competitive exams (especially Assam State Exams like ADRE, APSC, Assam Police).
Generate a high-quality, professional mock test of exactly ${numQuestions} multiple choice questions on the topic: "${topic}". Make sure the questions are standard and very relevant.`;

    const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-pro"];
    let text = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: questionSchema as any,
          }
        });
        const result = await model.generateContent(prompt);
        text = result.response.text();
        break; // Success! Break out of the loop
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next... Error: ${err.message}`);
      }
    }

    if (!text) {
      throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
    }
    
    const questions = JSON.parse(text);

    // Save to database
    const testId = `mock_test_${Date.now()}`;
    const { error: dbError } = await supabase.from('jobs').insert({
      id: testId,
      title: topic,
      category: 'MOCK_TEST',
      job_type: 'GOVERNMENT', // placeholder
      organization: 'AssamJobs Hub AI',
      district: 'All Assam',
      vacancies: String(numQuestions), // Store number of questions here
      status: 'PUBLISHED',
      unique_description: JSON.stringify(questions),
      scraped_at: new Date().toISOString()
    });

    if (dbError) {
      console.error("Failed to save mock test to DB:", dbError);
      // Still return the questions even if DB save fails
    }

    return NextResponse.json({ testId, questions });

  } catch (error: any) {
    console.error("Mock Test Generation Error:", error.message || error);
    return NextResponse.json({ error: "Failed to generate mock test. Please try again." }, { status: 500 });
  }
}
