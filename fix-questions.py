import re

with open("src/components/admin/PrepDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update saveQuestion to just save 'A', 'B', 'C', 'D' instead of the option text
save_q_func = """
  const saveQuestion = async () => {
    if (!newQ.text || !newQ.optA || !newQ.optB || !newQ.optC || !newQ.optD) {
      return alert("All options are required.");
    }
    
    // As per security patch, save A/B/C/D directly
    const correctAnswerFormat = newQ.correct;

    let error = null;
    try {
      await adminInsert("prep_questions", {
        exam_id: qExamId,
        subject_id: qSubjectId,
        chapter_id: qChapterId,
        topic_id: qTopicId,
        question_text: newQ.text,
        options: {
          A: newQ.optA,
          B: newQ.optB,
          C: newQ.optC,
          D: newQ.optD
        },
        correct_answer: correctAnswerFormat,
        explanation: newQ.explanation,
        difficulty: newQ.difficulty,
        status: "PUBLISHED"
      });
    } catch(e:any) { error = e; }

    if (!error) {
      setNewQ({ text: "", optA: "", optB: "", optC: "", optD: "", correct: "A", explanation: "", difficulty: "MEDIUM" });
      setIsAddingQ(false);
      fetchQuestions(qTopicId);
    } else {
      alert("Error: " + error.message);
    }
  };
"""

content = re.sub(
    r'const saveQuestion = async \(\) => \{.*?\n  \};',
    save_q_func.strip(),
    content,
    flags=re.DOTALL
)

# Also fix the rendering in the question list
q_list_old = """
                    <div className="mt-3 text-sm">
                      <span className="font-bold text-emerald-600">Correct:</span> {q.correct_answer}
                    </div>
"""
q_list_new = """
                    <div className="mt-3 text-sm">
                      <span className="font-bold text-emerald-600">Correct:</span> Option {q.correct_answer}
                    </div>
"""
content = content.replace(q_list_old, q_list_new)

# UI Refinement: Remove heavy gradients from PrepDashboard
content = content.replace('bg-gradient-to-br from-indigo-900 to-slate-900', 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800')
content = content.replace('text-indigo-100', 'text-slate-600 dark:text-slate-400')

with open("src/components/admin/PrepDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated PrepDashboard")
