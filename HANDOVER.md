# AssamJobsHub - Comprehensive System Handover & Operational Guide
**Date:** October 24, 2026  
**Status:** Production Live & Google AdSense Primed  
**Repository:** [https://github.com/uzzaldutta/assamjobs-hub](https://github.com/uzzaldutta/assamjobs-hub) (Branch: `main`, Latest Commit: `d913176`)  
**Production URL:** [https://assamjobshub.com](https://assamjobshub.com)

---

## 1. System & Deployment Overview

| Parameter | Details | Status |
| :--- | :--- | :--- |
| **Live Production Domain** | [https://assamjobshub.com](https://assamjobshub.com) | ✅ 200 OK Live |
| **Source Code (GitHub)** | `https://github.com/uzzaldutta/assamjobs-hub` | ✅ Synced to `main` |
| **Hosting Platform** | Vercel (Hobby Tier) | ✅ Auto-deploy on Push |
| **Database** | Supabase PostgreSQL (`smpedqhskoamagndfbfc.supabase.co`) | ✅ Connected & Healthy |
| **AdSense Publisher ID** | `pub-4651508083326671` | ✅ Verified in `ads.txt` & `<head>` |
| **Google Ads Auto-Ads** | Dashboard: **ON** \| Code: Active | ✅ Primed for instant display |
| **Scheduled Ingestion** | GitHub Actions Cloud Cron (Twice Daily) | ✅ 8:00 AM & 8:00 PM IST |

---

## 2. Google AdSense Status & Complete Ads Overhaul

### A. Removal of Legacy Third-Party Ad Networks
In previous versions, the site utilized third-party iframes (`highrevenueformat.com` / Adsterra) which triggered intrusive ad warnings and hindered Google AdSense site approval. 
**These have been 100% eliminated:**
1. Deleted all Adsterra script invokes, options arrays, and iframe embeddings from:
   - `src/components/AdStickyMobile.tsx` (removed intrusive mobile bottom sticky popup)
   - `src/components/AdLeaderboard.tsx`
   - `src/components/AdSkyscraperHalf.tsx`
   - `src/components/AdSkyscraperTall.tsx`
   - `src/components/AdHorizontal.tsx`
   - `src/components/InFeedAd.tsx`
2. Removed legacy ad wrapper divs from `src/app/layout.tsx` and `src/app/page.tsx` to maintain clean semantic HTML.
3. Cleaned `src/components/AdSidebar.tsx` to display native, high-value feature cards (*AI Mock Tests* and *WhatsApp Community*) without competitor banners.

### B. Pure Google AdSense Architecture
- **Verification Meta Tag & Global Auto-Ads Script:**
  Embedded in the `<head>` of [`src/app/layout.tsx`](file:///D:/assamjobs-hub/src/app/layout.tsx#L83-L87):
  ```html
  <meta name="google-adsense-account" content="ca-pub-4651508083326671" />
  <Script 
    async 
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4651508083326671" 
    crossOrigin="anonymous" 
    strategy="afterInteractive" 
  />
  ```
- **Authorized `ads.txt` Verification:**
  Accessible directly at `https://assamjobshub.com/ads.txt`:
  ```text
  google.com, pub-4651508083326671, DIRECT, f08c47fec0942fa0
  ```
  *Google AdSense dashboard confirms:* **`Ads.txt status: Authorized`** (Green).
- **Native AdSense Unit Component:**
  [`src/components/AdBanner.tsx`](file:///D:/assamjobs-hub/src/components/AdBanner.tsx) is configured for official Google `<ins className="adsbygoogle">` tags with automatic suppression of dummy or placeholder slot IDs.
- **Auto Ads Configuration:**
  In the Google AdSense dashboard under **Ads** $\rightarrow$ **By site** $\rightarrow$ `assamjobshub.com`, both **Auto optimize: ON** and **Auto ads: ON** are active.
- **Review Expectation:**
  Site was submitted for review on **Oct 19, 2026**. The status is currently **`Getting ready`**. As soon as Google completes the standard 2–14 day review window and flips to **`Ready`**, ads will automatically render on the site without any code modifications.

---

## 3. Critical Production Bug Fixes (October 23–24, 2026)

### 1. Fixed Server Error Crash (`ERROR 3519210833` / `RangeError: Invalid time value`)
- **Diagnosis:** Certain scraped job feeds contain dates with ordinal suffixes (e.g. `"29th October 2026"`). Standard `new Date(string).toISOString()` threw unhandled exceptions during Next.js SSR, crashing job detail pages with HTTP 500.
- **Resolution:**
  - Built [`src/lib/dateUtils.ts`](file:///D:/assamjobs-hub/src/lib/dateUtils.ts) providing:
    - `parseFlexibleDate`: Strips ordinals (`st`, `nd`, `rd`, `th`), parses multi-format date strings safely, and detects closing dates.
    - `formatSafeDate`: Outputs standardized readable dates (`"29 Oct 2026"`).
    - `toSafeISOString`: Fallback-safe ISO converter returning `null` instead of throwing exceptions.
  - Updated [`src/app/jobs/[slug]/page.tsx`](file:///D:/assamjobs-hub/src/app/jobs/[slug]/page.tsx) and [`src/components/LatestUpdatesScroller.tsx`](file:///D:/assamjobs-hub/src/components/LatestUpdatesScroller.tsx).
  - All job pages now reliably render `HTTP 200 OK`.

### 2. Overhauled Link & Official Application Extraction
- **Diagnosis:** Scrapers previously captured intermediate blog article URLs or fell back to competitor domains instead of direct government portals.
- **Resolution:**
  - Upgraded [`AssamCareerAdapter.ts`](file:///D:/assamjobs-hub/src/lib/ingestion/adapters/AssamCareerAdapter.ts) and [`JobAssamHubAdapter.ts`](file:///D:/assamjobs-hub/src/lib/ingestion/adapters/JobAssamHubAdapter.ts).
  - Implemented Cheerio table-row inspection to extract official registration links (e.g. `https://beep.bfsissc.com/`, `uco.bank.in`, `apsc.nic.in`) and official PDF notification URLs.
  - Created [`scripts/fix-existing-jobs-data.ts`](file:///D:/assamjobs-hub/scripts/fix-existing-jobs-data.ts) to repair existing database records.

---

## 4. Fully Automated Twice-Daily Ingestion Pipeline

The platform runs autonomous synchronization twice every day with **zero manual intervention needed**:
1. **GitHub Actions Scheduled Cloud Workflow (`.github/workflows/auto-ingest.yml`)**:
   - **Morning Sync:** `02:30 UTC` = **8:00 AM IST**
   - **Evening Sync:** `14:30 UTC` = **8:00 PM IST**
   - Executes entirely in GitHub's cloud environment, independent of local computers.
2. **Secured API Cron Endpoint (`/api/cron/ingestion`)**:
   - Protected via token authentication: `token=assamhub_cron_2026`.
   - Performs automated ingestion from Blogger JSON feeds in under 2 seconds, eliminating serverless timeout limits.
3. **Automated Quality Filtering & Insertion**:
   - Quality scoring threshold ($\ge 20$) automatically classifies and publishes feeds into appropriate database tables (`jobs`, `admit_cards`, `results`, `admissions`, `scholarships`, `tenders`).

---

## 5. Typing Test Upgrade (`/tools/typing-test`)

Upgraded to simulate real government clerical examinations (APSC, High Court, Secretariat, ADRE):
1. **350+ Tough Vocabulary Bank (`src/data/typing-passages.ts`)**:
   - Features complex administrative, constitutional, legal, and regional terminology.
2. **Infinite Randomized Passage Generator**:
   - Dynamically samples 60 non-repeating words per session so candidates never memorize text patterns.
3. **Examination Timers & Metrics**:
   - 1, 2, and 5-minute timed exam modes with real-time Gross WPM, Net WPM, Accuracy %, and keystroke error auditing.

---

## 6. Project Directory Reference

```text
D:\assamjobs-hub (Mirrored at H:\assamjobs-hub_Oct24)
├── .github/workflows/auto-ingest.yml # Twice-daily automated cloud cron
├── public/
│   ├── ads.txt                       # Google AdSense authorized publisher declaration
│   ├── robots.txt
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Global layout with AdSense script & GA
│   │   ├── page.tsx                  # Home board & scroller
│   │   ├── api/cron/ingestion/       # Secured remote sync endpoint
│   │   ├── jobs/[slug]/page.tsx      # Job detail with safe date rendering
│   │   ├── tools/typing-test/        # Dynamic tough typing test
│   │   ├── disclaimer/page.tsx       # AdSense legal compliance
│   │   ├── about/page.tsx            # E-E-A-T publisher signals
│   │   └── contact/page.tsx          # Physical office & grievance desk
│   ├── components/
│   │   ├── AdBanner.tsx              # Pure Google AdSense unit component
│   │   ├── AdSidebar.tsx             # Promotional feature sidebar
│   │   ├── FeedList.tsx              # Clean job feed grid
│   │   └── LatestUpdatesScroller.tsx # Real-time closing jobs scroller
│   ├── data/
│   │   └── typing-passages.ts        # 350+ tough exam vocabulary bank
│   └── lib/
│       ├── dateUtils.ts              # Robust date parser (avoids 500 errors)
│       ├── supabase.ts               # Database client
│       └── ingestion/                # Extraction pipeline & adapters
```

---

## 7. Environment Variables Reference

Stored securely in Vercel and local `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://smpedqhskoamagndfbfc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<public_anon_key>"
SUPABASE_SERVICE_ROLE_KEY="<service_role_secret_key>"
GEMINI_API_KEY="<gemini_api_key>"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
CRON_SECRET="assamhub_cron_2026"
```

---

## 8. Operational Commands Quick Reference

### Trigger Ingestion Manually
- **From Terminal (CLI):**
  ```powershell
  npx tsx --env-file=.env.local scripts/extract-feeds-cli.ts
  ```
- **From Web Browser / Remote Curl:**
  ```powershell
  curl.exe "https://assamjobshub.com/api/cron/ingestion?token=assamhub_cron_2026"
  ```
- **From GitHub Actions:**
  Go to `https://github.com/uzzaldutta/assamjobs-hub/actions` $\rightarrow$ Click **"Automated Feed Ingestion"** $\rightarrow$ Click **"Run workflow"**.

### Local Next.js Development & Build
```powershell
# Run dev server
npm run dev

# Run production build
npm run build
```

---

## 9. Backup Archive Inventory

1. **H: Drive Full Mirror:** `H:\assamjobs-hub_Oct24\`
2. **H: Drive Backup Directory:** `H:\AssamJobsHub_Backup_Oct24\`
3. **H: Drive Compressed Zip:** `H:\AssamJobsHub_Backup_Oct24\AssamJobsHub_SourceCode_Oct24.zip`
4. **H: Drive Handover File:** `H:\AssamJobsHub_Backup_Oct24\AssamJobsHub_Handover_Oct24.md`
5. **Desktop Backup:** `C:\Users\SONY\OneDrive\Desktop\assamjobs-hub-deploy.zip`
6. **Git Version Control:** Commit `d913176` on branch `main` at `https://github.com/uzzaldutta/assamjobs-hub`
