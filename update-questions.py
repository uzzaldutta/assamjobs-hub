import re

with open("src/components/admin/PrepDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state variables for Question Bank
questions_state = """
  // Questions State
  const [qExamId, setQExamId] = useState<string>("");
  const [qSubjectId, setQSubjectId] = useState<string>("");
  const [qChapterId, setQChapterId] = useState<string>("");
  const [qTopicId, setQTopicId] = useState<string>("");
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQ, setNewQ] = useState({
    text: "", optA: "", optB: "", optC: "", optD: "", correct: "A", explanation: "", difficulty: "MEDIUM"
  });

  // Fetch questions when a topic is selected
  useEffect(() => {
    if (activeTab === "questions" && qTopicId) {
      fetchQuestions(qTopicId);
    }
  }, [qTopicId, activeTab]);

  // We need to load syllabus dropdowns for the question bank too
  useEffect(() => {
    if (activeTab === "questions" && qExamId) {
      fetchSyllabus(qExamId); // Reusing the syllabus fetcher so dropdowns populate!
    }
  }, [qExamId, activeTab]);

  const fetchQuestions = async (topicId: string) => {
    const { data } = await supabase.from("prep_questions").select("*").eq("topic_id", topicId).order("created_at", { ascending: false });
    if (data) setQuestions(data);
  };

  const saveQuestion = async () => {
    if (!qExamId || !qSubjectId || !qTopicId) return alert("Please select Exam, Subject, and Topic.");
    if (!newQ.text || !newQ.optA || !newQ.optB) return alert("Question and at least 2 options are required.");

    const optionsArray = [newQ.optA, newQ.optB, newQ.optC, newQ.optD].filter(Boolean);
    const correctString = newQ.correct === "A" ? newQ.optA : 
                          newQ.correct === "B" ? newQ.optB : 
                          newQ.correct === "C" ? newQ.optC : newQ.optD;

    const { error } = await supabase.from("prep_questions").insert([{
      exam_id: qExamId,
      subject_id: qSubjectId,
      chapter_id: qChapterId || null,
      topic_id: qTopicId,
      question_text: newQ.text,
      options: optionsArray,
      correct_answer: correctString,
      explanation: newQ.explanation,
      difficulty: newQ.difficulty
    }]);

    if (!error) {
      setNewQ({ text: "", optA: "", optB: "", optC: "", optD: "", correct: "A", explanation: "", difficulty: "MEDIUM" });
      setIsAddingQuestion(false);
      fetchQuestions(qTopicId);
    } else {
      alert("Error saving question: " + error.message);
    }
  };
"""

content = content.replace("  // Exams State", questions_state + "\n  // Exams State")

# 2. Replace the placeholder Questions tab
old_questions_tab = """        {/* ===================== QUESTIONS TAB (Placeholder) ===================== */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Question Bank</h3>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                <Plus size={16} /> Add Question
              </button>
            </div>
            <p className="text-slate-500 text-sm">Add multiple choice questions here. You can link them to specific topics.</p>
          </div>
        )}"""

new_questions_tab = """        {/* ===================== QUESTIONS TAB ===================== */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Question Bank</h3>
              {qTopicId && !isAddingQuestion && (
                <button onClick={() => setIsAddingQuestion(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                  <Plus size={16} /> Add Question
                </button>
              )}
            </div>
            
            {/* Context Selectors */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">1. Exam</label>
                <select value={qExamId} onChange={e => { setQExamId(e.target.value); setQSubjectId(""); setQChapterId(""); setQTopicId(""); }} className="w-full p-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none">
                  <option value="">Select Exam</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">2. Subject</label>
                <select value={qSubjectId} onChange={e => { setQSubjectId(e.target.value); setQChapterId(""); setQTopicId(""); }} disabled={!qExamId} className="w-full p-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none disabled:opacity-50">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">3. Chapter</label>
                <select value={qChapterId} onChange={e => { setQChapterId(e.target.value); setQTopicId(""); }} disabled={!qSubjectId} className="w-full p-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none disabled:opacity-50">
                  <option value="">Select Chapter</option>
                  {chapters.filter(c => c.subject_id === qSubjectId).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">4. Topic</label>
                <select value={qTopicId} onChange={e => setQTopicId(e.target.value)} disabled={!qChapterId} className="w-full p-2 text-sm rounded-lg border border-emerald-500 dark:border-emerald-600 bg-white dark:bg-slate-900 outline-none disabled:opacity-50">
                  <option value="">Select Topic</option>
                  {topics.filter(t => t.chapter_id === qChapterId).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
            </div>

            {/* Add Question Form */}
            {isAddingQuestion && qTopicId && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Create Multiple Choice Question</h4>
                  <button onClick={() => setIsAddingQuestion(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Question Text</label>
                  <textarea value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" rows={3}></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Option A</label>
                    <input type="text" value={newQ.optA} onChange={e => setNewQ({...newQ, optA: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Option B</label>
                    <input type="text" value={newQ.optB} onChange={e => setNewQ({...newQ, optB: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Option C (Optional)</label>
                    <input type="text" value={newQ.optC} onChange={e => setNewQ({...newQ, optC: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Option D (Optional)</label>
                    <input type="text" value={newQ.optD} onChange={e => setNewQ({...newQ, optD: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-emerald-200/50 dark:border-emerald-800/50">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 text-emerald-600">Correct Answer</label>
                    <select value={newQ.correct} onChange={e => setNewQ({...newQ, correct: e.target.value})} className="w-full p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-slate-900 font-bold outline-none">
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      {newQ.optC && <option value="C">Option C</option>}
                      {newQ.optD && <option value="D">Option D</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                    <select value={newQ.difficulty} onChange={e => setNewQ({...newQ, difficulty: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none">
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Explanation (Visible after answering)</label>
                  <textarea value={newQ.explanation} onChange={e => setNewQ({...newQ, explanation: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" rows={2}></textarea>
                </div>

                <button onClick={saveQuestion} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors">
                  <Save size={18} /> Save Question to Bank
                </button>
              </div>
            )}

            {/* List Questions */}
            {qTopicId && !isAddingQuestion && (
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <FileQuestion size={40} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-500">No questions for this topic yet.</p>
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => deleteItem("prep_questions", q.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="font-black text-slate-300 dark:text-slate-600 text-lg">Q{idx+1}</span>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200 mb-3">{q.question_text}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {q.options.map((opt: string, i: number) => (
                              <div key={i} className={`p-2 rounded-lg text-sm border ${opt === q.correct_answer ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-800 dark:text-emerald-200 font-semibold' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                <span className="mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span> {opt}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!qTopicId && (
              <div className="text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                Select Exam, Subject, Chapter, and Topic to view or add questions.
              </div>
            )}
          </div>
        )}"""

content = content.replace(old_questions_tab, new_questions_tab)

with open("src/components/admin/PrepDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Question Bank")
