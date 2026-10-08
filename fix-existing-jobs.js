const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixExistingJobs() {
    console.log("Fetching jobs with null descriptions...");
    const { data: jobs, error: jobErr } = await supabase
        .from('jobs')
        .select('id, title, unique_description')
        .is('unique_description', null);

    if (jobErr) {
        console.error("Failed to fetch jobs:", jobErr);
        return;
    }
    
    if (!jobs || jobs.length === 0) {
        console.log("No jobs found with missing descriptions.");
        return;
    }

    console.log("Found " + jobs.length + " jobs with missing descriptions. Checking queue for payloads...");

    let updatedCount = 0;

    for (const job of jobs) {
        const { data: qItem, error: qErr } = await supabase
            .from('ingestion_queue')
            .select('normalized_payload')
            .eq('id', job.id)
            .single();
            
        if (qErr || !qItem || !qItem.normalized_payload) {
            console.log("Skipping job " + job.title + " - No queue payload found.");
            continue;
        }
        
        const html = qItem.normalized_payload.description;
        
        if (html) {
            const { error: updateErr } = await supabase
                .from('jobs')
                .update({ unique_description: html })
                .eq('id', job.id);
                
            if (updateErr) {
                console.error("Failed to update job:", updateErr);
            } else {
                updatedCount++;
                console.log("Fixed description for: " + job.title);
            }
        }
    }
    
    console.log("Success! Updated " + updatedCount + " jobs with missing descriptions.");
}

fixExistingJobs();