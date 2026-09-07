const cheerio = require('cheerio');
async function extractNHMTable() {
    const res = await fetch('https://nhmssd.assam.gov.in/eHRMIS_latest/Recruitments', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Looks like the data might not be in a table? Let's check div structures.
    if ($('table').length > 0) {
        $('table tr').each((i, row) => {
            if (i < 3) console.log(`TR ${i}:`, $(row).text().replace(/\s+/g, ' ').substring(0, 150));
        });
    } else {
        console.log("No table found. Classes in body:", $('body').find('div').map((i, el) => $(el).attr('class')).get().slice(0, 10));
        // let's look at the elements surrounding the PDFs
        $('a[href$=".pdf"]').each((i, a) => {
            if (i < 3) console.log(`PDF ${i}:`, $(a).text().trim(), 'Parent text:', $(a).parent().text().replace(/\s+/g, ' ').substring(0, 100));
        });
    }
}
extractNHMTable();
