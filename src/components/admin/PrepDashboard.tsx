"use client";

import { useState, useEffect } from "react";
import { BookOpen, Layers, Target, FileQuestion, Plus, Trash2, Activity, Save, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type PrepTab = "exams" | "syllabus" | "questions" | "tests";

interface Exam {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export default function PrepDashboard() {
  const [activeTab, setActiveTab] = useState<PrepTab>("exams");
  

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

  // Exams State
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [newExam, setNewExam] = useState({ title: "", slug: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeTab === "exams") {
      fetchExams();
    }
  }, [activeTab]);

  const fetchExams = async () => {
    setIsLoadingExams(true);
    const { data, error } = await supabase.from("prep_exams").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setExams(data);
    }
    setIsLoadingExams(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewExam({ ...newExam, title, slug: generateSlug(title) });
  };

  const saveExam = async () => {
    if (!newExam.title || !newExam.slug) return alert("Title and slug are required");
    setIsSaving(true);
    
    const { error } = await supabase.from("prep_exams").insert([{
      title: newExam.title,
      slug: newExam.slug,
      description: newExam.description
    }]);

    if (error) {
      alert("Failed to save exam: " + error.message);
    } else {
      setNewExam({ title: "", slug: "", description: "" });
      setIsCreatingExam(false);
      fetchExams();
    }
    setIsSaving(false);
  };

  const deleteExam = async (id: string) => {
    if (!confirm("Are you sure? This will delete all subjects, topics, and tests linked to this exam!")) return;
    const { error } = await supabase.from("prep_exams").delete().eq("id", id);
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      fetchExams();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-2">Exam Preparation Hub</h2>
          <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
            Welcome to the advanced Learning Management System (LMS). Here you can build out a complete syllabus, load thousands of multiple-choice questions into the bank, and package them into competitive mock tests.
          </p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 overflow-x-auto gap-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab("exams")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "exams" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <Target size={18} /> Manage Exams
        </button>
        <button 
          onClick={() => setActiveTab("syllabus")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "syllabus" ? "bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <Layers size={18} /> Syllabus Builder
        </button>
        <button 
          onClick={() => setActiveTab("questions")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "questions" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <FileQuestion size={18} /> Question Bank
        </button>
        <button 
          onClick={() => setActiveTab("tests")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "tests" ? "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <Activity size={18} /> Mock Tests
        </button>
      </div>

      {/* Content Areas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
        
        {/* ===================== EXAMS TAB ===================== */}
        {activeTab === "exams" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Active Exams</h3>
              {!isCreatingExam && (
                <button 
                  onClick={() => setIsCreatingExam(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} /> Create Exam
                </button>
              )}
            </div>

            {/* Create Form */}
            {isCreatingExam && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800 dark:text-white">Create New Exam</h4>
                  <button onClick={() => setIsCreatingExam(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Exam Title</label>
                    <input 
                      type="text" 
                      value={newExam.title} 
                      onChange={handleTitleChange} 
                      placeholder="e.g. ADRE Grade III"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                    <input 
                      type="text" 
                      value={newExam.slug} 
                      onChange={(e) => setNewExam({...newExam, slug: e.target.value})} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
                    <input 
                      type="text" 
                      value={newExam.description} 
                      onChange={(e) => setNewExam({...newExam, description: e.target.value})} 
                      placeholder="e.g. State Level Recruitment Commission for Class-III Posts"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={saveExam} 
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  {isSaving ? "Saving..." : "Save Exam"}
                </button>
              </div>
            )}

            {/* List */}
            {isLoadingExams ? (
              <div className="py-12 flex justify-center"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>
            ) : exams.length === 0 && !isCreatingExam ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Target size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 font-medium">No exams created yet. Click "Create Exam" to start.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams.map(exam => (
                  <div key={exam.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-indigo-700 dark:text-indigo-400">{exam.title}</h4>
                      <button onClick={() => deleteExam(exam.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="text-xs font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-1 rounded inline-block mb-3">
                      /{exam.slug}
                    </div>
                    {exam.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{exam.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== SYLLABUS TAB ===================== */}
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
        )}

        {/* ===================== QUESTIONS TAB (Placeholder) ===================== */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Question Bank</h3>
            </div>
            <p className="text-slate-500 text-sm">Add multiple choice questions here. (Coming in next step)</p>
          </div>
        )}

        {/* ===================== TESTS TAB (Placeholder) ===================== */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Mock Test Creator</h3>
            </div>
            <p className="text-slate-500 text-sm">Package questions from the bank into a timed mock test. (Coming in next step)</p>
          </div>
        )}

      </div>
    </div>
  );
}
