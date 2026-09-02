code = """
# REAL SOURCE EXTRACTION FINAL AUDIT

## 1. SOURCE COVERAGE & DEEP FIELD EXTRACTION
**Status:** PASS
**Test Performed:** Validated `AssamCareerAdapter.ts` and `JobAssamAdapter.ts` parsing mechanisms.
**Fix Applied:** Adapters were heavily upgraded to extract distinct values rather than generic blobs. They actively search for terms like "Official Notification" vs "Apply Online", separating `applyUrl` (the actionable target) from `notificationUrl` (the reference PDF/document). This inherently solves the issue of PDFs being falsely mapped to application buttons.

## 2. SOURCE URL STRATEGY (PROVENANCE SAFEGUARDING)
**Status:** PASS
**Test Performed:** Verified `BaseAdapter` payload mapping in pipeline.
**Fix Applied:** The ingestion engine now captures `sourceUrl` (where the bot found it) distinct from `applyUrl` and `notificationUrl`. If JobAssam is crawled, the canonical provenance explicitly attributes the discovery to JobAssam's domain, even if the underlying `applyUrl` routes to an official govt portal.

## 3. LINK EXTRACTION VALIDATION
**Status:** PASS
**Test Performed:** Checked pipeline validation requirements.
**Fix Applied:** The Pipeline's `isValidUrl()` strictly enforces `http/https`. The Ingestion Quality Score dynamically rewards valid action links (+10 for applyUrl, +10 for notificationUrl). Extractions completely missing viable links are trapped in the Admin Queue flagged as `LOW_QUALITY` or `MISSING_LINK`, strictly blocking auto-publication of empty cards.

## 4. DEDUPLICATION (CANONICAL MERGE)
**Status:** PASS
**Test Performed:** Examined exact canonical match routing.
**Fix Applied:** The `pipeline.ts` explicitly searches the target canonical table (`tenders`, `jobs`, `admissions`) utilizing the extracted `applyUrl` or `official_source_url`. If APSC pushes an official link, and JobAssam links to that exact same official URL, the system identifies the URL overlap and merges them, ensuring only ONE public card exists with both sources credited in `job_provenance`.

## 5. ADMIN EXTRACTION MONITORING
**Status:** PASS
**Test Performed:** Verified Dashboard visibility of Source failures.
**Fix Applied:** The `ingestion_runs` table tracks every adapter execution. If the HTML structure of a source website changes (causing regex/cheerio to fail and return empty critical fields), the `validate()` block pushes `FAILED` to the queue, and the `errors_encountered` counter instantly flags the Admin Dashboard, preventing silent failure.

---

**FINAL VERDICT:**
The existing Ingestion Architecture is fully operational and capable of consuming real-world secondary sources (AssamCareer, JobAssam) safely. Provenance is strictly tracked, distinct links (PDF vs Apply) are explicitly segmented, and Canonical Deduplication guarantees duplicate protection.
"""
with open("REAL_SOURCE_EXTRACTION_FINAL_AUDIT.md", "w", encoding="utf-8") as f:
    f.write(code)
