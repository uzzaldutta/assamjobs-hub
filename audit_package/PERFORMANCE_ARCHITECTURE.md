# Performance Architecture

- **Next.js App Router:** Heavily utilizes Server Components.
- **Database Logic:** Most heavy lifting (like Global Search) is offloaded directly to PostgreSQL via RPC (`global_discovery_search`), eliminating N+1 queries in the Node.js layer.
- **Client Components:** Used strictly at the leaf nodes where interactivity is required (`MockTestEngine`, `PracticeEngineClient`, `SearchAutocomplete`).
- **Data Transfer:** Initial page loads send pure HTML. The `correct_answers` are intentionally stripped from payloads to reduce size and enforce security.
- **Caching:** Currently relying on Next.js default fetch caching; specific `revalidate` tags will be needed as the CMS (Phase 6) comes online.
