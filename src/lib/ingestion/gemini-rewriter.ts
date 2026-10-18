import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function rewriteJobWithGemini(rawText: string, contentType: string = 'JOB') {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "The specific title of the job / result / admit card / scholarship / admission" },
        organization: { type: SchemaType.STRING, description: "The name of the company, educational institution, or government department" },
        job_type: { 
          type: SchemaType.STRING, 
          description: "One of: GOVERNMENT, PRIVATE, RAILWAY, ADRE, APSC, POLICE, RESULT, ADMIT_CARD, SCHOLARSHIP, ADMISSION" 
        },
        category: { 
          type: SchemaType.STRING, 
          description: "One of: ASSAM_STATE, CENTRAL_GOVT, LOCAL_PRIVATE, EDUCATION" 
        },
        vacancies: { type: SchemaType.STRING, description: "Number of vacancies or seats, e.g. '10', 'Not Specified'" },
        district: { type: SchemaType.STRING, description: "The location/district, e.g. 'Guwahati', 'All Assam'" },
        ageLimit: { type: SchemaType.STRING, description: "Age limits or requirements, e.g. '18-40 Years', 'Not Applicable'" },
        qualification: { type: SchemaType.STRING, description: "Comma separated qualifications or eligibility, e.g. 'Graduation, 10th Pass'" },
        unique_description: {
          type: SchemaType.STRING,
          description: "A comprehensive HTML-formatted description with headings, lists, and beautiful HTML tables."
        },
        unique_description_assamese: {
          type: SchemaType.STRING,
          description: "A professional Assamese translation of the unique_description, also using identical HTML tags and HTML tables."
        },
        apply_url: { type: SchemaType.STRING, description: "The official Apply Online / Download / Result URL found in the text, if any. Return empty string if not found." },
        official_pdf_url: { type: SchemaType.STRING, description: "The official Advertisement / Notice PDF link found in the text, if any. Return empty string if not found." }
      },
      required: ["title", "organization", "job_type", "category", "vacancies", "district", "ageLimit", "qualification", "unique_description", "unique_description_assamese", "apply_url", "official_pdf_url"]
    };

    let sectionInstructions = '';
    if (contentType === 'RESULT') {
      sectionInstructions = `
         - An introductory paragraph introducing the exam result / merit list announcement.
         - <h3>Overview of Result</h3> with key highlights (Exam Name, Conducting Authority, Result Declaration Date, Official Website).
         - <h3>Cut-Off Marks & Merit List Details</h3> with an HTML <table> showing category-wise cut-offs or selection criteria.
         - <h3>How to Check & Download Result</h3> step-by-step instructions.
         - <h3>Important Dates & Links</h3> with an HTML <table> containing Result Link, Merit List PDF, and Official Website.
         - <h3>Frequently Asked Questions (FAQs)</h3> with at least 3 relevant Q&As.
      `;
    } else if (contentType === 'ADMIT_CARD') {
      sectionInstructions = `
         - An introductory paragraph introducing the admit card / call letter / hall ticket release.
         - <h3>Overview of Admit Card</h3> with key highlights (Exam Name, Conducting Body, Exam Date, Admit Card Release Date).
         - <h3>Exam Schedule & Shift Timings</h3> with an HTML <table> showing Exam Dates, Shifts, Reporting Time, and Duration.
         - <h3>Required Documents for Exam Hall</h3> (Admit card printout, Valid photo ID proof, Passport photo, etc.).
         - <h3>How to Download Admit Card</h3> step-by-step instructions.
         - <h3>Important Dates & Links</h3> with an HTML <table> containing Direct Admit Card Download Link, Exam Notification PDF, and Official Portal.
         - <h3>Frequently Asked Questions (FAQs)</h3> with at least 3 relevant Q&As.
      `;
    } else if (contentType === 'SCHOLARSHIP') {
      sectionInstructions = `
         - An introductory paragraph introducing the scholarship scheme and objectives.
         - <h3>Overview of Scholarship Scheme</h3> with key highlights (Scheme Name, Department/Ministry, Beneficiaries, Scholarship Amount).
         - <h3>Scholarship Financial Assistance & Benefits</h3> with an HTML <table> showing Class/Course breakdown and stipend amounts.
         - <h3>Eligibility Criteria</h3> (Income limit, Domicile, Academic percentage requirements).
         - <h3>Documents Required for Application</h3>.
         - <h3>How to Apply Online</h3> step-by-step guide (e.g. National Scholarship Portal / Assam Portal).
         - <h3>Important Dates & Links</h3> with an HTML <table> containing Application Start Date, Last Date, Official Guidelines PDF, and Apply Link.
         - <h3>Frequently Asked Questions (FAQs)</h3> with at least 3 relevant Q&As.
      `;
    } else if (contentType === 'ADMISSION') {
      sectionInstructions = `
         - An introductory paragraph introducing the admission notice.
         - <h3>Overview of Admission</h3> with key highlights (Institution/University Name, Academic Session, Courses Offered).
         - <h3>Courses Offered, Intake & Eligibility</h3> with an HTML <table> showing Course Name, Duration, Seats, and Minimum Qualification.
         - <h3>Selection Procedure & Entrance Examination</h3> details.
         - <h3>Application Fee & Payment Mode</h3>.
         - <h3>How to Apply</h3> step-by-step application process.
         - <h3>Important Dates & Links</h3> with an HTML <table> containing Application Start Date, Deadline, Merit List Date, and Online Admission Link.
         - <h3>Frequently Asked Questions (FAQs)</h3> with at least 3 relevant Q&As.
      `;
    } else {
      // Standard JOB
      sectionInstructions = `
         - An introductory paragraph introducing the recruitment drive.
         - <h3>Overview of Recruitment</h3> with key highlights (Post Name, Total Vacancies, Organization, Qualification, Salary/Pay Scale, Application Start & End Dates).
         - <h3>Recruitment Details</h3> explaining the recruitment scope and authority.
         - <h3>Vacancy Details</h3> with exact breakdowns per post/department.
         - <h3>Eligibility Conditions</h3> including detailed Educational Qualifications and Age Limits (mentioning category-wise age relaxations: OBC/SC/ST/PwBD).
         - <h3>Documents Required</h3> needed for the application.
         - <h3>How to Apply</h3> step-by-step instructions.
         - <h3>Important Dates & Links</h3> with start date, deadline, official website, and application links.
         - <h3>Frequently Asked Questions (FAQs)</h3> with at least 3 relevant Q&As.
      `;
    }

    const prompt = `
      You are an expert data extractor and professional Assamese translator for a premier Jobs and Education Portal in Assam.
      Content Category: ${contentType}.
      Analyze the following scraped text and extract the key details required by the schema.
      If a field is not explicitly mentioned, provide a reasonable default (e.g. "Not Specified" or "Not Applicable").

      CRITICAL INSTRUCTIONS FOR DESCRIPTIONS:
      1. Structure both 'unique_description' and 'unique_description_assamese' with clear, comprehensive sections using <h3> or <h4> tags:
         ${sectionInstructions}
      2. Whenever there is structured data (e.g., Dates, Cut-offs, Vacancy Breakdowns, Fees, Schedules, Stipends), you MUST strictly format it as an HTML <table> with class "table-auto w-full mb-4 border-collapse border border-slate-300 dark:border-slate-700" with <thead>, <tbody>, <tr>, <th>, and <td> tags.
      3. Use <ul> and <li> for lists.
      4. Extract the Official Advertisement PDF link and Apply Online / Download link from the text into apply_url and official_pdf_url schema fields.
      5. The 'unique_description_assamese' MUST be an authentic, professional Assamese translation of the exact same structured layout, retaining all headings, lists, and tables without omitting anything.

      Do not output any Markdown wrapping like \`\`\`html or \`\`\`json.

      Website Text:
      ${rawText.substring(0, 15000)}
    `;

    await new Promise(res => setTimeout(res, 12000)); // Sleep 12s to respect RPM quota
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