import re

with open("src/components/admin/PrepDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add state variables for Mock Tests
tests_state = """
  // Mock Tests State
  const [tExamId, setTExamId] = useState<string>("");
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [isDraftingTest, setIsDraftingTest] = useState(false);
  const [newTest, setNewTest] = useState({
    title: "", duration: 120, totalMarks: 100, negativeMarking: 0.25, instructions: ""
  });
  
  // Managing questions inside a test
  const [managingTestId, setManagingTestId] = useState<string | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [testQuestionIds, setTestQuestionIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (activeTab === "tests" && tExamId) {
      fetchMockTests(tExamId);
    }
  }, [tExamId, activeTab]);

  const fetchMockTests = async (examId: string) => {
    const { data } = await supabase.from("prep_mock_tests").select("*").eq("exam_id", examId).order("created_at", { ascending: false });
    if (data) setMockTests(data);
  };

  const saveMockTest = async () => {
    if (!tExamId || !newTest.title) return alert("Exam and Title required.");
    const { error } = await supabase.from("prep_mock_tests").insert([{
      exam_id: tExamId,
      title: newTest.title,
      duration_minutes: newTest.duration,
      total_marks: newTest.totalMarks,
      negative_marking: newTest.negativeMarking,
      instructions: newTest.instructions,
      status: "DRAFT"
    }]);

    if (!error) {
      setIsDraftingTest(false);
      setNewTest({ title: "", duration: 120, totalMarks: 100, negativeMarking: 0.25, instructions: "" });
      fetchMockTests(tExamId);
    } else {
      alert("Error: " + error.message);
    }
  };

  const openTestManager = async (testId: string) => {
    setManagingTestId(testId);
    // Fetch all questions for this exam
    const { data: qData } = await supabase.from("prep_questions").select("id, question_text, prep_topics(title)").eq("exam_id", tExamId);
    if (qData) setAvailableQuestions(qData);
    
    // Fetch currently mapped questions
    const { data: mappedData } = await supabase.from("prep_mock_test_questions").select("question_id").eq("test_id", testId);
    if (mappedData) {
      setTestQuestionIds(new Set(mappedData.map(m => m.question_id)));
    }
  };

  const toggleTestQuestion = async (questionId: string) => {
    const newSet = new Set(testQuestionIds);
    if (newSet.has(questionId)) {
      newSet.delete(questionId);
      await supabase.from("prep_mock_test_questions").delete().match({ test_id: managingTestId, question_id: questionId });
    } else {
      newSet.add(questionId);
      await supabase.from("prep_mock_test_questions").insert([{ test_id: managingTestId, question_id: questionId, order_index: newSet.size }]);
    }
    setTestQuestionIds(newSet);
  };

  const publishTest = async (testId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await supabase.from("prep_mock_tests").update({ status: newStatus }).eq("id", testId);
    fetchMockTests(tExamId);
  };
"""

content = content.replace("  // Exams State", tests_state + "\n  // Exams State")


old_tests_tab = """        {/* ===================== TESTS TAB (Placeholder) ===================== */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Mock Test Creator</h3>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                <Plus size={16} /> Draft Test
              </button>
            </div>
            <p className="text-slate-500 text-sm">Package questions from the bank into a timed mock test. (Coming in next step)</p>
          </div>
        )}"""


new_tests_tab = """        {/* ===================== TESTS TAB ===================== */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Mock Test Creator</h3>
              {tExamId && !isDraftingTest && !managingTestId && (
                <button onClick={() => setIsDraftingTest(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                  <Plus size={16} /> Draft Test
                </button>
              )}
            </div>

            {/* Exam Selector */}
            {!managingTestId && (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Exam</label>
                <select value={tExamId} onChange={(e) => setTExamId(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-medium outline-none">
                  <option value="">-- Choose an Exam --</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
                </select>
              </div>
            )}

            {/* Create Test Form */}
            {isDraftingTest && tExamId && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800/50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-orange-800 dark:text-orange-300">Draft New Mock Test</h4>
                  <button onClick={() => setIsDraftingTest(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Test Title</label>
                    <input type="text" value={newTest.title} onChange={e => setNewTest({...newTest, title: e.target.value})} placeholder="e.g. Full Length Mock Test 1" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration (Minutes)</label>
                    <input type="number" value={newTest.duration} onChange={e => setNewTest({...newTest, duration: parseInt(e.target.value)})} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Marks</label>
                    <input type="number" value={newTest.totalMarks} onChange={e => setNewTest({...newTest, totalMarks: parseInt(e.target.value)})} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Negative Marking</label>
                    <input type="number" step="0.25" value={newTest.negativeMarking} onChange={e => setNewTest({...newTest, negativeMarking: parseFloat(e.target.value)})} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Instructions (Optional)</label>
                    <textarea value={newTest.instructions} onChange={e => setNewTest({...newTest, instructions: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" rows={2}></textarea>
                  </div>
                </div>

                <button onClick={saveMockTest} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors">
                  <Save size={18} /> Save Test Metadata
                </button>
              </div>
            )}

            {/* Manage Questions Mode */}
            {managingTestId ? (
              <div className="space-y-4 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">Add Questions to Test</h4>
                  <button onClick={() => setManagingTestId(null)} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Done</button>
                </div>
                <div className="text-sm text-slate-500 mb-4 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <strong className="text-indigo-600">{testQuestionIds.size} Questions Selected</strong>. Check the boxes below to add or remove questions from this mock test.
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {availableQuestions.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No questions found in this Exam's Question Bank yet.</p>
                  ) : (
                    availableQuestions.map((q) => (
                      <label key={q.id} className="flex gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={testQuestionIds.has(q.id)}
                          onChange={() => toggleTestQuestion(q.id)}
                          className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-indigo-500 mb-1">{q.prep_topics?.title || 'General'}</div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{q.question_text}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* List Tests */
              tExamId && !isDraftingTest && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockTests.length === 0 ? (
                    <div className="col-span-2 text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No mock tests drafted yet for this exam.
                    </div>
                  ) : (
                    mockTests.map(test => (
                      <div key={test.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{test.title}</h4>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full ${test.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {test.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500 mb-4">
                          <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">{test.duration_minutes} Mins</span>
                          <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">{test.total_marks} Marks</span>
                          <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded">-{test.negative_marking} Penalty</span>
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                          <button onClick={() => openTestManager(test.id)} className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-bold py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                            Manage Questions
                          </button>
                          <button onClick={() => publishTest(test.id, test.status)} className={`px-4 text-sm font-bold rounded-lg transition-colors ${test.status === 'PUBLISHED' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
                            {test.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )
            )}

            {!tExamId && !managingTestId && (
              <div className="text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Activity size={48} className="mx-auto mb-3 opacity-50" />
                Select an exam from the dropdown to draft mock tests.
              </div>
            )}
          </div>
        )}"""

content = content.replace(old_tests_tab, new_tests_tab)

with open("src/components/admin/PrepDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Mock Test Creator")
