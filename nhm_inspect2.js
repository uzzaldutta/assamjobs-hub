const cheerio = require('cheerio');
async function inspectNHM2() {
    console.log("Fetching https://nhmssd.assam.gov.in/eHRMIS_latest/Recruitments...");
    const res = await fetch('https://nhmssd.assam.gov.in/eHRMIS_latest/Recruitments', {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        },
        timeout: 10000
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    $('a').each((i, a) => {
        if(i < 15) console.log($(a).text().trim(), '->', $(a).attr('href'));
    });
    $('table tr').each((i, row) => {
        if(i < 5) console.log($(row).text().replace(/\s+/g, ' ').substring(0, 100));
    });
}
inspectNHM2();
