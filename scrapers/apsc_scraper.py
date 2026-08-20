import asyncio
from playwright.async_api import async_playwright
import logging
import json

from hasher import generate_pdf_hash_from_url
from pdf_parser import extract_text_from_pdf_url
from structurer import simulate_ai_structuring

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Note: APSC often updates their site layout. This script targets a general table row structure.
TARGET_URL = "https://apsc.nic.in/advt_2024.asp"  # Example current URL for APSC advertisements

async def scrape_apsc_latest():
    logger.info("Starting APSC Scraper...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            await page.goto(TARGET_URL, timeout=30000)
            
            # Wait for the main table to load
            await page.wait_for_selector("table", timeout=10000)
            
            # Extract rows from the first table found
            rows = await page.locator("table tr").all()
            logger.info(f"Found {len(rows)} rows in the table.")
            
            results = []
            
            # Process the first 3 relevant rows (skipping header)
            count = 0
            for i in range(1, len(rows)):
                if count >= 3:
                    break
                    
                row = rows[i]
                
                # Extract text and links
                text_content = await row.inner_text()
                links = await row.locator("a").all()
                
                if not links:
                    continue
                    
                pdf_link = await links[0].get_attribute("href")
                if pdf_link and not pdf_link.startswith("http"):
                    pdf_link = f"https://apsc.nic.in/{pdf_link}"
                
                title = text_content.split('\n')[0][:100] # Grab first part as title
                
                logger.info(f"Processing row: {title}")
                
                # 1. Generate Hash
                pdf_hash = generate_pdf_hash_from_url(pdf_link)
                logger.info(f"Generated Hash: {pdf_hash}")
                
                # 2. Extract PDF Text
                raw_text = extract_text_from_pdf_url(pdf_link)
                
                # 3. Structure Data
                if raw_text:
                    structured_json = simulate_ai_structuring(
                        raw_text=raw_text,
                        source_url=TARGET_URL,
                        pdf_url=pdf_link,
                        title=title
                    )
                    
                    # Parse back to dict to inject the hash
                    job_data = json.loads(structured_json)
                    job_data['hash'] = pdf_hash
                    results.append(job_data)
                
                count += 1
                
            return results
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return []
        finally:
            await browser.close()

if __name__ == "__main__":
    results = asyncio.run(scrape_apsc_latest())
    print("\n--- SCRAPED RESULTS ---")
    print(json.dumps(results, indent=2))
