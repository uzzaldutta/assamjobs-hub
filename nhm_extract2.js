const cheerio = require('cheerio');
async function extractNHMDivs() {
    const res = await fetch('https://nhmssd.assam.gov.in/eHRMIS_latest/Recruitments', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    $('a[href$=".pdf"]').each((i, a) => {
        if (i < 3) {
            console.log(`PDF ${i}:`);
            console.log('Title:', $(a).text().trim());
            console.log('Grandparent text:', $(a).parent().parent().text().replace(/\s+/g, ' ').substring(0, 150));
        }
    });
}
extractNHMDivs();
