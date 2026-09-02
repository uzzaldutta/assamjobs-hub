plan = """# AI Question Generation Studio

## Overview
A new dedicated modular workspace (`/admin/studio/generator`) designed to generate structured MCQs from source material using AI, run validation, check for duplicates via `pg_trgm`, and allow human review before publishing.

## Proposed Changes

### 1. New Generator UI Workspace
- **[NEW] `src/app/admin/studio/generator/page.tsx`**: Server component wrapper.
- **[NEW] `src/app/admin/studio/generator/GeneratorClient.tsx`**: The main multi-step wizard UI.
  - Step 1: **Source Selection** (Paste text, or select existing PDF material).
  - Step 2: **Configuration** (Select Exam, Subject, Topic, Difficulty, Question Count).
  - Step 3: **Generation & Validation** (Calls Server Action, streams progress).
  - Step 4: **Review Workspace** (Displays generated questions in cards, flags duplicates, allows inline editing, Approve, Reject, Regenerate).

### 2. AI Abstraction & Server Actions
- **[NEW] `src/app/admin/studio/generator/actions.ts`**:
  - `generateQuestionsAction(sourceText, metadata, count)`: Uses `@google/generative-ai` (Gemini) to generate structured JSON containing the MCQs. Enforces strict schema (A, B, C, D correct answer format, mandatory explanation).
  - `validateAndCheckDuplicatesAction(questions)`: Runs the AI output through the existing `find_question_duplicates` RPC and validates options.
  - `saveGeneratedQuestionsAction(questions)`: Securely inserts approved questions as DRAFT into `prep_questions`.

### 3. PDF Extraction Support
- If the admin selects an existing PDF material, the server will read the file and extract text to feed into the AI. *(Note: If PDF extraction is too heavy, we will start with plain text pasting, and add a lightweight PDF parsing library later).*

## Open Questions for Admin
> [!IMPORTANT]
> - Do you already have `@google/generative-ai` API keys configured as `GEMINI_API_KEY` in your environment? 
> - PDF text extraction in Node.js can be tricky. Should we start with "Paste Text" and "Topic-based" generation first, and add the PDF-file-parsing logic in a follow-up step?

## Verification Plan
1. Test generation of 5 questions from pasted text.
2. Verify the AI outputs strict A/B/C/D correct answers.
3. Verify the Duplicate Detector correctly flags similar generated questions.
4. Verify the "Approve" button saves them to the DB as DRAFT.
"""
with open("C:/Users/SONY/.gemini/antigravity/brain/c32e4699-7971-4328-8aa4-075b27288892/implementation_plan_ai.md", "w", encoding="utf-8") as f:
    f.write(plan)
