import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URL = "https://in.indeed.com/jobs?q=private&l=Assam&sort=date"

async def scrape_indeed_assam():
    logger.info("Starting Indeed Private Jobs Scraper...")
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
            
            # Wait for job cards
            await page.wait_for_selector(".job_seen_beacon", timeout=15000)
            
            job_cards = await page.locator(".job_seen_beacon").all()
            logger.info(f"Found {len(job_cards)} Indeed job cards. Processing top 3...")
            
            scraped_jobs = []
            
            for i in range(min(3, len(job_cards))):
                card = job_cards[i]
                
                # Extract basic info
                title = await card.locator("h2.jobTitle").inner_text()
                company = await card.locator("[data-testid='company-name']").inner_text()
                location = await card.locator("[data-testid='text-location']").inner_text()
                
                # Click the card to load the description pane
                await card.click()
                await page.wait_for_selector("#jobsearch-ViewjobPaneWrapper", timeout=15000)
                await asyncio.sleep(2) # Give it time to load the iframe/details
                
                raw_text = await page.locator("#jobsearch-ViewjobPaneWrapper").inner_text()
                job_url = await page.url
                
                logger.info(f"Extracted Indeed job: {title} at {company}. Sending to AI...")
                
                # Build context for Gemini
                full_context = f"Hint: This is a PRIVATE JOB from Indeed in Assam.\nTitle: {title}\nCompany: {company}\nLocation: {location}\nDescription:\n{raw_text}"
                safe_job_data = rewrite_and_extract_job(full_context, job_url)
                
                if safe_job_data:
                    safe_job_data["job_type"] = "PRIVATE"
                    scraped_jobs.append(safe_job_data)
                    logger.info("Successfully rewritten Indeed job data!")
                    
                    # POST to Next.js API Route
                    import requests
                    try:
                        api_url = os.getenv("API_BASE_URL", "http://localhost:3000")
                        response = requests.post(
                            f"{api_url}/api/webhooks/ingest",
                            json=safe_job_data,
                            headers={"Authorization": "Bearer super-secret-key-123"}
                        )
                    except Exception as req_err:
                        logger.error(f"Could not connect to Next.js server: {req_err}")
                
            return scraped_jobs
            
        except Exception as e:
            logger.error(f"Error during Indeed scraping (Might be blocked by Cloudflare): {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_indeed_assam())
    print("\n--- SAFE SCRAPED INDEED RESULTS ---")
    print(json.dumps(results, indent=2))
