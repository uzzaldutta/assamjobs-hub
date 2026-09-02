# Search Architecture (Phase 4)

- **PostgreSQL RPC:** `global_discovery_search`
- **Mechanism:** Combines `to_tsvector` (Full Text Search) with `pg_trgm` (Trigram Similarity for typo tolerance).
- **Relevance Ranking:** Title matches are weighted 'A', descriptions 'C'. Exact matches mathematically dominate fuzzy matches.
- **URL State:** The entire UI is driven by `searchParams`. URLs like `?q=ADRE&type=JOB` are the single source of truth, making searches perfectly shareable.
- **Autocomplete:** Debounced (300ms) API call grouped by item type.
- **Typo Tolerance:** Implemented at the DB level, but strictly constrained to titles to prevent irrelevant fuzzy matches in long descriptions.
