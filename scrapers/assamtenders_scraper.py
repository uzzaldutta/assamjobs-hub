import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# We will scrape the latest active tenders from the official Assam e-Procurement portal
TARGET_URL = "https://assamtenders.gov.in/nicgep/app?page=FrontEndTendersByLocation&service=page"

async def scrape_tenders():
    logger.info("Starting Assam Tenders Scraper...")
    async with async_playwright() as p:
        # Launching with specific arguments to avoid bot detection
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
            
            # The site uses a table for tenders. Let's wait for the table.
            await page.wait_for_selector("table.list_table", timeout=15000)
            
            # Get the rows of the table (skipping header)
            rows = await page.locator("table.list_table tr.list_header ~ tr").all()
            logger.info(f"Found {len(rows)} tenders on the first page. Processing top 5...")
            
            scraped_tenders = []
            
            for i in range(min(5, len(rows))):
                row = rows[i]
                
                # Extract text from the row to send to AI
                row_text = await row.inner_text()
                logger.info(f"Extracted tender raw data: {row_text[:100]}...")
                
                # We need the link to the tender details to get the full context if possible, 
                # but the row itself has title, org, value, closing date!
                # The AI can extract a lot just from the row text!
                
                logger.info("Sending to AI for structuring and rewriting...")
                
                # Pass to AI - we'll tell it explicitly this is a tender
                prompt_context = f"This is raw data for a Government Tender from Assam. Please structure it as a TENDER. Raw data:\n{row_text}"
                safe_job_data = rewrite_and_extract_job(prompt_context, "https://assamtenders.gov.in/")
                
                if safe_job_data:
                    # Force it to be a tender just in case the AI gets confused
                    safe_job_data["type"] = "TENDER"
                    safe_job_data["job_type"] = "TENDER"
                    
                    scraped_tenders.append(safe_job_data)
                    logger.info("Successfully rewritten and extracted tender data!")
                    
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
                            logger.info("Successfully ingested TENDER into Next.js Database!")
                        else:
                            logger.error(f"Failed to ingest: {response.text}")
                    except Exception as req_err:
                        logger.error(f"Could not connect to Next.js server: {req_err}")
                
            return scraped_tenders
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_tenders())
    print("\n--- SAFE SCRAPED TENDERS ---")
    print(json.dumps(results, indent=2))
