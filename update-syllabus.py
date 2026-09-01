import re

with open("src/components/admin/PrepDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# First, we need to add the state variables for the Syllabus builder at the top.
# Look for: // Exams State
# We will inject the Syllabus state right after it.
syllabus_state = """
  // Syllabus State
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [addingToSubjectId, setAddingToSubjectId] = useState<string | null>(null);
  const [addingToChapterId, setAddingToChapterId] = useState<string | null>(null);

  // Fetch hierarchy when an exam is selected
  useEffect(() => {
    if (activeTab === "syllabus" && selectedExamId) {
      fetchSyllabus(selectedExamId);
    }
  }, [selectedExamId, activeTab]);

  const fetchSyllabus = async (examId: string) => {
    const [subRes, chapRes, topRes] = await Promise.all([
      supabase.from("prep_subjects").select("*").eq("exam_id", examId).order("order_index"),
      supabase.from("prep_chapters").select("*, prep_subjects!inner(exam_id)").eq("prep_subjects.exam_id", examId),
      supabase.from("prep_topics").select("*, prep_chapters!inner(prep_subjects!inner(exam_id))").eq("prep_chapters.prep_subjects.exam_id", examId)
    ]);
    
    if (subRes.data) setSubjects(subRes.data);
    if (chapRes.data) setChapters(chapRes.data);
    if (topRes.data) setTopics(topRes.data);
  };

  const addSubject = async () => {
    if (!newSubjectTitle || !selectedExamId) return;
    const { data, error } = await supabase.from("prep_subjects").insert([{ exam_id: selectedExamId, title: newSubjectTitle }]).select();
    if (!error && data) {
      setSubjects([...subjects, data[0]]);
      setNewSubjectTitle("");
    }
  };

  const addChapter = async (subjectId: string) => {
    if (!newChapterTitle) return;
    const { data, error } = await supabase.from("prep_chapters").insert([{ subject_id: subjectId, title: newChapterTitle }]).select();
    if (!error && data) {
      setChapters([...chapters, data[0]]);
      setNewChapterTitle("");
      setAddingToSubjectId(null);
    }
  };

  const addTopic = async (chapterId: string) => {
    if (!newTopicTitle) return;
    const { data, error } = await supabase.from("prep_topics").insert([{ chapter_id: chapterId, title: newTopicTitle }]).select();
    if (!error && data) {
      setTopics([...topics, data[0]]);
      setNewTopicTitle("");
      setAddingToChapterId(null);
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if(!confirm("Delete this item and all its contents?")) return;
    await supabase.from(table).delete().eq("id", id);
    if(selectedExamId) fetchSyllabus(selectedExamId);
  };
"""

content = content.replace("  // Exams State", syllabus_state + "\n  // Exams State")

# Now, replace the placeholder Syllabus tab rendering logic
old_syllabus_tab = """        {/* ===================== SYLLABUS TAB (Placeholder) ===================== */}
        {activeTab === "syllabus" && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Syllabus Builder</h3>
            </div>
            <p className="text-slate-500 text-sm">Select an exam to start building its Subjects, Chapters, and Topics hierarchy. (Coming in next step)</p>
          </div>
        )}"""

new_syllabus_tab = """        {/* ===================== SYLLABUS TAB ===================== */}
        {activeTab === "syllabus" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Syllabus Builder</h3>
            </div>
            
            {/* Exam Selector */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Exam to Manage</label>
              <select 
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-fuchsia-500 outline-none"
              >
                <option value="">-- Choose an Exam --</option>
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.title}</option>
                ))}
              </select>
            </div>

            {selectedExamId ? (
              <div className="space-y-6">
                
                {/* Add Subject Row */}
                <div className="flex gap-2 items-center bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800/30">
                  <input 
                    type="text" 
                    value={newSubjectTitle} 
                    onChange={(e) => setNewSubjectTitle(e.target.value)} 
                    placeholder="New Subject Name (e.g. Mathematics)" 
                    className="flex-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                  />
                  <button onClick={addSubject} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2">
                    <Plus size={18} /> Add Subject
                  </button>
                </div>

                {/* Syllabus Tree */}
                <div className="space-y-4">
                  {subjects.map(subject => (
                    <div key={subject.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                      {/* Subject Header */}
                      <div className="bg-slate-100 dark:bg-slate-900 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <Layers size={20} className="text-fuchsia-500" /> {subject.title}
                        </h4>
                        <div className="flex gap-2">
                          <button onClick={() => setAddingToSubjectId(subject.id)} className="text-xs font-bold text-fuchsia-600 bg-fuchsia-100 dark:bg-fuchsia-900/50 px-3 py-1.5 rounded-md hover:bg-fuchsia-200 transition-colors">
                            + Chapter
                          </button>
                          <button onClick={() => deleteItem('prep_subjects', subject.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={16}/></button>
                        </div>
                      </div>

                      {/* Add Chapter Input */}
                      {addingToSubjectId === subject.id && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex gap-2">
                          <input type="text" autoFocus value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} placeholder="Chapter Name (e.g. Arithmetic)" className="flex-1 p-2 text-sm rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 outline-none" />
                          <button onClick={() => addChapter(subject.id)} className="bg-slate-800 text-white px-3 py-1.5 text-sm font-bold rounded">Save</button>
                          <button onClick={() => setAddingToSubjectId(null)} className="text-slate-500 px-2"><X size={16}/></button>
                        </div>
                      )}

                      {/* Chapters */}
                      <div className="p-0">
                        {chapters.filter(c => c.subject_id === subject.id).map(chapter => (
                          <div key={chapter.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 pl-8 pr-4 py-3 bg-white dark:bg-slate-800">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-semibold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> {chapter.title}
                              </h5>
                              <div className="flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                <button onClick={() => setAddingToChapterId(chapter.id)} className="text-xs text-indigo-600 font-bold hover:underline">+ Topic</button>
                                <button onClick={() => deleteItem('prep_chapters', chapter.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                              </div>
                            </div>
                            
                            {/* Add Topic Input */}
                            {addingToChapterId === chapter.id && (
                              <div className="ml-4 mb-2 flex gap-2">
                                <input type="text" autoFocus value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)} placeholder="Topic Name (e.g. Percentage)" className="flex-1 p-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 outline-none" />
                                <button onClick={() => addTopic(chapter.id)} className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 text-xs rounded">Save</button>
                                <button onClick={() => setAddingToChapterId(null)} className="text-slate-400"><X size={14}/></button>
                              </div>
                            )}

                            {/* Topics */}
                            <div className="ml-4 flex flex-wrap gap-2">
                              {topics.filter(t => t.chapter_id === chapter.id).map(topic => (
                                <div key={topic.id} className="group flex items-center gap-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                  {topic.title}
                                  <button onClick={() => deleteItem('prep_topics', topic.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><X size={12}/></button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                  
                  {subjects.length === 0 && (
                    <div className="text-center p-8 text-slate-500">No subjects added yet. Add your first subject above.</div>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Target size={48} className="mx-auto mb-3 opacity-50" />
                Select an exam from the dropdown to build its syllabus.
              </div>
            )}
          </div>
        )}"""

content = content.replace(old_syllabus_tab, new_syllabus_tab)

with open("src/components/admin/PrepDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Syllabus Builder")
