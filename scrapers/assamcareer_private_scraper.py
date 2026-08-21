import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URL = "https://www.assamcareer.com/search/label/Private%20Job"

async def scrape_assamcareer_private():
    logger.info("Starting AssamCareer PRIVATE Jobs Scraper...")
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
            
            await page.wait_for_selector(".post-title a", timeout=15000)
            
            job_links = await page.locator(".post-title a").all()
            logger.info(f"Found {len(job_links)} private job posts. Processing top 10...")
            
            scraped_jobs = []
            
            for i in range(min(10, len(job_links))):
                link_element = job_links[i]
                job_url = await link_element.get_attribute("href")
                
                logger.info(f"Visiting Private Job Post: {job_url}")
                job_page = await context.new_page()
                await job_page.goto(job_url, timeout=60000)
                
                await job_page.wait_for_selector(".post-body")
                raw_text = await job_page.locator(".post-body").inner_text()
                
                # Prepend a hint to ensure the AI knows this is a private job
                prompt_context = f"[HINT: THIS IS A PRIVATE SECTOR JOB IN ASSAM]\n\n{raw_text}"
                
                logger.info(f"Extracted {len(raw_text)} characters. Sending to AI...")
                
                safe_job_data = rewrite_and_extract_job(prompt_context, job_url)
                
                if safe_job_data:
                    # Force it to be PRIVATE just to be safe
                    safe_job_data["type"] = "PRIVATE"
                    
                    scraped_jobs.append(safe_job_data)
                    logger.info("Successfully rewritten and extracted private job data!")
                    
                    import requests
                    try:
                        api_url = os.getenv("API_BASE_URL", "http://localhost:3000")
                        response = requests.post(
                            f"{api_url}/api/webhooks/ingest",
                            json=safe_job_data,
                            headers={"Authorization": "Bearer super-secret-key-123"}
                        )
                        if response.status_code == 200:
                            logger.info("Successfully ingested PRIVATE JOB into Next.js Database!")
                        else:
                            logger.error(f"Failed to ingest: {response.text}")
                    except Exception as req_err:
                        logger.error(f"Could not connect to Next.js server: {req_err}")
                
                await job_page.close()
                
            return scraped_jobs
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_assamcareer_private())
    print("\n--- SAFE SCRAPED PRIVATE RESULTS ---")
    print(json.dumps(results, indent=2))
