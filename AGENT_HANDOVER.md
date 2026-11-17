# ASSAMJOBSHUB — MASTER AGENT HANDOVER & ARCHITECTURE MANUAL
**Last Updated:** November 16, 2026  
**Status:** Production Live & Verified (Commit `defb58a`)  
**Target Audience:** AI Agents, Pair Programmers & Lead Developers  

---

## 1. PROJECT & INFRASTRUCTURE OVERVIEW

| Parameter | Details | Status |
| :--- | :--- | :--- |
| **Live Production URL** | [https://assamjobshub.com](https://assamjobshub.com) | ✅ 200 OK Live (Vercel Serverless) |
| **Source Code Repository** | [https://github.com/uzzaldutta/assamjobs-hub](https://github.com/uzzaldutta/assamjobs-hub) (Branch: `main`) | ✅ Synced & Auto-Deploying |
| **Primary Active Workspace** | `G:\assamjobs-hub_Oct24\` | ✅ Primary Coding Directory |
| **Mirror Backup Workspace** | `E:\Uzzal\App Development\assamjobs-hub\` | ✅ 100% Synced Mirror |
| **Desktop Deployment Zip** | `C:\Users\USER\Desktop\assamjobs-hub-deploy.zip` | ✅ 1.38 MB Clean Archive |
| **Admin Control Panel** | [https://assamjobshub.com/admin](https://assamjobshub.com/admin) (or local `:3001/admin`) | ✅ Secured |
| **Database** | Supabase PostgreSQL (`smpedqhskoamagndfbfc.supabase.co`) | ✅ Connected & Healthy |
| **Google Analytics (GA4)** | Stream: `JobSite` \| Property: `556085338` \| ID: `G-ZQZLJCQZWF` | ✅ Live & Firing |
| **Google AdSense** | Publisher ID: `pub-4651508083326671` | ✅ Verified in `ads.txt` & `<head>` |

---

## 2. MASTER CREDENTIALS & SECRETS

### A. Admin Dashboard Access
- **URL:** `https://assamjobshub.com/admin` (or `http://localhost:3001/admin` locally)
- **Username:** `admin`
- **Password:** `assamhub2026`
- **Capabilities:** Direct job management, ingestion queue approvals, category tagging, mock test studio, banner CMS.

### B. Supabase Cloud Database (PostgreSQL)
- **Project Reference:** `smpedqhskoamagndfbfc`
- **Dashboard:** [https://supabase.com/dashboard/project/smpedqhskoamagndfbfc](https://supabase.com/dashboard/project/smpedqhskoamagndfbfc)
- **API URL (`NEXT_PUBLIC_SUPABASE_URL`):** `https://smpedqhskoamagndfbfc.supabase.co`
- **Public Anon Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`):** `sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn`
- **Service Role Secret Key (`SUPABASE_SERVICE_ROLE_KEY`):** `[Configured in .env.local]`

### C. Google Gemini AI Engine
- **API Key (`GEMINI_API_KEY`):** `[Configured in .env.local]`
- **Purpose:** Copyright-free job rewriting, auto-tagging, official link extraction, eligibility analysis, and mock test question generation.

### D. Automated Feed Ingestion & Security
- **Auth Secret Token (`CRON_SECRET`):** `assamhub_cron_2026`
- **Cron API Endpoint:** `https://assamjobshub.com/api/cron/ingestion?token=assamhub_cron_2026`
- **Revalidation Endpoint:** `https://assamjobshub.com/api/revalidate-all`

### E. Google Analytics 4 (GA4)
- **Measurement ID:** `G-ZQZLJCQZWF`
- **Stream ID:** `16276077731` (Stream Name: `JobSite`)
- **Account:** `Default Account for Firebase (181793850)`
- **Property:** `AssamJo... (556085338)` *(Note: Always view reports on this property, not 556076440)*.

---

## 3. RECENT ARCHITECTURAL ACCOMPLISHMENTS (PHASE 1 & PHASE 2)

### 1. Phase 1 Homepage Redesign (`src/components/HeroSection.tsx`)
- Reduced excessive banner height by 45% for superior mobile viewport density.
- Added live verification indicator: `🟢 Verified Daily Recruitment Alerts for Assam & North East`.
- Added instant search clear button (`✕`) for rapid candidate searching.
- Added horizontal touch-scrollable 1-tap qualification and exam filter pills:
  - `10th Pass`, `12th Pass`, `Graduate`, `Assam Police`, `ADRE 2.0`, `APSC CCE`, `TET / Teaching`, `Railway RRB`, `Govt Jobs`, `Private Jobs`.
- Streamlined `CategoryGrid.tsx` vertical padding.

### 2. Phase 2 Homepage Redesign (`src/components/UnifiedJobMatrix.tsx`)
- Replaced the fragmented 3-column table with a high-density, segmented tab switcher:
  1. **Govt Jobs** (State departments, police, commissions)
  2. **Private Jobs** (Verified private corporate, schools, hospital posts)
  3. **Railway (RRB)** (Dedicated central rail recruitment tab)
  4. **Closing Soon** (Critical deadline urgency indicator)
  5. **Admit Cards** (Hall tickets & exam call letters)
  6. **Results** (Merit lists & selection outcomes)
  7. **Admissions** (Colleges, universities & entrance exams)
- Live post count badges for each tab.
- In-tab instant search filter allowing candidates to search posts within the active category without reloading.
- Direct "View All [Category] →" footer button on each tab for full pagination access.

### 3. Private vs. Government Job Misclassification Fix (`src/lib/jobClassifier.ts`)
- **Root Cause Identified:** `src/app/admin/studio/ingestion/actions.ts` previously had hardcoded logic: `item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE'`, causing private schools, dealerships, and clinics to be branded as government jobs.
- **Solution:** Implemented `classifyJobType()` using exact positive regex matching for government entities vs. private entities (schools, academies, dealerships, private hospitals, hotels, IT agencies).
- **Database Migration:** Executed `scripts/reclassify-private-jobs.ts`, successfully reclassifying 20 existing private posts from `GOVERNMENT` to `PRIVATE`, and 18 posts to `RAILWAY`.

### 4. Consolidated Google Analytics Component (`src/components/GoogleAnalytics.tsx`)
- Integrated Next.js `<Script>` tag with measurement ID fallback `process.env.NEXT_PUBLIC_GA_ID || 'G-ZQZLJCQZWF'`.
- Removed duplicate inline script blocks from `<head>` in `src/app/layout.tsx` to eliminate script ID collisions and hydration warnings.

### 5. Automated Feed Extraction Windows Daemon
- **Task Scheduler:** Configured native Windows Scheduled Task `AssamJobsHub-AutoFeed` to run continuously every 2 hours.
- **Silent VBScript:** `scripts/run-auto-feed-silent.vbs` executes `scripts/run-auto-feed.bat` completely invisibly without flashing command prompt windows on the user's screen.
- **Date Parsing Hardening:** Patched `safeDateIso` in `src/lib/ingestion/pipeline.ts` to prevent `RangeError: Invalid time value` crashes on non-standard dates.

---

## 4. LOCAL DEVELOPMENT & OPERATIONAL COMMANDS

### Starting the Local Development Server:
> **Important:** Always include `$env:NODE_OPTIONS="--dns-result-order=ipv4first"` on Windows to bypass home router IPv6 DNS timeouts when contacting Supabase.

```powershell
cd "G:\assamjobs-hub_Oct24"
$env:NODE_OPTIONS="--dns-result-order=ipv4first"
npm.cmd run dev
```
- App: `http://localhost:9000` (or `http://localhost:3001`)
- Admin Panel: `http://localhost:9000/admin`

### Running TypeScript Verification:
```powershell
cd "G:\assamjobs-hub_Oct24"
.\node_modules\.bin\tsc.cmd --noEmit
```

### Edge Cache Revalidation:
Whenever new database records or configuration changes are made:
```powershell
curl.exe -s "https://assamjobshub.com/api/revalidate-all"
```

### Creating Desktop Deployment Archive:
```powershell
powershell -ExecutionPolicy Bypass -File "G:\assamjobs-hub_Oct24\scripts\create-desktop-zip.ps1"
```
Generates a clean 1.38 MB production archive at `C:\Users\USER\Desktop\assamjobs-hub-deploy.zip`.

### Mirror Synchronization:
Always run the sync script after making code edits in `G:\`:
```powershell
node "G:\assamjobs-hub_Oct24\scripts\sync-to-mirror.js"
```

---

## 5. UPCOMING ROADMAP & FUTURE ENHANCEMENTS

1. **Phase 3: High-Converting Community Channels**
   - Sticky WhatsApp Community & Telegram Channel join badges designed specifically for Assam aspirants (e.g. *"Join 25,000+ Aspirants for Instant Telegram & WhatsApp Job Alerts"*).
2. **Phase 4: Daily 5-Minute Exam Prep Carousel**
   - Directly integrate a daily 5-question micro-quiz or mock test preview widget into the homepage to boost user dwell time and repeat visits.
3. **Old GitHub Actions Workflow Pruning:**
   - If the user receives automated failure emails from older cloud workflows, guide them to disable the failing workflow at `https://github.com/uzzaldutta/assamjobs-hub/actions` since ingestion is now actively handled by the local Windows scheduled task and webhooks.

---

*This document must remain preserved and updated in both `G:\assamjobs-hub_Oct24\AGENT_HANDOVER.md` and `E:\Uzzal\App Development\assamjobs-hub\AGENT_HANDOVER.md`.*
