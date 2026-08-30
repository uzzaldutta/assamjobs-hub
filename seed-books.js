const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const transcriptPath = 'C:\\Users\\SONY\\.gemini\\antigravity\\brain\\c32e4699-7971-4328-8aa4-075b27288892\\.system_generated\\logs\\transcript_full.jsonl';

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);

let targetContent = null;
for (let i = lines.length - 1; i >= 0; i--) {
  const data = JSON.parse(lines[i]);
  if (data.source === 'USER_EXPLICIT' && data.content && data.content.length > 10000) {
    targetContent = data.content;
    break;
  }
}

if (!targetContent) {
  console.log("Could not find the massive HTML message.");
  process.exit(1);
}

const htmlBlocks = targetContent.split('<!DOCTYPE html>').slice(1);
console.log(`Found ${htmlBlocks.length} HTML books.`);

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function upload() {
  for (let i = 0; i < htmlBlocks.length; i++) {
    const html = '<!DOCTYPE html>\n' + htmlBlocks[i];
    
    // Extract title
    let title = "Study Material " + (i+1);
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(' – Assam Entrance Exams', '').replace(' | Assam Job Hub', '').replace(' — Complete Study Guide for Competitive Exams', '').replace(' – Competitive Exam Book', '').trim();
    }
    
    // Determine subject based on title
    let subject = "OTHER";
    const tLower = title.toLowerCase();
    if (tLower.includes('history') && tLower.includes('assam')) subject = 'ASSAM_GK';
    else if (tLower.includes('history')) subject = 'HISTORY';
    else if (tLower.includes('polity')) subject = 'POLITY';
    else if (tLower.includes('economic')) subject = 'ECONOMICS';
    
    const jobData = {
      title: title,
      organization: "Assam Job Hub",
      job_type: subject, // Using job_type as the Subject category
      category: "STUDY_MATERIAL",
      unique_description: html,
      district: "All Assam",
      vacancies: "",
      qualification: "",
      age_limit: "",
      application_fee: "",
      selection_process: "",
      last_date: ""
    };
    
    const { error } = await supabase.from('jobs').insert([jobData]);
    if (error) {
      console.error("Error inserting " + title, error);
    } else {
      console.log("Successfully inserted: " + title + " as " + subject);
    }
  }
}

upload();
