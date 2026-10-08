const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fixAI() {
    const { data: jobs } = await supabase.from('jobs').select('id, title, unique_description').is('unique_description_assamese', null).not('unique_description', 'is', null).limit(40);
    if (!jobs || jobs.length === 0) { console.log('All jobs fixed!'); return; }
    
    console.log('Found ' + jobs.length + ' jobs to fix.');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    for (const job of jobs) {
        try {
            console.log('Fixing: ' + job.title);
            const prompt = 'Rewrite this job posting comprehensively into HTML. Use <h3> tags, <ul>, and STRICTLY use HTML <table> for all structured data (Important Dates, Vacancies, Fees). Set table classes to "table-auto w-full mb-4 border-collapse border border-slate-300". Translate perfectly to Assamese. DO NOT use Markdown wrappers like `html. Data: ' + String(job.unique_description).substring(0, 10000);
            
            const result = await model.generateContent({ 
                contents: [{ role: 'user', parts: [{ text: prompt }] }], 
                generationConfig: { 
                    responseMimeType: 'application/json', 
                    responseSchema: { 
                        type: SchemaType.OBJECT, 
                        properties: { 
                            unique_description: { type: SchemaType.STRING }, 
                            unique_description_assamese: { type: SchemaType.STRING } 
                        }, 
                        required: ['unique_description', 'unique_description_assamese'] 
                    } 
                }
            });
            
            const aiData = JSON.parse(result.response.text());
            if (aiData.unique_description) { 
                await supabase.from('jobs').update({ 
                    unique_description: aiData.unique_description, 
                    unique_description_assamese: aiData.unique_description_assamese 
                }).eq('id', job.id); 
                console.log('OK'); 
            }
        } catch (e) { console.log('Error', job.title, e.message); }
    }
}
fixAI();