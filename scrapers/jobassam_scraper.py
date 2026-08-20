import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URL = "https://jobassam.in/private-jobs-in-assam/"

async def scrape_jobassam_private():
    logger.info("Starting JobAssam Private Jobs Scraper...")
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
            
            # Wait for job links to appear (usually inside td tags or list items)
            # JobAssam often puts them in a table or blockquote
            await page.wait_for_selector("a", timeout=15000)
            
            # Extract links that contain 'jobassam.in' but are not category links
            all_links = await page.locator("a").all()
            job_links = []
            
            for link in all_links:
                href = await link.get_attribute("href")
                text = await link.inner_text()
                if href and "jobassam.in" in href and len(text.strip()) > 10:
                    if "private-jobs" not in href and "category" not in href:
                        job_links.append(href)
            
            # Remove duplicates while preserving order
            job_links = list(dict.fromkeys(job_links))
            
            logger.info(f"Found {len(job_links)} potential private job posts. Processing top 5...")
            
            scraped_jobs = []
            
            for i in range(min(5, len(job_links))):
                job_url = job_links[i]
                
                logger.info(f"Visiting Private Job Post: {job_url}")
                job_page = await context.new_page()
                try:
                    await job_page.goto(job_url, timeout=60000)
                    
                    # Extract text from the body
                    await job_page.wait_for_selector("body")
                    raw_text = await job_page.locator("body").inner_text()
                    
                    logger.info(f"Extracted raw text. Sending to AI for PRIVATE job rewrite...")
                    
                    # Pass to AI (forces rewriting as Private)
                    # We inject a hint to the raw text to ensure the AI knows it's private
                    safe_job_data = rewrite_and_extract_job("Hint: This is a PRIVATE JOB in Assam.\n" + raw_text, job_url)
                    
                    if safe_job_data:
                        # Force job_type to PRIVATE since this scraper targets private jobs
                        safe_job_data["job_type"] = "PRIVATE"
                        scraped_jobs.append(safe_job_data)
                        logger.info("Successfully rewritten private job data!")
                        
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
                                logger.info("Successfully ingested into Database!")
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
            logger.error(f"Error during JobAssam scraping: {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_jobassam_private())
    print("\n--- SAFE SCRAPED PRIVATE RESULTS ---")
    print(json.dumps(results, indent=2))
