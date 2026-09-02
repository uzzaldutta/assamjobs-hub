# Known Issues / Audit Flags

1. **Content Management (Phase 6):** The database supports the syllabus and mock tests, but there is currently no UI for Admins to easily upload questions in bulk or build tests visually. (Scheduled for Phase 6).
2. **Accessibility:** While contrast is good, many interactive `div`s lack proper `aria-labels` and keyboard focus trapping (especially in the Mobile Palette Drawer in Phase 5). REQUIRES VERIFICATION.
3. **SEO:** The site needs dynamic `sitemap.xml` generation for Exam Slugs and Job IDs. Currently, standard `generateMetadata` is used, but advanced Structured Data (JSON-LD) is missing.
4. **Data Sync:** Currently 100% local-first (anonymous). If users clear `localStorage`, they lose their mock test analytics history.
