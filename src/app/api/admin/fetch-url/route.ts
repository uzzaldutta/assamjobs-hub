import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';
    
    if (authHeader !== `Bearer ${correctPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, text } = await req.json();

    if (!url && !text) {
      return NextResponse.json({ error: "Valid URL or raw text required" }, { status: 400 });
    }

    let rawText = "";

    if (text) {
      rawText = text.replace(/\s+/g, ' ').trim().substring(0, 15000);
    } else {
      // 1. Fetch website HTML
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract raw text
      $('script, style, noscript, iframe, img, svg').remove();
      rawText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000); // Limit to 15k chars for Gemini
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    // 2. Use Gemini AI to parse the text
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "The specific job title being offered (e.g. 'Software Engineer', 'Grade III Clerk')" },
        organization: { type: SchemaType.STRING, description: "The name of the company or government department offering the job" },
        job_type: { 
          type: SchemaType.STRING, 
          description: "Must be exactly one of: GOVERNMENT, PRIVATE, RAILWAY, ADRE, APSC, POLICE" 
        },
        category: { 
          type: SchemaType.STRING, 
          description: "Must be exactly one of: ASSAM_STATE, CENTRAL_GOVT, LOCAL_PRIVATE" 
        },
        vacancies: { type: SchemaType.STRING, description: "Number of vacancies, e.g. '10', 'Not Specified'" },
        district: { type: SchemaType.STRING, description: "The location/district of the job, e.g. 'Guwahati', 'All Assam'" },
        ageLimit: { type: SchemaType.STRING, description: "Age limits or requirements, e.g. '18-40 Years'" },
        qualification: { type: SchemaType.STRING, description: "Comma separated qualifications, e.g. 'Graduation, 10th Pass'" },
        unique_description: {
          type: SchemaType.STRING,
          description: "A comprehensive HTML-formatted description of the job. You MUST use HTML tags like <h3> for headings, <ul><li> for lists, and beautifully formatted HTML <table> structures to display things like Important Dates, Vacancy details, Application Fees, etc."
        },
        unique_description_assamese: {
          type: SchemaType.STRING,
          description: "A professional Assamese translation of the unique_description, also using HTML tags and HTML tables."
        }
      },
      required: ["title", "organization", "job_type", "category", "vacancies", "district", "ageLimit", "qualification", "unique_description", "unique_description_assamese"]
    };

    const prompt = `
      You are an expert data extractor and professional Assamese translator for a premier Jobs Portal.
      Analyze the following scraped job posting text and extract the key details required by the schema.
      If a field is not explicitly mentioned, provide a reasonable default (e.g. "Not Specified").
      For 'job_type' and 'category', classify the job accurately based on the organization and context.

      CRITICAL INSTRUCTIONS FOR DESCRIPTIONS:
      1. Your 'unique_description' field MUST contain a highly detailed, professional, and visually stunning HTML layout.
      2. Use <h3> or <h4> tags for clear section headings. 
      3. CRITICAL: Whenever there is structured data (e.g., Important Dates, Vacancy Breakdowns, Application Fees, Selection Process, Salary/Pay Scale), you MUST strictly format it as an HTML <table> with proper <thead>, <tbody>, <tr>, <th>, and <td> tags. 
      4. Ensure all tables have the class name "table-auto w-full mb-4 border-collapse border border-slate-300 dark:border-slate-700".
      5. Use <ul> and <li> for standard lists like eligibility criteria or educational qualifications.
      6. The 'unique_description_assamese' MUST be a direct, professional Assamese language translation of the exact same HTML layout. Do not drop any tables or formatting.

      Extract exact salary information if available. Do not output any Markdown wrapping like \`\`\`html.

      Website Text:
      ${rawText}
    `;

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-flash-latest"];
    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema as any,
          },
        });
        break; // Success! Break out of the loop
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next... Error: ${err.message}`);
      }
    }

    if (!result) {
      throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
    }

    const aiData = JSON.parse(result.response.text());

    return NextResponse.json({ success: true, data: aiData }, { status: 200 });

  } catch (error: any) {
    console.error("Auto-Fill Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
