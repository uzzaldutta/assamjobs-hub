import * as cheerio from "cheerio";

const urls = [
  "https://thejobinassam.in/",
  "https://careerasom.in",
  "https://assamjobtoday.com",
  "https://www.assamopenings.com/"
];

async function checkSites() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  for (const u of urls) {
    try {
      console.log(`\n--- Fetching ${u} ---`);
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const entryTitles = $('.entry-title a').length;
      const postTitles = $('.post-title a').length;
      const titleTags = $('h2 a').length;
      const titleTagsH3 = $('h3 a').length;
      
      console.log(`Title Selectors found - .entry-title: ${entryTitles}, .post-title: ${postTitles}, h2 a: ${titleTags}, h3 a: ${titleTagsH3}`);
      
      if (entryTitles > 0) {
        console.log("Example:", $('.entry-title a').first().text().trim());
      } else if (titleTags > 0) {
        console.log("Example (h2):", $('h2 a').first().text().trim());
      } else if (titleTagsH3 > 0) {
        console.log("Example (h3):", $('h3 a').first().text().trim());
      }
    } catch(e) {
      console.log(`Failed to fetch ${u}:`, e.message);
    }
  }
}
checkSites();
