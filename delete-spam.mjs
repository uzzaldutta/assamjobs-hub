import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://smpedqhskoamagndfbfc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteSpam() {
  console.log("Fetching all jobs to check for spam...");
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title');

  if (error) {
    console.error("Error fetching jobs:", error);
    return;
  }

  const spamKeywords = ["jobassam", "image combiner", "calculator tool", "bio-data maker"];
  
  const spamIds = jobs
    .filter(job => {
      const titleLower = (job.title || "").toLowerCase();
      return spamKeywords.some(keyword => titleLower.includes(keyword));
    })
    .map(j => j.id);

  console.log(`Found ${spamIds.length} spam jobs.`);

  if (spamIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .in('id', spamIds);
      
    if (deleteError) {
      console.error(`Failed to bulk delete:`, deleteError);
    } else {
      console.log(`Successfully deleted ${spamIds.length} spam jobs.`);
    }
  }
  
  console.log("Cleanup complete!");
  process.exit(0);
}

deleteSpam();
