const cheerio = require('cheerio');
async function inspectNHMRows() {
    const res = await fetch('https://nhmssd.assam.gov.in/eHRMIS_latest/Recruitments', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Find containers for each entry
    let count = 0;
    $('.col-10.bg-light').children('.row').each((i, row) => {
        if (count >= 3) return;
        const text = $(row).text().replace(/\s+/g, ' ').trim();
        if (text.length > 10) {
            console.log(`ROW ${count}: ${text}`);
            $(row).find('a').each((j, a) => {
                console.log(`  Link: ${$(a).text().trim()} -> ${$(a).attr('href')}`);
            });
            count++;
        }
    });
}
inspectNHMRows();
