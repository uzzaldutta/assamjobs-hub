const cheerio = require('cheerio');
async function inspectNHM() {
    const res = await fetch('https://nhm.assam.gov.in/portlets/recruitment');
    const html = await res.text();
    const $ = cheerio.load(html);
    console.log("Looking at main content...");
    $('.view-content a').each((i, a) => {
        if(i < 10) console.log($(a).text().trim(), '->', $(a).attr('href'));
    });
    console.log("\nLooking at tables...");
    $('table tr').each((i, row) => {
        if(i < 5) console.log($(row).text().replace(/\s+/g, ' ').substring(0, 80));
    });
}
inspectNHM();
