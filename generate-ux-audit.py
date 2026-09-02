code = """
# POST-PHASE 6 UX AUDIT

## 1. Top 10 UX Problems
1. [HIGH] **Search Prominence:** Global search is slightly buried on mobile; needs an explicit, highly visible trigger.
2. [HIGH] **Empty States:** Filtered job lists return an empty container instead of a helpful "No Results Found" graphic with a clear "Clear Filters" action.
3. [MEDIUM] **Job Card Hierarchy:** Job cards lack a distinct visual hierarchy separating salary, deadline, and organization.
4. [MEDIUM] **Syllabus Readability:** Deeply nested syllabus content can feel overwhelming without sticky section headers.
5. [MEDIUM] **Practice Engine Progress:** The current progress bar lacks a clear "Questions Remaining" textual cue.
6. [MEDIUM] **Filter Placement:** Job filters on mobile require too much scrolling before seeing the actual jobs.
7. [LOW] **Button Inconsistency:** Some primary buttons use `bg-blue-600` while others use `bg-indigo-600`.
8. [LOW] **Missing "Back" affordances:** Deep mock test analytics pages rely on the browser back button instead of an explicit "Back to Dashboard" link.
9. [LOW] **Toast Notifications:** Missing a unified toast system for actions like "Added to Bookmarks".
10. [LOW] **Pagination Feedback:** Clicking a pagination link causes an instant jump without a loading transition.

## 2. Top 10 Performance Problems
1. [HIGH] **Image Un-optimization:** Custom logos in job posts don't use `next/image` in some dynamic areas.
2. [HIGH] **Hydration Mismatches:** Occasional mismatched HTML on dates due to timezones.
3. [MEDIUM] **LCP (Largest Contentful Paint):** The hero section loads slightly slower because fonts are not preloaded.
4. [MEDIUM] **Duplicate Queries:** `layout.tsx` and `page.tsx` sometimes re-fetch identical base configuration data.
5. [MEDIUM] **Third-party scripts:** Google Fonts or Analytics block initial render slightly.
6. [LOW] **Heavy SVG Icons:** Inline SVGs instead of a sprite sheet increase HTML payload size.
7. [LOW] **CSS Payload:** Unused Tailwind classes (minimal but present).
8. [LOW] **Client-side filtering:** Minor stutters on massive lists if pagination isn't strictly enforced on edge cases.
9. [LOW] **Pre-fetching:** Missing `prefetch={false}` on heavy Admin links.
10. [LOW] **Animation overhead:** Too many CSS transitions on list items.

## 3. Top 10 Mobile Problems
1. [HIGH] **Touch Targets:** Pagination buttons (1, 2, 3...) are too small for thumb-tapping (need min 44x44px).
2. [HIGH] **Filter Modal:** Filters should slide up in a Drawer on mobile, rather than pushing content down.
3. [MEDIUM] **Horizontal Scroll:** Some wide data tables in Admin lack an `overflow-x-auto` wrapper causing page breakage.
4. [MEDIUM] **Sticky Headers:** The Mock Test timer header takes up too much vertical space on small screens (e.g., iPhone SE).
5. [MEDIUM] **Bottom Nav:** Intercepts clicks on the lowest items of a long list if padding-bottom isn't calculated correctly.
6. [LOW] **Text Legibility:** Some secondary tags use 10px text, which is below the recommended 12px minimum.
7. [LOW] **Input Zoom:** iOS Safari auto-zooms if inputs have `text-sm` instead of `text-base` (16px).
8. [LOW] **Hover Effects on Touch:** "Tap" states sometimes get stuck displaying hover styling.
9. [LOW] **Keyboard obscuring:** Forms (like login) get covered by the mobile keyboard.
10. [LOW] **Drawer Dismissal:** Lack of swipe-to-dismiss on mobile drawers.

## 4. Top 10 Visual/Design Problems
1. [HIGH] **Color Inconsistency:** Mixing of Slate and Gray scales across different pages.
2. [MEDIUM] **Shadow Hierarchies:** Cards sometimes use `shadow-lg` while modals use `shadow-sm`, reversing logical elevation.
3. [MEDIUM] **Border Radii:** Mixed `rounded-md`, `rounded-xl`, and `rounded-3xl` in close proximity.
4. [MEDIUM] **Whitespace:** Inconsistent padding inside cards (`p-4` vs `p-6`).
5. [MEDIUM] **Typography Contrast:** `text-slate-400` fails WCAG contrast on white backgrounds for small text.
6. [LOW] **Badge Alignment:** Badges are not vertically centered with text.
7. [LOW] **Icon Weight:** Mixing filled and outlined icons.
8. [LOW] **Focus Rings:** Default browser focus rings instead of custom branded rings.
9. [LOW] **Empty States:** Generic styling rather than branded illustrations.
10. [LOW] **Gradients:** Overuse of gradients on secondary elements.

## 5. Major Route Status
- **Homepage:** WARNING (Needs better Mobile Search & Card hierarchy)
- **Job Discovery:** WARNING (Needs Empty States & Skeletons)
- **Job Details:** PASS
- **Exam Dashboard:** PASS
- **Practice Engine:** PASS
- **Mock Test Engine:** PASS
- **Admin/Content Studio:** PASS
"""
with open("POST_PHASE6_UX_AUDIT.md", "w", encoding="utf-8") as f:
    f.write(code)
