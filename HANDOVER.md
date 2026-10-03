# AssamJobs Hub - Project Handover Document
Date: September 29, 2026

## 1. Project Overview
AssamJobs Hub is a Next.js (App Router) web application hosted on Vercel, utilizing Supabase as the backend database. The system automatically scrapes job postings from various Assamese and Government job portals and presents them with high SEO visibility.

## 2. Core Architecture
- **Frontend/Backend:** Next.js 14+ (App Router)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Analytics:** Google Analytics 4 (via @next/third-parties/google)
- **AI Processing:** Google Gemini API (@google/generative-ai)

## 3. Automated Ingestion Pipeline (Phase 6)
The site uses an advanced automated scraping pipeline that runs daily (via Vercel Cron Jobs). 
- **Endpoint:** /api/cron/ingestion (Triggered via curl/run-ingest.js or Vercel Cron using CRON_SECRET).
- **Proxy Bypass:** Because sites like AssamCareer use Cloudflare to block Vercel IPs, the system routes these requests through **ScraperAPI** using the proxyFetch utility (src/lib/ingestion/proxyFetch.ts).
- **Data Flow:** Scraped jobs are inserted into the ingestion_queue table for manual review.
- **Auto-Approval:** High-quality Government jobs (Tier 1/2) that pass validation are **auto-approved** directly to the live jobs table, bypassing the manual queue.
- **HTML Extraction:** The scrapers capture the raw HTML of the job posts (via cheerio .post-body / .entry-content) so that standard formatting (tables, links) is preserved even without AI generation.

## 4. AI Content Generator
For high-quality, formatted Assamese translations, the system includes an AI Rewriter powered by Gemini.
- Located in the Legacy Admin Panel (/admin).
- The Admin can input a URL, and the etch-url API route will download the text and command Gemini to format it into perfectly structured HTML tables and output an Assamese translation.

## 5. SEO & Structured Data
- The dynamic job pages (src/app/jobs/[slug]/page.tsx) automatically inject standard **JobPosting JSON-LD** schema.
- Fields mapped include: 	itle, description, datePosted, alidThrough, hiringOrganization, jobLocation (Assam, IN), and employmentType.

## 6. Required Environment Variables (.env.local / Vercel)
The following keys MUST be configured in Vercel for the site to function:

| Variable | Purpose |
|----------|---------|
| \NEXT_PUBLIC_SUPABASE_URL\ | Supabase API URL |
| \NEXT_PUBLIC_SUPABASE_ANON_KEY\ | Public Supabase access |
| \SUPABASE_SERVICE_ROLE_KEY\ | Admin DB access (CRITICAL for Cron Jobs inserting data) |
| \CRON_SECRET\ | Protects the ingestion endpoint from unauthorized triggers |
| \SCRAPER_API_KEY\ | ScraperAPI key (1,000 free requests/mo) to bypass Cloudflare blocks |
| \GEMINI_API_KEY\ | Google AI Studio key for the AI Rewriter / Translation |
| \NEXT_PUBLIC_GA_ID\ | Google Analytics Measurement ID (G-XXXXXXX) |

## 7. Common Maintenance Tasks
- **Trigger Scraper Manually:** Run 
ode run-ingest.js in the terminal.
- **Approve Queued Jobs:** Navigate to https://assamjobshub.com/admin/studio/ingestion/queue.
- **Delete Broken Jobs:** Remove them from the "Manage Feeds" page, and the scraper will re-discover them on the next run.