import asyncio
from playwright.async_api import async_playwright
async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('https://www.assamcareer.com/search/label/Admission', timeout=15000)
        print(await page.title())
        await browser.close()
asyncio.run(check())
