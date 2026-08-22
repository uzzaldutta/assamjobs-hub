import asyncio
from playwright.async_api import async_playwright
import logging
import json
import os
from ai_rewriter import rewrite_and_extract_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TARGET_URL = "https://www.sarkariresult.com/admission/"

async def scrape_admissions():
    logger.info("Starting All-India Admissions Scraper...")
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
            
            # Wait for admission links to appear
            await page.wait_for_selector("a", timeout=15000)
            
            # Extract links inside the post box
            all_links = await page.locator("a").all()
            admission_links = []
            
            for link in all_links:
                href = await link.get_attribute("href")
                text = await link.inner_text()
                if href and "sarkariresult.com" in href and len(text.strip()) > 5:
                    if "admission" in href or "online" in href or "form" in href:
                        admission_links.append(href)
            
            # Remove duplicates while preserving order
            admission_links = list(dict.fromkeys(admission_links))
            
            logger.info(f"Found {len(admission_links)} potential admission posts. Processing top 5...")
            
            scraped_admissions = []
            
            for i in range(min(5, len(admission_links))):
                admission_url = admission_links[i]
                
                # Make sure it's a full URL
                if not admission_url.startswith("http"):
                    continue
                    
                logger.info(f"Visiting Admission Post: {admission_url}")
                admission_page = await context.new_page()
                try:
                    await admission_page.goto(admission_url, timeout=60000)
                    
                    # Extract text from the body
                    await admission_page.wait_for_selector("body")
                    raw_text = await admission_page.locator("body").inner_text()
                    
                    logger.info(f"Extracted raw text. Sending to AI for ADMISSION extraction...")
                    
                    # Pass to AI (forces rewriting as Admission)
                    safe_data = rewrite_and_extract_job("Hint: This is a College/University ADMISSION notification in India. Extract the details accurately.\n" + raw_text, admission_url)
                    
                    if safe_data:
                        # Force job_type to ADMISSION
                        safe_data["job_type"] = "ADMISSION"
                        
                        # Fix category based on national vs state
                        if "assam" in raw_text.lower():
                            safe_data["category"] = "ASSAM_STATE"
                        else:
                            safe_data["category"] = "CENTRAL_GOVT"
                            
                        scraped_admissions.append(safe_data)
                        logger.info("Successfully extracted admission data!")
                        
                        # POST to Next.js API Route
                        import requests
                        try:
                            api_url = os.getenv("API_BASE_URL", "http://localhost:3000")
                            response = requests.post(
                                f"{api_url}/api/webhooks/ingest",
                                json=safe_data,
                                headers={"Authorization": "Bearer super-secret-key-123"}
                            )
                            if response.status_code == 200:
                                logger.info("Successfully ingested into Database!")
                            else:
                                logger.error(f"Failed to ingest: {response.text}")
                        except Exception as req_err:
                            logger.error(f"Could not connect to Next.js server: {req_err}")
                except Exception as inner_err:
                    logger.error(f"Failed processing {admission_url}: {inner_err}")
                finally:
                    await admission_page.close()
                
            return scraped_admissions
            
        except Exception as e:
            logger.error(f"Error during Admissions scraping: {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_admissions())
    print("\n--- SCRAPED ADMISSIONS RESULTS ---")
    print(json.dumps(results, indent=2))
