# Security Architecture

## 1. Admin Authentication
- **Mechanism:** HTTP-only secure cookie (`admin_token`).
- **Authorization:** Server Actions verify the JWT/token before executing *any* database mutation. Client-side state (`localStorage`) is strictly for UI rendering, not security.

## 2. Row Level Security (RLS)
- Supabase RLS is active. 
- Anonymous users have `SELECT` access to `jobs`, `prep_exams`, `prep_subjects`, `prep_chapters`, and `prep_topics`.
- **Protection:** Anonymous users do *not* have direct access to `prep_questions.correct_answer`.

## 3. Data Leak Prevention (Zero Trust)
- **Practice Engine (Phase 3) & Mock Engine (Phase 5):** The Next.js server explicitly drops the `correct_answer` and `explanation` from the payload before sending it to the client.
- The client must submit the answer to a Secure Server Action (`checkAnswer` or `submitMockTest`) to get grading.

## 4. Stateless Mock Sessions
- Phase 5 Mock Tests use a stateless HMAC SHA-256 JWT containing `expiresAt`. The timer cannot be spoofed by modifying local client time.

## 5. Secrets
- Secrets are stored in `.env.local` (e.g., `SUPABASE_SERVICE_ROLE_KEY`). The Service Role key is NEVER exposed to the browser.
