# AssamJobs Hub - Agent Handover Document

## Project Overview
* **Name**: AssamJobs Hub (assamjobshub.com)
* **Stack**: Next.js 14 (App Router), Tailwind CSS, Supabase, Vercel
* **Infrastructure**: Vercel (Hosting) + Cloudflare (DNS/Proxy Caching to prevent bandwidth limits)

## Critical Architecture Details

### 1. Vercel Limits & ISR (Crucial)
* **DO NOT USE evalidatePath FOR BROAD CACHE CLEARING.** The project previously hit Vercel's 200,000 ISR limit and 100GB bandwidth limit due to heavy scraper ingestion. 
* **Current Solution**: We use strict **Time-Based Revalidation (TTL)**. All major public pages (/, /jobs, /updates, etc.) have export const revalidate = 600; (10 minutes). This mathematically caps Vercel ISR writes to ~144/day per page regardless of ingestion volume.

### 2. Database & Ingestion Routing
* **Unified jobs Table**: The automated webhooks/scrapers currently insert *almost everything* (Jobs, Admit Cards, Results, Admissions) into the central jobs table.
* **Fallback Routing**: Detail pages like /admit-cards/[id] and /results/[id] have fallback logic in both generateMetadata and UpdateDetails. They query their specific table first, and if not found, they **fallback to the jobs table**. Do not remove this fallback or webhook-ingested items will return a 404.
* **Deduplication**: 
  * The database is prone to "fuzzy" duplicates (e.g., "Vacancy" vs "Post"). A Node script (clean_fuzzy_dupes.js) exists to clean these.
  * The frontend UI (like ClassicUpdatesBoard.tsx and page.tsx) uses Set logic to prevent multi-category items (e.g., an item tagged as both JOB and ADMISSION) from rendering twice on the screen.

### 3. UI/UX Preferences
* **Classic Portal Look**: The user highly prefers dense, compact, classic Indian job portal layouts (like FreeJobAlert). 
* ClassicUpdatesBoard uses zebra striping (odd:bg-white even:bg-slate-50), aggressive text wrapping (overflowWrap: "anywhere"), and no internal scrollbars (the page itself scrolls). Keep padding compact.

## Next Immediate Steps (Pending)
1. **Monetag Integration**: The user needs to integrate Monetag ads. Placeholders exist for AdSense, but Monetag scripts need to be injected into layout.tsx and the ad components.
2. **Capacitor Android App**: Wrap the Next.js app in Capacitor for the Google Play Store (planned).

## Environment Variables Needed
* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY
* SUPABASE_SERVICE_ROLE_KEY
* GEMINI_API_KEY (Required for AI Career Advisor tools)
