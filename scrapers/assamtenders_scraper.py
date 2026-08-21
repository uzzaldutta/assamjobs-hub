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
            
            # The site uses a table for tenders. But first, we might need to bypass a CAPTCHA.
            import pytesseract
            from PIL import Image
            import io
            
            try:
                # Check if captcha is present
                await page.wait_for_selector("#captchaImage", timeout=10000)
                logger.info("Captcha detected. Attempting to solve with OCR...")
                
                solved = False
                for attempt in range(3):
                    logger.info(f"Captcha attempt {attempt + 1}/3")
                    
                    # Screenshot the captcha
                    captcha_img_bytes = await page.locator("#captchaImage").screenshot()
                    img = Image.open(io.BytesIO(captcha_img_bytes))
                    img = img.convert('L') # Convert to grayscale for better OCR
                    
                    # Extract text using Google Tesseract
                    captcha_text = pytesseract.image_to_string(img, config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789').strip()
                    logger.info(f"OCR extracted text: '{captcha_text}'")
                    
                    # Clean the text (sometimes OCR adds spaces or weird chars)
                    captcha_text = "".join(e for e in captcha_text if e.isalnum())
                    
                    if not captcha_text or len(captcha_text) < 4:
                        logger.warning("OCR failed to read enough characters. Refreshing captcha...")
                        await page.click("#captcha") # The refresh button id is 'captcha'
                        await page.wait_for_timeout(3000)
                        continue
                        
                    # Fill the box and submit
                    await page.fill("#captchaText", captcha_text)
                    await page.click("#submit")
                    
                    # Check if we got through (table appears)
                    try:
                        await page.wait_for_selector("table.list_table tr.list_header ~ tr", timeout=10000)
                        logger.info("OCR Captcha solved successfully!")
                        solved = True
                        break
                    except Exception:
                        logger.warning("Incorrect Captcha. Retrying...")
                        # If incorrect, the page either reloads or shows an error.
                        # Wait for a new captcha image to render before the next attempt
                        await page.wait_for_timeout(2000)
                        
                if not solved:
                    logger.error("Failed to solve CAPTCHA after 3 attempts.")
                    return []
                    
            except Exception as e:
                logger.info("No CAPTCHA found or already logged in. Waiting for table...")
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
