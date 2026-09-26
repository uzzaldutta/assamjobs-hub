export async function proxyFetch(url: string, options: any = {}) {
  const scraperApiKey = process.env.SCRAPER_API_KEY;
  if (scraperApiKey) {
    const targetUrl = encodeURIComponent(url);
    const proxyUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${targetUrl}`;
    return fetch(proxyUrl, options);
  }
  return fetch(url, options);
}