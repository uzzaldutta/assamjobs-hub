import * as cheerio from 'cheerio';

async function test() {
  const url = "https://assam.indgovtjobs.net/category/railway-jobs/";
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Dump all anchor tags just to see what we have
    const links = [];
    $('a').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.toLowerCase().includes('railway') || text.toLowerCase().includes('rrb')) {
            links.push({ text, href: $(el).attr('href') });
        }
    });
    console.log(links.slice(0, 10));
  } catch (err) { }
}
test();
