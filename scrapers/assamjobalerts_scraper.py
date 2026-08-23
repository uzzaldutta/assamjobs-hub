import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URL = "https://assamjobalerts.com/"

async def scrape_assamjobalerts():
    logger.info("Starting AssamJobAlerts Scraper...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled']
        )
        
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        page = await context.new_page()
        
        try:
            logger.info(f"Navigating to {TARGET_URL}")
            await page.goto(TARGET_URL, timeout=60000)
            
            # Wait for main page to load
            await page.wait_for_selector("a", timeout=15000)
            
            all_links = await page.locator("a").all()
            job_links = []
            
            for link in all_links:
                href = await link.get_attribute("href")
                text = await link.inner_text()
                if href and "assamjobalerts.com" in href and len(text.strip()) > 10:
                    if "category" not in href and "about" not in href and "contact" not in href:
                        job_links.append(href)
            
            # Remove duplicates while preserving order
            job_links = list(dict.fromkeys(job_links))
            
            logger.info(f"Found {len(job_links)} potential job posts. Processing top 5...")
            
            scraped_jobs = []
            
            for i in range(min(5, len(job_links))):
                job_url = job_links[i]
                
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
                        import requests
                        try:
                            api_url = os.getenv("API_BASE_URL", "http://localhost:3000")
                            response = requests.post(
                                f"{api_url}/api/webhooks/ingest",
                                json=safe_job_data,
                                headers={"Authorization": "Bearer super-secret-key-123"}
                            )
                            if response.status_code == 200:
                                logger.info("Successfully ingested into Next.js Database!")
                            else:
                                logger.error(f"Failed to ingest: {response.text}")
                        except Exception as req_err:
                            logger.error(f"Could not connect to Next.js server: {req_err}")
                except Exception as inner_err:
                    logger.error(f"Failed processing {job_url}: {inner_err}")
                finally:
                    await job_page.close()
                
            return scraped_jobs
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_assamjobalerts())
    print("\n--- SAFE SCRAPED RESULTS (COPYRIGHT-FREE) ---")
    print(json.dumps(results, indent=2))
