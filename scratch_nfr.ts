import * as cheerio from 'cheerio';
import fs from 'fs';

async function fetchNFR() {
  const url = 'https://nfr.indianrailways.gov.in/view_section.jsp?fontColor=black&backgroundColor=LIGHTSTEELBLUE&lang=0&id=0,6,592,593,596';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const jobs: any[] = [];
  
  // NFR lists items typically in an unstructured content div
  // Let's just find all anchor tags inside the main content area (usually `#body_content` or similar, or just all `a`)
  $('a').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    const href = $(el).attr('href');
    
    if (href && (href.includes('.pdf') || href.includes('uploads'))) {
      if (text.length > 5 && !jobs.some(j => j.title === text)) {
        jobs.push({ title: text, url: href.startsWith('http') ? href : `https://nfr.indianrailways.gov.in/${href}` });
      }
    }
  });
  
  fs.writeFileSync('nfr_test.json', JSON.stringify(jobs.slice(0, 20), null, 2));
}

fetchNFR();
