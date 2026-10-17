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
      1. Structure both 'unique_description' and 'unique_description_assamese' with clear, comprehensive sections using <h3> or <h4> tags:
         - An introductory paragraph introducing the recruitment drive.
         - <h3>Overview of Recruitment</h3> with key highlights (Post Name, Total Vacancies, Organization, Qualification, Salary/Pay Scale, Application Start & End Dates).
         - <h3>Recruitment Details</h3> explaining the recruitment scope and authority.
         - <h3>Vacancy Details</h3> with exact breakdowns per post/department.
         - <h3>Eligibility Conditions</h3> including detailed Educational Qualifications and Age Limits (mentioning category-wise age relaxations: OBC/SC/ST/PwBD).
         - <h3>Documents Required</h3> needed for the application.
         - <h3>How to Apply</h3> step-by-step instructions.
         - <h3>Important Dates & Links</h3> with start date, deadline, official website, and application links.
         - <h3>Frequently Asked Questions (FAQs)</h3> with at least 3 relevant Q&As.
      2. Whenever there is structured data (e.g., Important Dates, Vacancy Breakdowns, Application Fees), you MUST strictly format it as an HTML <table> with class "table-auto w-full mb-4 border-collapse border border-slate-300 dark:border-slate-700" with <thead>, <tbody>, <tr>, <th>, and <td> tags.
      3. Use <ul> and <li> for lists.
      4. Extract the Official Advertisement PDF link and Apply Online link from the text into apply_url and official_pdf_url schema fields.
      5. The 'unique_description_assamese' MUST be an authentic, professional Assamese translation of the exact same structured layout, retaining all headings, lists, and tables without omitting anything.

      Do not output any Markdown wrapping like \`\`\`html or \`\`\`json.

      Website Text:
      ${rawText.substring(0, 15000)}
    `;

    await new Promise(res => setTimeout(res, 12000)); // Sleep 12s to respect 5 RPM quota
    const modelsToTry = ["gemini-3.8-flash"];
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