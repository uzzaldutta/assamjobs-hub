/**
 * Smart job deduplication utility.
 *
 * A job is considered a DUPLICATE if ALL of the following match:
 *   1. Organization (normalized)
 *   2. Number of posts / vacancies (normalized)
 *   3. Last date (application deadline)
 *   4. Published / scraped date (date portion only, ignoring time)
 *
 * Falls back to title+org hash when any of the four fields is missing,
 * so we never accidentally lose unique entries.
 */
export function deduplicateJobs(jobs: any[]): any[] {
  const seenHashes = new Set<string>();

  return jobs.filter(job => {
    const org = (job.organization || '').toLowerCase().replace(/\s+/g, '');
    const vacancies = (job.vacancies || '').toString().toLowerCase().replace(/\s+/g, '');
    // Support both mapped (lastDate) and raw (last_date) field names
    const lastDate = (job.lastDate || job.last_date || '').toString().trim();
    // Use only the date portion of the published timestamp (ignore time drift)
    const rawPublished = (job.scraped_at || job.created_at || '').toString();
    const publishedDate = rawPublished ? rawPublished.split('T')[0] : '';

    let hash: string;

    if (org && vacancies && lastDate && publishedDate) {
      // Primary: smart 4-field hash
      hash = `smart:${org}|${vacancies}|${lastDate}|${publishedDate}`;
    } else {
      // Fallback: title + org (original logic)
      const title = (job.title || '').toLowerCase().replace(/\s+/g, '');
      hash = `legacy:${title}|${org}`;
    }

    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  });
}
