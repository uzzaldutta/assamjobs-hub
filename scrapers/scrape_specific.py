import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
import requests
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URLS = [
    "https://assamjobalerts.com/powergrid-recruitment",
    "https://assamjobalerts.com/kaac-recruitment"
]

async def scrape_specific():
    logger.info("Starting Specific Scraper for user requested feeds...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled']
        )
        
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        scraped_jobs = []
        
        for job_url in TARGET_URLS:
            logger.info(f"Visiting Job Post: {job_url}")
            job_page = await context.new_page()
            try:
                await job_page.goto(job_url, timeout=60000)
                
                # Extract all text from the body
                await job_page.wait_for_selector("body")
                raw_text = await job_page.locator("body").inner_text()
                
                logger.info(f"Extracted raw text. Sending to AI for rewrite...")
                
                safe_job_data = rewrite_and_extract_job(raw_text, job_url)
                
                if safe_job_data:
                    scraped_jobs.append(safe_job_data)
                    logger.info("Successfully rewritten and extracted job data!")
                    
                    # POST to Next.js API Route
                    try:
                        api_url = os.getenv("API_BASE_URL", "http://localhost:3005")
                        response = requests.post(
                            f"{api_url}/api/webhooks/ingest",
                            json=safe_job_data,
                            headers={"Authorization": "Bearer super-secret-key-123"}
                        )
                        if response.status_code == 200:
                            logger.info(f"Successfully ingested {job_url} into Next.js Database!")
                        else:
                            logger.error(f"Failed to ingest {job_url}: {response.text}")
                    except Exception as req_err:
                        logger.error(f"Could not connect to Next.js server: {req_err}")
            except Exception as inner_err:
                logger.error(f"Failed processing {job_url}: {inner_err}")
            finally:
                await job_page.close()
            
        await browser.close()
        return scraped_jobs

if __name__ == "__main__":
    results = asyncio.run(scrape_specific())
    print("\n--- DONE SCRAPING SPECIFIC FEEDS ---")
