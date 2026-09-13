const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync("C:/Users/SONY/.gemini/antigravity/brain/c32e4699-7971-4328-8aa4-075b27288892/.system_generated/steps/16721/content.md", "utf8");
const $ = cheerio.load(html);

const title = $('h1.entry-title').text() || $('h2.entry-title').text() || $('title').text();
console.log("Title:", title.trim());

// Look for tables
$('figure.wp-block-table table').each((i, el) => {
    console.log("--- Table", i, "---");
    const headers = [];
    $(el).find('th').each((j, th) => headers.push($(th).text().trim()));
    console.log("Headers:", headers.join(" | "));
    
    $(el).find('tbody tr').each((j, tr) => {
        const row = [];
        $(tr).find('td').each((k, td) => {
            const text = $(td).text().replace(/\s+/g, ' ').trim();
            const link = $(td).find('a').attr('href');
            if (link && text.toLowerCase().includes('click here')) {
                row.push(`[Link: ${link}]`);
            } else {
                row.push(text);
            }
        });
        if(row.length > 0) console.log(row.join(" | "));
    });
});

