# Database Architecture

## Hierarchical Syllabus Tree
The core of the preparation engine relies on a strict, cascading hierarchy:
`Exam -> Subject -> Chapter -> Topic -> Question`

By enforcing this structure via Foreign Keys (`ON DELETE CASCADE`), we ensure:
1. Data integrity (deleting an exam removes all related content).
2. Deep analytics (Mock Test results can trace a wrong answer back to the exact Topic and Chapter).

## Mock Test Linkage
Mock Tests sit parallel to the syllabus. They link an Exam to a specific set of Questions via a many-to-many join table (`prep_mock_test_questions`).
`Mock Test -> (M:M) -> Questions`

## Important Assumptions
- `jobs.id` is a `TEXT` string, while all `prep_*` tables use `UUID`. The Global Search RPC explicitly casts UUIDs to TEXT to allow a `UNION ALL`.
- `prep_questions.options` is stored as `JSONB` for flexibility, but `correct_answer` is strictly constrained via `CHECK (correct_answer IN ('A','B','C','D'))` to guarantee data cleanliness.
