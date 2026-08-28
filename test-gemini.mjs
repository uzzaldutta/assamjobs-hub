import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : "";
console.log("API Key found:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey);
const questionSchema = {
    type: SchemaType.ARRAY,
    description: "List of multiple choice questions",
    items: {
    type: SchemaType.OBJECT,
    properties: {
        question: { type: SchemaType.STRING, description: "The actual question text" },
        options: { type: SchemaType.ARRAY, description: "Exactly 4 options", items: { type: SchemaType.STRING } },
        correctAnswerIndex: { type: SchemaType.INTEGER, description: "Index 0-3" },
        explanation: { type: SchemaType.STRING, description: "Explanation" }
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
const prompt = `Generate 2 mock questions on Assam History.`;
try {
    const result = await model.generateContent(prompt);
    console.log("SUCCESS:", result.response.text());
} catch (e) {
    console.error("ERROR:", e);
}
