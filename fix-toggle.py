import re

with open("src/components/admin/PrepDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix toggleTestQuestion
toggle_func = """
  const toggleTestQuestion = async (questionId: string) => {
    const newSet = new Set(testQuestionIds);
    if (newSet.has(questionId)) {
      newSet.delete(questionId);
      // We can use a custom server action or just delete by question_id assuming it's unique in this test context
      await adminDelete("prep_mock_test_questions", "question_id", questionId);
    } else {
      newSet.add(questionId);
      await adminInsert("prep_mock_test_questions", { test_id: managingTestId, question_id: questionId, order_index: newSet.size });
    }
    setTestQuestionIds(newSet);
  };
"""

content = re.sub(
    r'const toggleTestQuestion = async \(questionId: string\) => \{.*?\n  \};',
    toggle_func.strip(),
    content,
    flags=re.DOTALL
)

# Fix publishTest
publish_func = """
  const publishTest = async (testId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await adminUpdate("prep_mock_tests", { status: newStatus }, "id", testId);
    fetchMockTests(tExamId);
  };
"""

content = re.sub(
    r'const publishTest = async \(testId: string, currentStatus: string\) => \{.*?\n  \};',
    publish_func.strip(),
    content,
    flags=re.DOTALL
)

with open("src/components/admin/PrepDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed toggle/publish")
