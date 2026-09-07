import * as cheerio from 'cheerio';

async function test() {
  const url = "https://assam.indgovtjobs.net/category/railway-jobs/";
  try {
    const res = await fetch(url);
    if (!res.ok) {
        console.log("Fetch failed", res.status);
        return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const links = [];
    $('h2.entry-title a, h3.entry-title a, h2.title a, h3.title a, .post-title a, .title a').each((_, el) => {
      links.push({
        title: $(el).text().trim(),
        url: $(el).attr('href')
      });
    });
    
    console.log("Links found:", links);
  } catch (err) {
      console.log("Error:", err);
  }
}
test();
