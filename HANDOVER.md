# AssamJobsHub - Comprehensive Handover Document (October 23, 2026)

## 1. System & Deployment Overview
- **Live Production URL**: [https://assamjobshub.com](https://assamjobshub.com)
- **GitHub Repository**: [https://github.com/uzzaldutta/assamjobs-hub](https://github.com/uzzaldutta/assamjobs-hub) (Branch: `main`)
- **Vercel Account**: `uggaldutta@gmail.com` | Project: `assamjobs-hub` (`prj_k5sxcMjUAUZC3cp7MOpCVWVdnvIi`)
- **Database (Supabase)**: `https://smpedqhskoamagndfbfc.supabase.co`
- **AdSense Publisher ID**: `pub-4651508083326671` (Active `ads.txt` verified live)

---

## 2. Google AdSense Full Compliance & Re-Review Status
All root causes cited in the AdSense rejection email were resolved and deployed live:
1. **Dedicated Non-Affiliation Disclaimer (`/disclaimer`)**:
   - Explicit statement disclaiming official affiliation with Govt of Assam, Govt of India, APSC, SLPRB, SLRC, AHSEC, SEBA.
   - Transparent advisory requiring candidates to verify details with primary official gazettes.
   - Strict 100% free public service clause warning candidates against fraudulent fee solicitors.
   - Persistent disclaimer banner embedded across all pages via `Footer.tsx`.
2. **Elimination of 0-Item Navigation Sections ("Under Construction")**:
   - Seeded 4 official state exams in `prep_exams` (ADRE 2.0, Assam Police SI/Constable, APSC CCE 2026, Assam TET 2026).
   - Seeded 8 comprehensive study materials & syllabus guides in `prep_materials`.
   - Updated `/previous-papers` to query dynamic documents and study guides.
3. **Broken Footer Link Fixed**: Corrected `/tools/cgpa-calculator` to `/tools/cgpa-converter`.
4. **E-E-A-T Trust Signals**: Enhanced `/about` and `/contact` with Guwahati physical operating office, grievance redressal desk, and fact-checking standards.
5. **Crawler Sitemap**: Updated `/sitemap.xml` with canonical URLs for all legal and trust pages.

---

## 3. Fully Automated Ingestion Pipeline (Twice Daily - 100% Autonomous)
The extraction system now runs automatically **twice every day without requiring any user supervision**:
1. **GitHub Actions Scheduled Cloud Workflow (`.github/workflows/auto-ingest.yml`)**:
   - **Morning Run**: `02:30 UTC` = **8:00 AM IST**
   - **Evening Run**: `14:30 UTC` = **8:00 PM IST**
   - Runs in GitHub's cloud 24/7 completely free without needing the user's PC to be on.
   - Includes `workflow_dispatch` for optional 1-click manual trigger anytime via the GitHub Actions tab.
2. **Secured API Endpoint (`/api/cron/ingestion`)**:
   - Authenticated via token query param or bearer header: `token=assamhub_cron_2026`.
   - Can also be pinged by external webcrons (e.g. cron-job.org).
3. **Vercel Built-In Cron Backup (`vercel.json`)**:
   - Maintained at `14:00 UTC` = **7:30 PM IST** as a secondary cloud backup.
4. **Adapter Performance Overhaul (`AssamCareerAdapter.ts`)**:
   - Migrated to the official Blogger JSON Feed (`/feeds/posts/default?alt=json&max-results=12`).
   - Discovery + fetch execution time dropped from 40s to **under 2 seconds**, completely eliminating serverless connection timeouts.
5. **Universal Auto-Approval**:
   - Clean feeds with quality score >= 20 automatically insert into `jobs`, `scholarships`, `admissions`, `results`, `admit_cards`, or `tenders`.

---

## 4. Enhanced Typing Test Tool (`/tools/typing-test`)
Per the latest requirements to prevent memorization and simulate real competitive exams:
1. **350+ Tough Vocabulary Bank (`src/data/typing-passages.ts`)**:
   - Multi-syllable, difficult administrative, legal, bureaucratic, and Assamese geographic terms.
2. **Infinite Dynamic Passage Generator (`generateRandomToughPassage`)**:
   - Assembles fresh paragraphs of 60 randomized tough words on every test start/shuffle so the user **never sees the same text twice**.
3. **10 Curated Exam Presets**:
   - Secretariat & Admin, Legal & Court, Assam Heritage, Numbers & Symbols (`§12(a)`, dates, percentages, brackets).
4. **Exam Timers & Metrics**:
   - 1-minute, 2-minute, and 5-minute standard government exam modes with Net WPM, accuracy, and error tracking.

---

## 5. Environment Variables Reference
The following environment variables are set up in Vercel and local `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: `https://smpedqhskoamagndfbfc.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (admin writes)
- `GEMINI_API_KEY`: Google Gemini API key for automated rewriting
- `NEXT_PUBLIC_GA_ID`: Google Analytics tracking ID
- `CRON_SECRET`: Vercel cron authorization secret
- `SCRAPER_API_KEY`: Scraper proxy key (optional)

---

## 6. How to Run Manual Ingestion Anytime
- **From Terminal (Local CLI)**:
  ```bash
  npx tsx --env-file=.env.local scripts/extract-feeds-cli.ts
  ```
- **From Browser / Terminal (Remote Trigger)**:
  ```bash
  curl "https://assamjobshub.com/api/cron/ingestion?token=assamhub_cron_2026"
  ```
- **From GitHub UI**:
  Go to your repo `uzzaldutta/assamjobs-hub` -> **Actions** -> **Automated Feed Ingestion** -> **Run workflow**.
