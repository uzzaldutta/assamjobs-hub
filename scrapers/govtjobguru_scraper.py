import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URL = "https://govtjobguru.in/govt-jobs-state-wise/government-jobs-in-assam/"

async def scrape_govtjobguru():
    logger.info("Starting GovtJobGuru Scraper...")
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
            
            # Wait for the table
            await page.wait_for_selector("table.tablepress tbody tr", timeout=15000)
            
            rows = await page.locator("table.tablepress tbody tr").all()
            logger.info(f"Found {len(rows)} job rows on GovtJobGuru. Processing top 10...")
            
            scraped_jobs = []
            
            for i in range(min(10, len(rows))):
                row = rows[i]
                
                # Extract text and link
                row_text = await row.inner_text()
                
                # Try to get the official details link from the 6th column (Details)
                official_link = TARGET_URL
                try:
                    official_link_element = row.locator("td.column-6 a")
                    if await official_link_element.count() > 0:
                        official_link = await official_link_element.get_attribute("href")
                except Exception as link_e:
                    logger.warning(f"Could not extract official link for row {i}: {link_e}")
                
                prompt_context = f"This is data from GovtJobGuru table row:\n{row_text}\n\nOfficial Link: {official_link}"
                logger.info(f"Extracted {len(prompt_context)} characters. Sending to AI...")
                
                safe_job_data = rewrite_and_extract_job(prompt_context, official_link)
                
                if safe_job_data:
                    scraped_jobs.append(safe_job_data)
                    logger.info("Successfully rewritten and extracted GovtJobGuru data!")
                    
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
                
            return scraped_jobs
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_govtjobguru())
    print("\n--- SAFE SCRAPED GOVTJOBGURU RESULTS ---")
    print(json.dumps(results, indent=2))
