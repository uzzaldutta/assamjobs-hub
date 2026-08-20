const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const jobs = [
  {
    "title": "CSIR Technician (1) Recruitment 2026",
    "organization": "Council of Scientific & Industrial Research (CSIR)",
    "job_type": "GOVERNMENT",
    "category": "Central Government Jobs",
    "vacancies": "43",
    "qualification": "10th/SSC with Science (minimum 55%) + ITI/Trade Certificate in relevant trade",
    "district": "All India",
    "age_limit": "Maximum 28 years as on closing date",
    "application_fee": "Rs. 500/- for UR/OBC/EWS; Exempted for Women, SC, ST, PwBD, and Ex-Servicemen",
    "selection_process": "Screening, Computer Proficiency Test (CPT), and Merit Evaluation",
    "last_date": "2026-09-17",
    "official_pdf_url": "",
    "apply_url": "",
    "unique_description": "The Council of Scientific & Industrial Research (CSIR) has published an employment notification inviting applications for 43 Technician (1) Group II posts across various technical disciplines. Selected candidates will be placed in Pay Matrix Level 2 (Rs. 19,900 – Rs. 63,200/-). Candidates must have passed 10th/SSC with Science subjects securing at least 55% marks, along with an ITI or National/State Trade Certificate in relevant fields such as COPA, DTPO, CH&NM, MLT, Draughtsman, or Instrument Mechanic. Applicants should be under 28 years of age, with category-wise age relaxations available for SC/ST, OBC, and PwBD candidates as per Central Government norms.\n\nEligible individuals can submit their applications online starting from August 18, 2026, until the final deadline on September 17, 2026. A non-refundable application fee of Rs. 500 applies to General, OBC, and EWS applicants, whereas female candidates and those belonging to SC, ST, PwBD, and Ex-Servicemen categories are exempt from paying any fee. Applicants must ensure all necessary documentation and trade details are accurately uploaded on the CSIR portal before submitting the form.",
    "unique_description_assamese": "CSIR ৰ অধীনত প্ৰকাশ পোৱা এক শেহতীয়া বিজ্ঞাপন অনুসৰি ৪৩ টা টেকনিচিয়ান পদৰ বাবে আবেদন বিচৰা হৈছে।"
  },
  {
    "title": "Medical Officer (Ayurvedic) Recruitment",
    "organization": "National Ayush Mission, Assam",
    "job_type": "GOVERNMENT",
    "category": "Medical & Health",
    "vacancies": "315",
    "qualification": "BAMS Degree",
    "district": "All Assam",
    "age_limit": "Maximum 45 years",
    "application_fee": "None",
    "selection_process": "Interview",
    "last_date": "2026-08-30",
    "unique_description": "The National Ayush Mission (NAM), Assam has released an official recruitment notification for the engagement of 315 Medical Officers (Ayurvedic) under various health facilities across the state.",
    "unique_description_assamese": "ৰাষ্ট্ৰীয় আয়ুস মিছন, অসমৰ তৰফৰ পৰা ৩১৫ টা আয়ুৰ্বেদিক চিকিৎসা বিষয়াৰ পদৰ বাবে আবেদন আহ্বান কৰা হৈছে।"
  },
  {
    "title": "Gauhati University B.Ed CET Admit Card 2026",
    "organization": "Gauhati University",
    "job_type": "EXAM_UPDATE",
    "category": "University Updates",
    "vacancies": "N/A",
    "qualification": "Graduation",
    "district": "Guwahati",
    "age_limit": "None",
    "application_fee": "None",
    "selection_process": "Written Test",
    "last_date": "2026-08-25",
    "unique_description": "Gauhati University has officially released the Admit Cards for the B.Ed Common Entrance Test (CET) 2026. Candidates who successfully registered for the examination can now download their hall tickets from the official university portal.",
    "unique_description_assamese": "গুৱাহাটী বিশ্ববিদ্যালয়ৰ বি.এড প্ৰৱেশ পৰীক্ষাৰ এডমিট কাৰ্ড মুকলি কৰা হৈছে।"
  }
];

async function forceUpload() {
  const records = jobs.map(item => ({
    ...item,
    id: `forced_${Date.now()}_${Math.random()}`,
    scraped_at: new Date().toISOString()
  }));

  console.log("Uploading directly to Supabase...");
  const { error } = await supabase.from('jobs').insert(records);
  if (error) {
    console.error("Failed:", error);
  } else {
    console.log("Success! Data is now live.");
  }
}

forceUpload();
