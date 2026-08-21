# AssamJobs Hub - Project Handover Document

## 📌 Project Overview
AssamJobs Hub is a comprehensive, automated job portal focused on Assam Government jobs, Private jobs, and Tenders. It automatically scrapes jobs, rewrites descriptions using AI to avoid copyright issues, sends weekly newsletters, and acts as an all-in-one toolkit for job seekers with built-in PWA support and application tools.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend / Database:** Supabase (PostgreSQL), Supabase Auth
- **Automation / Scrapers:** Python (Playwright, BeautifulSoup), Node.js
- **AI Integration:** Google Gemini API (gemini-3.6-flash)
- **CI/CD & Cron Jobs:** GitHub Actions, Vercel

## 🚀 Key Features & Architecture
1. **Automated Scrapers (`/scrapers`)**
   - **Govt Jobs, Tenders, Private Jobs:** Scrapes multiple sources daily.
   - **AI Rewriter (`ai_rewriter.py`):** Uses Gemini to rewrite job descriptions completely into Markdown format, filtering out competitor links and enforcing the "Assam Standard Form" for offline jobs.
   - Runs every hour via GitHub Actions (`scraper-cron.yml`).
2. **Webhooks (`src/app/api/webhooks/ingest`)**
   - Receives POST requests from the scrapers with a secret Bearer token and inserts jobs directly into Supabase.
3. **Weekly Newsletter (`scrapers/send_newsletter.js`)**
   - Runs every Monday at 9:00 AM UTC via GitHub Actions (`newsletter.yml`).
   - Fetches subscribers from Supabase, formats recent jobs into an HTML email, and sends via Nodemailer (Gmail).
4. **Applicant Tools (`src/app/tools`)**
   - **Auto Standard Form:** Generates a print-ready Assam Standard Form.
   - **Age Calculator:** Client-side age calculation.
   - **Photo Resizer:** Client-side canvas-based image resizing and compression.
   - **AI CV Maker:** Generates ATS-friendly resumes for printing.
5. **Progressive Web App (PWA)**
   - Configured via `@ducanh2912/next-pwa` in `next.config.ts`.
   - `manifest.json` and 192/512px icons are in the `/public` folder.

## 📂 Important Directories
- `src/app/` - Next.js App Router (Pages: `/jobs/[id]`, `/tools`, `/calendar`, `/admit-cards`, `/results`, `/syllabus`)
- `src/components/` - Reusable UI components (`JobCard`, `FeedList`, etc.)
- `scrapers/` - The Python and Node scripts for automated ingestion and emails.
- `.github/workflows/` - CI/CD Cron jobs controlling the automation.
- `public/` - Static assets, PWA icons, and manifest.

## 🔐 Environment Variables Needed
To run this project locally, ensure the `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://smpedqhskoamagndfbfc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn
API_BASE_URL=https://y-ruddy-nine-46.vercel.app
API_SECRET_KEY=super-secret-key-123
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

## 🔄 Recent Work Completed (Aug 2026)
- Configured site as an installable PWA.
- Built a highly attractive custom Markdown renderer for the Job Details page.
- Created dynamic pages for Admit Cards, Results, Syllabus, and Calendar.
- Built a suite of 4 applicant tools (Age Calc, Photo Resizer, CV Maker, Standard Form).
- Added prominent links for the client's Android App (Assamese Calendar).

## 🎯 Next Steps / Roadmap Ideas
- Add dynamic fetching to the "Training" and "AI Match" sections.
- Build additional tools: Typing Speed Tester (WPM), PDF Merger, Salary Calculator, CGPA to Percentage converter.
