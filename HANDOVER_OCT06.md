# AssamJobs Hub - October 06 Handover Document

## 1. System Architecture Updates
The extraction pipeline has been completely optimized to allow for fully automated ingestion of jobs across multiple competitor websites. It uses Vercel Cron jobs for scheduling, and Cheerio for robust HTML scraping.

## 2. Gemini AI Integration (Model: gemini-3.8-flash)
The automated rewriting of scraped jobs (which generates perfectly formatted HTML tables and Assamese translations) now utilizes Google's latest **gemini-3.8-flash** model. This successfully bypasses previous rate limits encountered with the 3.6-flash model, ensuring smooth and rapid formatting without quota exhaustion.

## 3. Universal Auto-Approval Logic
The legacy condition that restricted auto-approval strictly to Government, Police, and Railway jobs has been **completely removed**. 
* **New Rule**: ANY job that passes the duplicate checks and spam firewall will be automatically approved and published straight to the live feed.

## 4. Strict Duplicate Rules (Zero-Cost Optimization)
Duplicates are now identified accurately inside the ingestion loop without needing slow or expensive AI API calls. A job is instantly flagged as an EXACT DUPLICATE and safely ignored if it matches:
1. **Same Organization**
2. **Same Number of Posts (Vacancies)**
3. **Same Closing Date**
* This ensures zero waste of Vercel execution time or Database Writes on redundant posts.

## 5. Caching and Hydration Fixes
* **Vercel Data Cache**: Added automatic surgical cache invalidation (evalidatePath('/', 'layout')) whenever a new job is ingested. This ensures the live homepage updates immediately, rather than waiting for Next.js 24-hour TTL constraints.
* **React Hydration Crashes**: Fixed the fatal "Reload" crash caused by messy external HTML tags. The Markdown renderer is now protected by suppressHydrationWarning, ensuring the live site remains highly stable and AdSense-compliant.

## 6. How to Deploy Future Updates
Any further code updates pushed to the main GitHub branch will automatically deploy to Vercel and go live within 2 minutes. The Cron job handles all extraction automatically on the remote server.