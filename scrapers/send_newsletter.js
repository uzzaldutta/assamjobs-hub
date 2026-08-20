require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.API_BASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

async function sendNewsletter() {
  console.log("=== STARTING WEEKLY NEWSLETTER JOB ===");
  
  // 1. Fetch subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('email, type')
    .eq('type', 'email');
    
  if (subError || !subscribers || subscribers.length === 0) {
    console.log("No subscribers found or error fetching them.");
    return;
  }
  console.log(`Found ${subscribers.length} subscribers.`);

  // 2. Fetch jobs from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: jobs, error: jobError } = await supabase
    .from('jobs')
    .select('id, title, organization, district, vacancies, job_type')
    .gte('scraped_at', sevenDaysAgo.toISOString())
    .order('scraped_at', { ascending: false })
    .limit(15);
    
  if (jobError || !jobs || jobs.length === 0) {
    console.log("No new jobs found this week to send.");
    return;
  }
  console.log(`Found ${jobs.length} recent jobs.`);

  // 3. Build HTML Email
  let jobCardsHtml = "";
  jobs.forEach(job => {
    let color = "#10b981"; // Govt green
    if (job.job_type === "PRIVATE") color = "#3b82f6"; // Private blue
    if (job.job_type === "TENDER") color = "#f97316"; // Tender orange
    
    jobCardsHtml += `
      <div style="background: white; border: 1px solid #e2e8f0; border-left: 4px solid ${color}; border-radius: 8px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <h3 style="margin: 0 0 4px 0; color: #1e293b; font-size: 16px;">${job.title}</h3>
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">🏢 ${job.organization} | 📍 ${job.district || "Assam"} | 👥 ${job.vacancies || "Multiple"} Posts</p>
        <a href="https://assamjobs-hub.vercel.app/jobs/${job.id}" style="display: inline-block; padding: 6px 12px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold;">View Details & Apply &rarr;</a>
      </div>
    `;
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin-bottom: 4px;">AssamJobs Hub <span style="color: #059669;">& TENDERS</span></h1>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Your Weekly Job & Tender Updates</p>
      </div>
      
      <p style="color: #334155; font-size: 15px;">Hello!</p>
      <p style="color: #334155; font-size: 15px;">Here are the top trending jobs, exams, and tenders posted in Assam this week. Don't miss out on these opportunities:</p>
      
      <div style="margin-top: 24px;">
        ${jobCardsHtml}
      </div>
      
      <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #cbd5e1;">
        <a href="https://assamjobs-hub.vercel.app" style="color: #4f46e5; text-decoration: none; font-weight: bold;">View All Jobs on Website</a>
        <p style="color: #94a3b8; font-size: 11px; margin-top: 12px;">You received this because you subscribed to alerts on AssamJobs Hub.</p>
      </div>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const emailList = subscribers.map(s => s.email).filter(Boolean);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
    return;
  }

  const mailOptions = {
    from: '"AssamJobs Hub" <' + process.env.EMAIL_USER + '>',
    bcc: emailList.join(','), // Use BCC so users don't see each other's emails
    subject: `🔥 ${jobs.length} New Jobs & Tenders in Assam This Week!`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Newsletter sent successfully! Message ID: " + info.messageId);
  } catch (error) {
    console.error("Error sending newsletter:", error);
  }
}

sendNewsletter();
