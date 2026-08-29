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
      },
      required: ["title", "organization", "job_type", "category", "vacancies", "district", "ageLimit", "qualification"]
    };

    const prompt = `
      Analyze the following scraped job posting text and extract the key details required by the schema.
      If a field is not explicitly mentioned, provide a reasonable default (e.g. "Not Specified").
      For 'job_type' and 'category', classify the job accurately based on the organization and context.

      Website Text:
      ${rawText}
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
      },
    });

    const aiData = JSON.parse(result.response.text());

    return NextResponse.json({ success: true, data: aiData }, { status: 200 });

  } catch (error: any) {
    console.error("Auto-Fill Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
