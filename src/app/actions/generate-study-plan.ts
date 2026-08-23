"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateStudyPlan(examName: string, days: number, weakSubjects: string) {
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

    const prompt = `You are an expert exam preparation coach for Indian competitive exams, specifically those in Assam (like APSC, ADRE, Assam Police, etc).
    A student has asked you to create a structured study timetable.
    Exam Name: "${examName}"
    Days Left: ${days} days
    Student's Weak Subjects: "${weakSubjects || 'None specified'}"
    
    Please create a structured JSON array breaking down the study plan into logical phases (not every single day if it's too many days, but grouped logically, e.g., "Week 1", "Days 1-5").
    For each phase, provide a title, the focus topics, and a study tip.
    
    Format your response STRICTLY as a raw JSON array of objects:
    [
      { "period": "Days 1-5", "title": "Foundation & Core Basics", "topics": ["History of Assam", "Basic Math"], "tip": "Focus on understanding concepts, not memorizing." },
      ...
    ]
    Do NOT include markdown formatting like \`\`\`json. Return ONLY the raw JSON array. Keep it under 8 periods total.`;

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
    return { success: false, error: "Failed to generate study plan. Please try again later." };
  }
}
