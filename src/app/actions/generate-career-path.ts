"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateCareerPath(education: string, skills: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return { 
        success: false, 
        error: "GEMINI_API_KEY is not set in Vercel environment variables." 
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are an expert career counselor for government and private jobs in Assam, India.
    A candidate has provided their qualifications.
    Education: "${education}"
    Key Skills / Interests: "${skills || 'None specified'}"
    
    Analyze their profile and recommend the top 3 specific career paths or government departments in Assam they are perfectly eligible for (e.g., ADRE Grade 3, APSC CCE, Assam Police SI, NHM Assam, Private IT sector in Guwahati, etc.).
    
    Format your response STRICTLY as a raw JSON array of objects without markdown formatting or backticks:
    [
      { 
        "title": "ADRE Grade III (Clerical)", 
        "department": "State Level Recruitment Commission", 
        "eligibility": "Perfect match for your Bachelor's degree. Requires basic computer skills.", 
        "preparationTip": "Focus on Assam History, Reasoning, and Computer tests." 
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up potential markdown formatting from Gemini
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsedData = JSON.parse(text);
    return { success: true, data: parsedData };
    
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return { success: false, error: "Failed to generate career path. The AI service might be overloaded." };
  }
}
