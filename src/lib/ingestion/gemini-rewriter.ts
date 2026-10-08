import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function rewriteJobWithGemini(rawText: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

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
        },
        apply_url: { type: SchemaType.STRING, description: "The official Apply Online URL found in the text, if any. Return empty string if not found." },
        official_pdf_url: { type: SchemaType.STRING, description: "The official Advertisement/Notification PDF link found in the text, if any. Return empty string if not found." }
      },
      required: ["title", "organization", "job_type", "category", "vacancies", "district", "ageLimit", "qualification", "unique_description", "unique_description_assamese", "apply_url", "official_pdf_url"]
    };

    const prompt = `
      You are an expert data extractor and professional Assamese translator for a premier Jobs Portal.
      Analyze the following scraped job posting text and extract the key details required by the schema.
      If a field is not explicitly mentioned, provide a reasonable default (e.g. "Not Specified").

      CRITICAL INSTRUCTIONS FOR DESCRIPTIONS:
      1. Make the 'unique_description' EXTREMELY COMPREHENSIVE. Extract absolutely everything: Age limits, age relaxations, educational qualifications, selection process, syllabus, application fee, how to apply steps, salary details.
      2. Use <h3> or <h4> tags for clear section headings. 
      3. CRITICAL: Whenever there is structured data (e.g., Important Dates, Vacancy Breakdowns, Application Fees), you MUST strictly format it as an HTML <table> with proper <thead>, <tbody>, <tr>, <th>, and <td> tags. 
      4. Ensure all tables have the class name "table-auto w-full mb-4 border-collapse border border-slate-300 dark:border-slate-700".
      5. Use <ul> and <li> for standard lists like eligibility criteria or educational qualifications.
      6. Extract the Official Advertisement PDF link and Apply Online link from the text and put them into the apply_url and official_pdf_url schema fields.
      7. The 'unique_description_assamese' MUST be a direct, professional Assamese language translation of the exact same HTML layout. Do not drop any tables or formatting.

      Do not output any Markdown wrapping like \`\`\`html.

      Website Text:
      ${rawText.substring(0, 15000)}
    `;

    await new Promise(res => setTimeout(res, 13000)); // Sleep 13s to respect 5 RPM quota
    const modelsToTry = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash"];
    await new Promise(res => setTimeout(res, 4000));
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
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next... Error: ${err.message}`);
      }
    }

    if (!result) {
      throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
    }

    return JSON.parse(result.response.text());
}