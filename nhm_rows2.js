const cheerio = require('cheerio');
async function inspectNHMRows() {
    const res = await fetch('https://nhmssd.assam.gov.in/eHRMIS_latest/Recruitments', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let count = 0;
    $('div.row').each((i, row) => {
        if (count >= 3) return;
        const text = $(row).text().replace(/\s+/g, ' ').trim();
        const links = $(row).find('a');
        if (links.length > 0 && text.length > 20) {
            console.log(`\nROW ${count}: ${text}`);
            links.each((j, a) => {
                console.log(`  Link: ${$(a).text().trim()} -> ${$(a).attr('href')}`);
            });
            count++;
        }
    });
}
inspectNHMRows();
