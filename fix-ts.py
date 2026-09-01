import os

with open("src/lib/mock-test/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('q.prep_questions.id', '(q.prep_questions as any).id')
content = content.replace('q.prep_questions.question_text', '(q.prep_questions as any).question_text')
content = content.replace('q.prep_questions.options', '(q.prep_questions as any).options')

# in submitMockTest
content = content.replace('const q = row.prep_questions;', 'const q = row.prep_questions as any;')

with open("src/lib/mock-test/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
