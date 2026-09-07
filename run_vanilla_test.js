const cheerio = require('cheerio');

async function testSource(name, url) {
    console.log(`\n================ Testing ${name} ================`);
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const $ = cheerio.load(html);
        
        const keywords = ['recruit', 'advertisement', 'notice', 'apply', 'vacancy', 'admit card', 'result', 'tender', 'admission'];
        let count = 0;
        
        $('a').each((i, el) => {
            if (count >= 15) return;
            const title = $(el).text().trim().replace(/\s+/g, ' ');
            const link = $(el).attr('href');
            if (!title || !link || title.length < 5) return;
            
            const titleLower = title.toLowerCase();
            const linkLower = link.toLowerCase();
            const isMatch = keywords.some(kw => titleLower.includes(kw) || linkLower.includes(kw)) || linkLower.endsWith('.pdf');
            
            if (isMatch) {
               const absoluteHref = link.startsWith('http') ? link : new URL(link, url).href;
               
               let detectedType = 'JOB';
               if (titleLower.includes('result') || titleLower.includes('merit list') || titleLower.includes('selected')) detectedType = 'RESULT';
               else if (titleLower.includes('admit card') || titleLower.includes('call letter') || titleLower.includes('hall ticket')) detectedType = 'ADMIT_CARD';
               else if (titleLower.includes('admission')) detectedType = 'ADMISSION';
               else if (titleLower.includes('scholarship')) detectedType = 'SCHOLARSHIP';
               else if (titleLower.includes('tender') || titleLower.includes('e-procurement')) detectedType = 'TENDER';
               
               console.log(`\n--- Item ${count + 1} ---`);
               console.log(`Raw Title: ${title}`);
               console.log(`Content Type: ${detectedType}`);
               console.log(`Notification URL: ${absoluteHref}`);
               count++;
            }
        });
        if (count === 0) {
            console.log("No valid entries discovered on root page. Needs tuning or deep scraping.");
        }
    } catch (err) {
        console.error(`Error testing ${name}:`, err.message);
    }
}

async function run() {
    await testSource('Employment Assam', 'https://employment.assam.gov.in');
    await testSource('NHM Assam', 'https://nhm.assam.gov.in');
}

run();
