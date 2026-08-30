"use server";

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function generateInterviewQuestions(jobTitle: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "GEMINI_API_KEY is not set." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are an expert career coach in India (specifically Assam). 
    I am preparing for an interview for the position of: "${jobTitle}".
    
    Please generate 7 highly likely interview questions for this specific role. Include:
    - 2 Behavioral/HR questions
    - 3 Technical/Role-specific questions
    - 2 State/Local GK questions relevant to Assam or the organization.
    
    For each question, provide:
    1. The question itself
    2. A brief 1-sentence tip on how to answer it
    3. A realistic sample answer (2-3 sentences max) that would impress the panel.`;

    const schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: { type: SchemaType.STRING, description: "E.g., Behavioral, Technical, Assam GK" },
          question: { type: SchemaType.STRING },
          tip: { type: SchemaType.STRING },
          sampleAnswer: { type: SchemaType.STRING }
        },
        required: ["category", "question", "tip", "sampleAnswer"]
      }
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
      },
    });
    
    const parsedData = JSON.parse(result.response.text());
    
    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: "Failed to generate questions. Please try again later." };
  }
}
