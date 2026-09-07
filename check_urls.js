const cheerio = require('cheerio');

async function checkUrl(url) {
    console.log(`\nFetching ${url}...`);
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'AssamJobsHub-Bot/1.0', 'Accept': 'text/html' }, timeout: 5000 });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const $ = cheerio.load(html);
        console.log(`Success! Title: ${$('title').text().trim()}`);
        
        let linkCount = 0;
        $('a').each((i, a) => {
            if ($(a).text().toLowerCase().includes('pdf') || $(a).attr('href')?.includes('.pdf')) linkCount++;
        });
        console.log(`Found ${linkCount} PDF links.`);
        return true;
    } catch (e) {
        console.log(`Failed: ${e.message}`);
        return false;
    }
}

async function run() {
    await checkUrl('https://nhm.assam.gov.in/portlets/recruitment');
    await checkUrl('https://employment.assam.gov.in');
    await checkUrl('https://employment.assam.gov.in/portlets/recruitment');
}
run();
