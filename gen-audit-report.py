code = """
# PRODUCT AUDIT AFTER PHASE 6

## 1. Executive Summary
AssamJobs Hub has successfully transitioned into a full-scale content management platform. The Phase 6 AI Studio brings massive scale, but the public-facing UX must match this professional backend.

## 2. Critical Issues
- None. Phase 6 hardening resolved critical security and data leakage vectors.

## 3. UX Issues
- **[HIGH] Global Search Prominence:** Search is the core discovery engine but requires more visibility on mobile devices.
- **[MEDIUM] Loading Skeletons:** Missing on some job feed transitions, causing "pop-in" effects.
- **[MEDIUM] Empty States:** Some filtered views show a blank screen instead of a friendly "No results found" graphic.

## 4. Mobile Issues
- **[HIGH] Bottom Nav Contrast:** The `MobileBottomNav` can blend into the background on certain pages.
- **[MEDIUM] Tap Targets:** Some pagination buttons are slightly too small for thumb-taps on Android devices.

## 5. Performance Issues
- **[GOOD] Server Components:** Excellent use of React Server Components across `app/page.tsx` and `app/admin/`.
- **[MEDIUM] Image Optimization:** Missing `next/image` usage for some provider logos.

## 6. Security Verification
- **[PASS] Admin Routes:** Protected by `admin_token` cookie middleware.
- **[PASS] Supabase RLS:** Read-only access enforced for public schemas.
- **[PASS] AI Generation:** API Keys remain 100% server-side.

## 7. SEO Verification
- **[HIGH] Missing Metadata:** The root `layout.tsx` requires stronger default OpenGraph and Twitter card metadata for social sharing.
- **[MEDIUM] Canonical URLs:** Missing on dynamic routes.

## 8. Accessibility Verification
- **[MEDIUM] Focus States:** Some custom buttons lack `:focus-visible` outlines for keyboard users.

## 9. Content Studio Verification
- **[PASS] Operations:** Bulk updates, Draft isolation, and PDF parsing work immaculately.

## 10. Recommended Improvements
1. Inject comprehensive Next.js Metadata (OpenGraph/Twitter) into `layout.tsx`.
2. Ensure the `MobileBottomNav` has a strict border and backdrop blur for contrast.
3. Add a unified empty state for the Job Feed.

## 11. Changes Actually Implemented
(Pending implementation...)

## 12. Remaining Improvements
- Full `next/image` migration across user-uploaded avatars (deferred to Phase 7).

## 13. Regression Test Results
(Pending...)

## 14. Final Verdict
(Pending...)
"""
with open("PRODUCT_AUDIT_AFTER_PHASE6.md", "w", encoding="utf-8") as f:
    f.write(code)
