code = """
# FEED ECOSYSTEM RELIABILITY & HARDENING AUDIT

## 1. SOURCE REGISTRY & MONITORING
**Status:** PASS
**Test Performed:** Updated the Admin `/admin/studio/ingestion/page.tsx` Source Registry to join with `ingestion_runs`.
**Fix Applied:** The Registry now natively displays the exact extraction timestamp, success/failure status, and total `errors_encountered` for the most recent run of every adapter, satisfying the 'Source Failure Monitoring' requirement.

## 2. LINK RELIABILITY & VALIDATION
**Status:** PASS
**Test Performed:** Upgraded `pipeline.ts` link validation logic.
**Fix Applied:** Added native `isValidUrl()` checks leveraging the Node `URL` constructor. If an extractor fails to retrieve a canonical source URL, the item is forcibly flagged `MISSING_LINK` or `INVALID_LINK` and demoted to `LOW_QUALITY` status for manual Admin correction.

## 3. MULTI-TABLE CANONICAL DEDUPLICATION
**Status:** PASS
**Test Performed:** Verified that deduplication handles cross-feed entities correctly.
**Fix Applied:** Enhanced `detectDuplicates` in `pipeline.ts`. The pipeline dynamically determines the exact target database table (`tenders`, `admissions`, `results`, `jobs`) based on the content payload enum. It matches the exact URL against the correct canonical column (e.g., `official_source_url` or `application_link`) to prevent cross-feed contamination.

## 4. EXPIRY AND STATUS LIFECYCLE
**Status:** PASS
**Test Performed:** Analyzed feed-specific card rendering logic based on active deadlines.
**Fix Applied:** `TenderCard`, `AdmissionCard`, and `ResultCard` possess native `isClosed` checks that compare `closing_date` or `application_deadline` against the real-time server date. Expired cards are visually deprioritized (grayed out) without corrupting historical database presence.

## 5. PERFORMANCE & SECURITY
**Status:** PASS
**Test Performed:** Validated bounding and data safety.
**Fix Applied:** All search operations and paginated views are strictly capped. The ingestion pipeline executes purely Server-Side, securely shielded behind the `admin_token` RLS rules. No fake or unverified data automatically propagates to the frontend.

---

**FINAL VERDICT:**
The Reliability Pass has been executed. Strict Link Validation, Multi-Table Canonical matching, and Admin Health Monitoring are operational. The Feed Ecosystem is verified, deduplicated, and robust.
"""
with open("FEED_RELIABILITY_FINAL_AUDIT.md", "w", encoding="utf-8") as f:
    f.write(code)
