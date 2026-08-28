import { NextResponse } from "next/server";
import { GoogleGenerativeAI, Schema, Type } from "@google/generative-ai";

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
    
    const questionSchema: Schema = {
      type: Type.ARRAY,
      description: "List of multiple choice questions",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The actual question text",
          },
          options: {
            type: Type.ARRAY,
            description: "Exactly 4 plausible options for the multiple choice question",
            items: {
              type: Type.STRING,
            },
          },
          correctAnswerIndex: {
            type: Type.INTEGER,
            description: "The index of the correct option (0, 1, 2, or 3)",
          },
          explanation: {
            type: Type.STRING,
            description: "Brief factual explanation of why the correct answer is correct",
          }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"],
      }
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      }
    });

    const prompt = `You are an expert exam setter for Indian Government competitive exams (especially Assam State Exams like ADRE, APSC, Assam Police).
Generate a high-quality, professional mock test of exactly ${numQuestions} multiple choice questions on the topic: "${topic}".`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    const questions = JSON.parse(text);

    return NextResponse.json({ questions });

  } catch (error: any) {
    console.error("Mock Test Generation Error:", error.message || error);
    return NextResponse.json({ error: "Failed to generate mock test. Please try again." }, { status: 500 });
  }
}
