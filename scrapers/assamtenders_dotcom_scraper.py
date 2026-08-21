import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URL = "https://www.assamtenders.com/"

async def scrape_assamtenders_dotcom():
    logger.info("Starting assamtenders.com Scraper...")
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
            
            # Tenders are usually links with 'Tenderdetailbrief.aspx' in href
            await page.wait_for_selector('a[href*="Tenderdetailbrief.aspx"]', timeout=15000)
            
            tender_links = await page.locator('a[href*="Tenderdetailbrief.aspx"]').all()
            logger.info(f"Found {len(tender_links)} tender links. Processing top 10...")
            
            scraped_tenders = []
            
            for i in range(min(10, len(tender_links))):
                link_element = tender_links[i]
                
                # Extract text directly from the link since we can't login to see details
                raw_text = await link_element.inner_text()
                href = await link_element.get_attribute("href")
                
                if not href.startswith('http'):
                    href = "https://www.assamtenders.com/" + href.lstrip('/')
                
                if len(raw_text) < 15:
                    continue # Skip empty or short links
                    
                prompt_context = f"[HINT: THIS IS A GOVERNMENT TENDER FROM ASSAMTENDERS.COM]\n\nTitle: {raw_text}\nLink: {href}"
                
                logger.info(f"Extracted tender text: {raw_text[:50]}... Sending to AI...")
                
                safe_job_data = rewrite_and_extract_job(prompt_context, href)
                
                if safe_job_data:
                    # Force it to be a tender
                    safe_job_data["type"] = "TENDER"
                    safe_job_data["job_type"] = "TENDER"
                    
                    scraped_tenders.append(safe_job_data)
                    logger.info("Successfully rewritten and extracted tender data!")
                    
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
    results = asyncio.run(scrape_assamtenders_dotcom())
    print("\n--- SAFE SCRAPED TENDERS RESULTS ---")
    print(json.dumps(results, indent=2))
