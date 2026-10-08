const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const schema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "title" },
        organization: { type: SchemaType.STRING, description: "org" },
        job_type: { type: SchemaType.STRING, description: "type" },
        category: { type: SchemaType.STRING, description: "cat" },
        vacancies: { type: SchemaType.STRING, description: "vac" },
        district: { type: SchemaType.STRING, description: "dist" },
        ageLimit: { type: SchemaType.STRING, description: "age" },
        qualification: { type: SchemaType.STRING, description: "qual" },
        unique_description: {
          type: SchemaType.STRING,
          description: "A comprehensive HTML-formatted description of the job. You MUST use HTML tags like <h3> for headings, <ul><li> for lists, and beautifully formatted HTML <table> structures to display things like Important Dates, Vacancy details, Application Fees, etc."
        },
        unique_description_assamese: {
          type: SchemaType.STRING,
          description: "A professional Assamese translation of the unique_description, also using HTML tags and HTML tables."
        },
        apply_url: { type: SchemaType.STRING, description: "apply" },
        official_pdf_url: { type: SchemaType.STRING, description: "pdf" }
      },
      required: ["unique_description", "unique_description_assamese"]
};

async function fixAI() {
    console.log("Fetching jobs without Assamese translations...");
    const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, unique_description')
        .is('unique_description_assamese', null)
        .not('unique_description', 'is', null)
        .limit(20);

    if (!jobs || jobs.length === 0) {
        console.log("No jobs found!");
        return;
    }

    console.log('Found ' + jobs.length + ' jobs to process.');

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    for (const job of jobs) {
        try {
            console.log('Processing: ' + job.title);
            
            const prompt = 
              You are an expert data extractor and professional Assamese translator for a premier Jobs Portal.
              Analyze the following scraped job posting text and extract the key details required by the schema.

              CRITICAL INSTRUCTIONS FOR DESCRIPTIONS:
              1. Make the 'unique_description' EXTREMELY COMPREHENSIVE. Extract absolutely everything.
              2. Use <h3> or <h4> tags for clear section headings. 
              3. CRITICAL: Whenever there is structured data, strictly format it as an HTML <table>. 
              4. Ensure all tables have the class name "table-auto w-full mb-4 border-collapse border border-slate-300 dark:border-slate-700".
              5. Use <ul> and <li> for standard lists like eligibility criteria or educational qualifications.
              6. The 'unique_description_assamese' MUST be a direct, professional Assamese language translation of the exact same HTML layout. Do not drop any tables or formatting.

              Website Text:
               + job.unique_description.substring(0, 15000);

            const result = await model.generateContent({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
              },
            });
            
            const aiData = JSON.parse(result.response.text());
            
            if (aiData.unique_description && aiData.unique_description_assamese) {
                await supabase.from('jobs').update({
                    unique_description: aiData.unique_description,
                    unique_description_assamese: aiData.unique_description_assamese
                }).eq('id', job.id);
                console.log('SUCCESS: ' + job.title);
            } else {
                console.log('FAIL (Missing Data): ' + job.title);
            }

        } catch (e) {
            console.error('ERROR on ' + job.title + ': ' + e.message);
        }
    }
}

fixAI();