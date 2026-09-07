import * as cheerio from 'cheerio';

async function explore() {
  const url = "https://assam.indgovtjobs.net/category/railway-jobs/";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const links = [];
  $('a').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && href && (text.toLowerCase().includes('railway') || text.toLowerCase().includes('rrb') || text.toLowerCase().includes('nfr') || href.includes('railway'))) {
          links.push({ text, href });
      }
  });
  console.log("Category links found:", links.slice(0, 10));
}
explore();
