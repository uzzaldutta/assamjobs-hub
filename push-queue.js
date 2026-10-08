const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function pushFromQueue() {
    // Get latest 10 valid jobs from queue that aren't duplicates
    const { data: queueItems } = await supabase.from('ingestion_queue')
        .select('*')
        .eq('status', 'LOW_QUALITY') // The old ones were marked LOW_QUALITY because they didn't have govt keywords
        .limit(10);
        
    if (!queueItems || queueItems.length === 0) return console.log("No items found");
    
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
    
    for (const item of queueItems) {
        try {
            const payload = item.normalized_payload;
            console.log('Processing:', payload.title);
            
            const prompt = Rewrite this job posting comprehensively into HTML. Use <h3> tags, <ul>, and STRICTLY use HTML <table> for all structured data (Important Dates, Vacancies, Fees). Set table classes to "table-auto w-full mb-4 border-collapse border border-slate-300". Translate perfectly to Assamese. DO NOT use Markdown wrappers like \\\html. Data:  + JSON.stringify(payload).substring(0, 10000);
            
            const result = await model.generateContent({ 
                contents: [{ role: 'user', parts: [{ text: prompt }] }], 
                generationConfig: { 
                    responseMimeType: 'application/json', 
                    responseSchema: { 
                        type: require('@google/generative-ai').SchemaType.OBJECT, 
                        properties: { 
                            unique_description: { type: require('@google/generative-ai').SchemaType.STRING }, 
                            unique_description_assamese: { type: require('@google/generative-ai').SchemaType.STRING } 
                        }, 
                        required: ['unique_description', 'unique_description_assamese'] 
                    } 
                }
            });
            
            const aiData = JSON.parse(result.response.text());
            
            // Insert into jobs
            await supabase.from('jobs').insert({
                title: payload.title,
                organization: payload.organization,
                unique_description: aiData.unique_description,
                unique_description_assamese: aiData.unique_description_assamese,
                apply_url: payload.applyUrl,
                official_source_url: payload.notificationUrl || payload.sourceUrl,
                last_date: payload.applicationEnd,
                vacancies: payload.vacancy,
                qualification: payload.qualification,
                district: payload.district,
                status: 'PUBLISHED'
            });
            
            // Mark queue item as approved
            await supabase.from('ingestion_queue').update({ status: 'APPROVED' }).eq('id', item.id);
            console.log('Pushed!');
        } catch (e) {
            console.log('Error', e.message);
        }
    }
}
pushFromQueue();