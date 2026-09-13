const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const cheerio = require("cheerio");
const fs = require("fs");

dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log("Fetching IAF admit card...");
    let content = await fetch("https://jobassamhub.com/2026/09/12/iaf-agniveer-vayu-admit-card-2026/", { headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' } });
    if (!content.ok) { console.log("Failed to fetch"); return; }
    let html = await content.text();
    
    const $ = cheerio.load(html);
    const title = $('h1.entry-title').text() || $('h2.entry-title').text() || $('title').text();
    let description = "";
    let notificationUrl = "";
    let applyUrl = "";
    let lastDate = "";
    
    $('figure.wp-block-table table').each((i, el) => {
        const headers = [];
        $(el).find('th').each((j, th) => headers.push($(th).text().trim()));
        
        if (headers.length > 0) {
            description += `| ${headers.join(" | ")} |\n`;
            description += `| ${headers.map(() => '---').join(' | ')} |\n`;
        }
        
        $(el).find('tbody tr').each((j, tr) => {
            const row = [];
            $(tr).find('td').each((k, td) => {
                const text = $(td).text().replace(/\s+/g, ' ').trim();
                const link = $(td).find('a').attr('href');
                if (link && text.toLowerCase().includes('click here')) {
                    row.push(`[Click Here](${link})`);
                    if ($(td).prev().text().toLowerCase().includes('notification')) notificationUrl = link;
                    if ($(td).prev().text().toLowerCase().includes('apply') || $(td).prev().text().toLowerCase().includes('online')) applyUrl = link;
                } else {
                    row.push(text);
                    if (text && $(td).prev().text().toLowerCase().includes('last date')) {
                        lastDate = text;
                    }
                }
            });
            if(row.length > 0) {
                if (headers.length === 0 && j === 0) {
                    description += `| ${row.map((_, idx) => `Col ${idx+1}`).join(" | ")} |\n`;
                    description += `| ${row.map(() => '---').join(' | ')} |\n`;
                }
                description += `| ${row.join(" | ")} |\n`;
            }
        });
        description += "\n\n";
    });
    
    console.log("Title:", title);
    
    let payload = {
        id: `scraped_${Date.now()}_${Math.random()}`,
        title: title.replace(" - Job Assam Hub", "").trim(),
        organization: "Indian Air Force",
        job_type: "ADMIT_CARD",
        category: 'DEFENCE',
        unique_description: description,
        apply_url: applyUrl || null,
        official_pdf_url: notificationUrl || null,
        last_date: lastDate || null,
        status: 'PUBLISHED',
        verification_status: 'VERIFIED',
        official_source_url: "https://jobassamhub.com/2026/09/12/iaf-agniveer-vayu-admit-card-2026/"
    };
    
    const { error } = await supabase.from('jobs').insert(payload);
    if(error) console.log("Insert Error:", error);
    else console.log("Successfully inserted IAF admit card!");
}
run();
