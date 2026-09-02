
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateQuestionsAction } from "./actions";
import { saveQuestionAction } from "../actions";
import { Sparkles, FileText, CheckCircle, AlertTriangle, X, Play, Loader2, ArrowRight, ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";

export default function GeneratorClient() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [sourceText, setSourceText] = useState("");
  const [count, setCount] = useState(5);
  
  const [hierarchy, setHierarchy] = useState<{ exams: any[]; subjects: any[]; chapters: any[]; topics: any[] }>({ exams: [], subjects: [], chapters: [], topics: [] });
  
  const [formData, setFormData] = useState({
    exam_id: "",
    subject_id: "",
    chapter_id: "",
    topic_id: "",
    difficulty_level: "MEDIUM",
    language: "English",
    sourceGrounded: true,
    source: "AI Generated",
    year: new Date().getFullYear().toString(),
    tags: "ai-generated"
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ approved: 0, rejected: 0 });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("ai_review_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.questions && parsed.questions.length > 0) {
          if (confirm("You have an unfinished review session. Do you want to resume?")) {
            setGeneratedQuestions(parsed.questions);
            setCurrentIndex(parsed.currentIndex || 0);
            setFormData(parsed.formData);
            setStats(parsed.stats);
            setStep(3);
          } else {
            localStorage.removeItem("ai_review_session");
          }
        }
      } catch (e) {
        localStorage.removeItem("ai_review_session");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (step === 3 && generatedQuestions.length > 0) {
      localStorage.setItem("ai_review_session", JSON.stringify({
        questions: generatedQuestions,
        currentIndex,
        formData,
        stats
      }));
    } else if (step === 1) {
      localStorage.removeItem("ai_review_session");
    }
  }, [generatedQuestions, currentIndex, step, formData, stats]);

  useEffect(() => {
    supabase.from("prep_exams").select("id, title").then(({ data }) => {
      if (data) setHierarchy(prev => ({ ...prev, exams: data }));
    });
  }, []);

  useEffect(() => {
    if (formData.exam_id) {
      supabase.from("prep_subjects").select("id, title").eq("exam_id", formData.exam_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, subjects: data || [] }));
      });
    }
  }, [formData.exam_id]);

  useEffect(() => {
    if (formData.subject_id) {
      supabase.from("prep_chapters").select("id, title").eq("subject_id", formData.subject_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, chapters: data || [] }));
      });
    }
  }, [formData.subject_id]);

  useEffect(() => {
    if (formData.chapter_id) {
      supabase.from("prep_topics").select("id, title").eq("chapter_id", formData.chapter_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, topics: data || [] }));
      });
    }
  }, [formData.chapter_id]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (formData.sourceGrounded && !sourceText.trim()) {
      setErrorMsg("Please provide source text for Source Grounded mode.");
      return;
    }
    if (!formData.topic_id) {
      setErrorMsg("Topic is required.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      const examTitle = hierarchy.exams.find((e: any) => e.id === formData.exam_id)?.title || "";
      const subjectTitle = hierarchy.subjects.find((e: any) => e.id === formData.subject_id)?.title || "";
      const topicTitle = hierarchy.topics.find((e: any) => e.id === formData.topic_id)?.title || "";
      
      const res = await generateQuestionsAction(sourceText, count, {
        exam: examTitle,
        subject: subjectTitle,
        topic: topicTitle,
        difficulty: formData.difficulty_level,
        language: formData.language,
        sourceGrounded: formData.sourceGrounded
      });
      
      setGeneratedQuestions(res);
      setCurrentIndex(0);
      setStats({ approved: 0, rejected: 0 });
      setStep(3);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const currentQ = generatedQuestions[currentIndex];

  const advanceQueue = () => {
    if (generatedQuestions.length <= 1) {
      setGeneratedQuestions([]);
      setStep(1);
    } else {
      const nextQs = generatedQuestions.filter((_, i) => i !== currentIndex);
      setGeneratedQuestions(nextQs);
      if (currentIndex >= nextQs.length) setCurrentIndex(nextQs.length - 1);
    }
  };

  const approveCurrent = async () => {
    if (!currentQ) return;
    try {
      const payload = {
        question_text: currentQ.question_text,
        optionA: currentQ.optionA,
        optionB: currentQ.optionB,
        optionC: currentQ.optionC,
        optionD: currentQ.optionD,
        correct_answer: currentQ.correct_answer,
        explanation: currentQ.explanation,
        exam_id: formData.exam_id || null,
        subject_id: formData.subject_id || null,
        chapter_id: formData.chapter_id || null,
        topic_id: formData.topic_id,
        difficulty_level: formData.difficulty_level,
        source: formData.source,
        year: parseInt(formData.year),
        tags: formData.tags.split(",").map(t => t.trim()),
        status: "DRAFT"
      };
      await saveQuestionAction(payload);
      setStats(s => ({ ...s, approved: s.approved + 1 }));
      advanceQueue();
    } catch (e) {
      alert("Failed to save question");
    }
  };

  const rejectCurrent = () => {
    if (!currentQ) return;
    setStats(s => ({ ...s, rejected: s.rejected + 1 }));
    advanceQueue();
  };

  const regenerateCurrent = async () => {
    if (!currentQ) return;
    setLoading(true);
    try {
      const examTitle = hierarchy.exams.find((e: any) => e.id === formData.exam_id)?.title || "";
      const subjectTitle = hierarchy.subjects.find((e: any) => e.id === formData.subject_id)?.title || "";
      const topicTitle = hierarchy.topics.find((e: any) => e.id === formData.topic_id)?.title || "";
      
      const res = await generateQuestionsAction(sourceText, 1, {
        exam: examTitle,
        subject: subjectTitle,
        topic: topicTitle,
        difficulty: formData.difficulty_level,
        language: formData.language,
        sourceGrounded: formData.sourceGrounded
      });
      
      if (res.length > 0) {
        const nextQs = [...generatedQuestions];
        nextQs[currentIndex] = res[0];
        setGeneratedQuestions(nextQs);
      }
    } catch (e: any) {
      alert("Failed to regenerate: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInlineEdit = (field: string, value: string) => {
    if (!currentQ) return;
    const nextQs = [...generatedQuestions];
    nextQs[currentIndex] = { ...currentQ, [field]: value };
    setGeneratedQuestions(nextQs);
  };

  // Keyboard Shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (step !== 3 || !currentQ || loading) return;
    const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);
    if (isEditing) return;

    switch (e.key.toLowerCase()) {
      case 'a':
        e.preventDefault();
        approveCurrent();
        break;
      case 'x':
        e.preventDefault();
        rejectCurrent();
        break;
      case 'r':
        e.preventDefault();
        regenerateCurrent();
        break;
      case 'n':
        e.preventDefault();
        if (currentIndex < generatedQuestions.length - 1) setCurrentIndex(currentIndex + 1);
        break;
      case 'p':
        e.preventDefault();
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
        break;
    }
  }, [step, currentQ, loading, currentIndex, generatedQuestions.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-24">
      {step !== 3 && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-indigo-600" /> AI Content Factory
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Professional competitive exam question generation.</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-2 font-bold">
          <AlertTriangle size={18} /> {errorMsg}
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col">
            <h3 className="font-bold border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2"><FileText size={18} className="text-indigo-600"/> 1. Source Context</span>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={formData.sourceGrounded} onChange={e => handleChange("sourceGrounded", e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                Source Grounded
              </label>
            </h3>
            
            <div className="flex-1">
              <textarea 
                value={sourceText} 
                onChange={e => setSourceText(e.target.value)} 
                className="w-full h-full min-h-[300px] p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder={formData.sourceGrounded ? "Paste the exact study material, PDF text, or notes here. The AI will strictly generate facts from this text..." : "Paste inspiration text, PYQs, or syllabus topics here..."}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Batch Size</label>
                <select value={count} onChange={e => setCount(parseInt(e.target.value))} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold">
                  {[5, 10, 15, 20, 25].map(n => <option key={n} value={n}>{n} Questions</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Language</label>
                <select value={formData.language} onChange={e => handleChange("language", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold">
                  <option value="English">English</option>
                  <option value="Assamese">Assamese</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-2">2. Target Metadata</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Exam</label>
                <select value={formData.exam_id} onChange={e => handleChange("exam_id", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                  <option value="">Any / General</option>
                  {hierarchy.exams.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                <select value={formData.subject_id} onChange={e => handleChange("subject_id", e.target.value)} disabled={!formData.exam_id} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm disabled:opacity-50">
                  <option value="">Any / General</option>
                  {hierarchy.subjects.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Chapter</label>
                <select value={formData.chapter_id} onChange={e => handleChange("chapter_id", e.target.value)} disabled={!formData.subject_id} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm disabled:opacity-50">
                  <option value="">Any / General</option>
                  {hierarchy.chapters.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Topic <span className="text-red-500">*</span></label>
                <select value={formData.topic_id} onChange={e => handleChange("topic_id", e.target.value)} disabled={!formData.chapter_id} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm disabled:opacity-50">
                  <option value="">Select Topic...</option>
                  {hierarchy.topics.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Difficulty</label>
                <select value={formData.difficulty_level} onChange={e => handleChange("difficulty_level", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold">
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tags</label>
                <input type="text" value={formData.tags} onChange={e => handleChange("tags", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
              </div>
            </div>

            <div className="pt-6 text-right mt-auto border-t border-slate-100">
              <button 
                onClick={handleGenerate} 
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing and Generating...</> : <><Play size={18} /> Generate {count} Questions</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && currentQ && (
        <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
          
          {/* Review Header */}
          <div className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className="font-black text-lg">Question {currentIndex + 1} of {generatedQuestions.length}</div>
              <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                Approved: <span className="text-emerald-600">{stats.approved}</span> • Rejected: <span className="text-red-500">{stats.rejected}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-bold text-sm disabled:opacity-30 transition">Prev (P)</button>
              <button disabled={currentIndex === generatedQuestions.length - 1} onClick={() => setCurrentIndex(i => i + 1)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-bold text-sm disabled:opacity-30 transition">Next (N)</button>
              <button onClick={() => setStep(1)} className="ml-4 px-3 py-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm">Exit Review</button>
            </div>
          </div>

          {/* Split Pane */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Editor Pane */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Question Text</label>
                  <textarea 
                    value={currentQ.question_text} 
                    onChange={e => handleInlineEdit('question_text', e.target.value)}
                    className="w-full text-xl font-bold text-slate-900 p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Options & Correct Answer</label>
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const isCorrect = currentQ.correct_answer === opt;
                    return (
                      <div key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <button 
                          onClick={() => handleInlineEdit('correct_answer', opt)}
                          className={`w-8 h-8 rounded-full font-black text-sm flex items-center justify-center shrink-0 transition ${isCorrect ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-300'}`}
                        >
                          {opt}
                        </button>
                        <input 
                          type="text" 
                          value={currentQ[`option${opt}`]} 
                          onChange={e => handleInlineEdit(`option${opt}`, e.target.value)}
                          className="flex-1 bg-transparent border-none text-base font-medium outline-none p-1"
                        />
                      </div>
                    )
                  })}
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Explanation</label>
                  <textarea 
                    value={currentQ.explanation} 
                    onChange={e => handleInlineEdit('explanation', e.target.value)}
                    className="w-full text-sm font-medium text-indigo-900 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            {/* Quality Pane */}
            <div className="w-80 bg-slate-50 border-l border-slate-200 overflow-y-auto flex flex-col">
              <div className="p-6 space-y-6 flex-1">
                
                {/* AI Score */}
                <div className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider">AI Quality Score</div>
                  <div className={`text-4xl font-black mt-2 ${currentQ.quality_score >= 85 ? 'text-emerald-600' : currentQ.quality_score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                    {currentQ.quality_score || '-'}/100
                  </div>
                </div>

                {/* Warnings */}
                {currentQ.quality_warnings && currentQ.quality_warnings.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wider">AI Warnings</div>
                    {currentQ.quality_warnings.map((w: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Duplicates */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Duplicate Check</div>
                  {currentQ.duplicateRisk !== 'LOW' ? (
                    <div className={`p-3 rounded-lg border text-sm font-bold ${currentQ.duplicateRisk === 'HIGH' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert size={16} /> 
                        {currentQ.duplicateRisk === 'HIGH' ? 'High Risk' : 'Possible Match'} ({currentQ.duplicateScore}%)
                      </div>
                      <p className="text-xs font-medium opacity-80 leading-relaxed italic line-clamp-4">
                        "{currentQ.duplicateWarning}"
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <CheckCircle size={14} /> Unique Question
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                <button 
                  onClick={regenerateCurrent} 
                  disabled={loading}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <><RefreshCw size={16} /> Regenerate (R)</>}
                </button>
                <button 
                  onClick={approveCurrent} 
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-600/20 rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve & Save (A)
                </button>
                <button 
                  onClick={rejectCurrent} 
                  className="w-full py-2.5 bg-white border-2 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-bold rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                  <X size={16} /> Reject (X)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
