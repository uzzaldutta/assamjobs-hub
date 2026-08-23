"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateInterviewQuestions(jobTitle: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return { 
        success: false, 
        error: "GEMINI_API_KEY is not set in Vercel environment variables." 
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert career coach in India (specifically Assam). 
    I am preparing for an interview for the position of: "${jobTitle}".
    Please provide exactly 5 highly relevant interview questions I am likely to be asked, and a brief 1-sentence tip on how to answer each one.
    Format your response as a strict JSON array of objects, like this:
    [
      { "question": "...", "tip": "..." },
      ...
    ]
    Do NOT include markdown formatting like \`\`\`json. Return ONLY the raw JSON array.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up any potential markdown wrappers
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) cleanJson = cleanJson.replace("```json", "");
    if (cleanJson.startsWith("```")) cleanJson = cleanJson.replace("```", "");
    if (cleanJson.endsWith("```")) cleanJson = cleanJson.replace(/```$/, "");
    
    const parsedData = JSON.parse(cleanJson);
    
    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: "Failed to generate questions. Please try again later." };
  }
}
