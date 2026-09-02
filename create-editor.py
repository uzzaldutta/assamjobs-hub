code = """
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { saveQuestionAction, checkDuplicateAction } from "../../actions";
import { Save, Copy, X, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function QuestionEditorClient() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    question_text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct_answer: "",
    explanation: "",
    exam_id: "",
    subject_id: "",
    chapter_id: "",
    topic_id: "",
    difficulty_level: "MEDIUM",
    source: "",
    year: new Date().getFullYear().toString(),
    tags: "",
    status: "DRAFT"
  });

  const [hierarchy, setHierarchy] = useState({ exams: [], subjects: [], chapters: [], topics: [] });
  const [duplicate, setDuplicate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formRef = useRef<HTMLDivElement>(null);

  // Autosave & Load
  useEffect(() => {
    const saved = localStorage.getItem("question_draft");
    if (saved) {
      setHasDraft(true);
    }
    
    // Load exams
    supabase.from("prep_exams").select("id, title").then(({ data }) => {
      if (data) setHierarchy(prev => ({ ...prev, exams: data }));
    });
  }, []);

  useEffect(() => {
    if (formData.exam_id) {
      supabase.from("prep_subjects").select("id, title").eq("exam_id", formData.exam_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, subjects: data || [] }));
      });
    } else {
      setHierarchy(prev => ({ ...prev, subjects: [], chapters: [], topics: [] }));
    }
  }, [formData.exam_id]);

  useEffect(() => {
    if (formData.subject_id) {
      supabase.from("prep_chapters").select("id, title").eq("subject_id", formData.subject_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, chapters: data || [] }));
      });
    } else {
      setHierarchy(prev => ({ ...prev, chapters: [], topics: [] }));
    }
  }, [formData.subject_id]);

  useEffect(() => {
    if (formData.chapter_id) {
      supabase.from("prep_topics").select("id, title").eq("chapter_id", formData.chapter_id).then(({ data }) => {
        setHierarchy(prev => ({ ...prev, topics: data || [] }));
      });
    } else {
      setHierarchy(prev => ({ ...prev, topics: [] }));
    }
  }, [formData.chapter_id]);

  // Debounced autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.question_text.length > 5) {
        localStorage.setItem("question_draft", JSON.stringify(formData));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleSave(true);
      } else if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleSave(false);
      } else if (e.key === "Escape") {
        e.preventDefault();
        router.push("/admin/studio/questions");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleDuplicateCheck = async () => {
    if (formData.question_text.length > 10) {
      const dup = await checkDuplicateAction(formData.question_text);
      setDuplicate(dup);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.question_text.trim()) newErrors.question_text = "Required";
    if (!formData.optionA.trim()) newErrors.optionA = "Required";
    if (!formData.optionB.trim()) newErrors.optionB = "Required";
    if (!formData.optionC.trim()) newErrors.optionC = "Required";
    if (!formData.optionD.trim()) newErrors.optionD = "Required";
    if (!formData.correct_answer) newErrors.correct_answer = "Required";
    if (!formData.topic_id) newErrors.topic_id = "Required";
    if (formData.status === "PUBLISHED" && !formData.explanation.trim()) newErrors.explanation = "Required for published";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (addAnother: boolean = false, force: boolean = false) => {
    if (!validate()) return;
    
    setLoading(true);
    
    if (!force) {
      const dup = await checkDuplicateAction(formData.question_text);
      if (dup) {
        setDuplicate(dup);
        setLoading(false);
        return; // Pause for admin review
      }
    }

    try {
      const payload = { ...formData, tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean), year: parseInt(formData.year) || null };
      await saveQuestionAction(payload);
      
      localStorage.removeItem("question_draft");
      setHasDraft(false);

      if (addAnother) {
        setFormData(prev => ({
          ...prev,
          question_text: "", optionA: "", optionB: "", optionC: "", optionD: "", correct_answer: "", explanation: "", status: "DRAFT"
        }));
        setDuplicate(null);
        window.scrollTo(0, 0);
      } else {
        router.push("/admin/studio/questions");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const restoreDraft = () => {
    const saved = localStorage.getItem("question_draft");
    if (saved) setFormData(JSON.parse(saved));
    setHasDraft(false);
  };

  const discardDraft = () => {
    localStorage.removeItem("question_draft");
    setHasDraft(false);
  };

  // Quality Score
  let qualityScore = 0;
  if (formData.question_text.length > 5) qualityScore += 20;
  if (formData.optionA && formData.optionB && formData.optionC && formData.optionD) qualityScore += 20;
  if (formData.correct_answer) qualityScore += 10;
  if (formData.explanation.length > 10) qualityScore += 20;
  if (formData.topic_id) qualityScore += 15;
  if (formData.source) qualityScore += 15;

  return (
    <div className="max-w-6xl mx-auto space-y-6" ref={formRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Quick Add Question</h1>
          <p className="text-slate-500 mt-1 text-sm flex gap-4">
            <span><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-xs">CTRL</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-xs">ENTER</kbd> Save</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-xs">CTRL</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-xs">SHIFT</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-xs">ENTER</kbd> Save & Next</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-32">
            <div className="text-[10px] font-bold text-slate-500 mb-1 flex justify-between">
              <span>QUALITY</span> <span>{qualityScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all ${qualityScore >= 80 ? 'bg-emerald-500' : qualityScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${qualityScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {hasDraft && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 text-sm">
            <AlertTriangle size={16} /> Unsaved draft found from a previous session.
          </div>
          <div className="flex gap-2">
            <button onClick={discardDraft} className="text-xs font-bold text-slate-500 hover:text-slate-700">Discard</button>
            <button onClick={restoreDraft} className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-md hover:bg-amber-200">Restore</button>
          </div>
        </div>
      )}

      {duplicate && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <AlertTriangle size={18} /> Possible Duplicate Detected!
          </div>
          <div className="text-sm text-slate-700 bg-white p-3 rounded border border-rose-100 line-clamp-2">
            {duplicate.question_text}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDuplicate(null)} className="text-xs font-bold px-4 py-2 bg-white text-slate-600 rounded-lg border hover:bg-slate-50">Edit My Question</button>
            <button onClick={() => handleSave(false, true)} className="text-xs font-bold px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Save Anyway</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question Text <span className="text-red-500">*</span></label>
            <textarea
              autoFocus
              value={formData.question_text}
              onChange={e => handleChange("question_text", e.target.value)}
              onBlur={handleDuplicateCheck}
              className={`w-full p-4 min-h-[120px] rounded-xl border-2 transition-colors ${errors.question_text ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'} bg-slate-50 focus:bg-white`}
              placeholder="Enter the question here..."
            />
            
            <div className="mt-6 space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Options & Answer <span className="text-red-500">*</span></label>
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt} className={`flex items-center gap-3 p-2 rounded-xl border-2 transition-colors ${formData.correct_answer === opt ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
                  <button
                    onClick={() => handleChange("correct_answer", opt)}
                    className={`w-8 h-8 rounded-full font-black flex items-center justify-center shrink-0 transition-colors ${formData.correct_answer === opt ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {opt}
                  </button>
                  <input
                    type="text"
                    value={(formData as any)[`option${opt}`]}
                    onChange={e => handleChange(`option${opt}`, e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 p-2 font-medium"
                    placeholder={`Option ${opt}`}
                  />
                  {errors[`option${opt}`] && <AlertTriangle size={16} className="text-red-500 mr-2" />}
                </div>
              ))}
              {errors.correct_answer && <p className="text-xs text-red-500 font-bold mt-1">Please select the correct answer.</p>}
            </div>

            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Explanation</label>
              <textarea
                value={formData.explanation}
                onChange={e => handleChange("explanation", e.target.value)}
                className={`w-full p-4 min-h-[100px] rounded-xl border-2 transition-colors ${errors.explanation ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'} bg-slate-50 focus:bg-white`}
                placeholder="Explain the solution..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white border-b pb-2">Classification</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Exam</label>
              <select value={formData.exam_id} onChange={e => handleChange("exam_id", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="">Select Exam...</option>
                {hierarchy.exams.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
              <select value={formData.subject_id} onChange={e => handleChange("subject_id", e.target.value)} disabled={!formData.exam_id} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm disabled:opacity-50">
                <option value="">Select Subject...</option>
                {hierarchy.subjects.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Chapter</label>
              <select value={formData.chapter_id} onChange={e => handleChange("chapter_id", e.target.value)} disabled={!formData.subject_id} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm disabled:opacity-50">
                <option value="">Select Chapter...</option>
                {hierarchy.chapters.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Topic <span className="text-red-500">*</span></label>
              <select value={formData.topic_id} onChange={e => handleChange("topic_id", e.target.value)} disabled={!formData.chapter_id} className={`w-full p-2.5 rounded-lg border ${errors.topic_id ? 'border-red-400' : 'border-slate-200'} bg-slate-50 text-sm disabled:opacity-50`}>
                <option value="">Select Topic...</option>
                {hierarchy.topics.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white border-b pb-2">Metadata</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Difficulty</label>
                <select value={formData.difficulty_level} onChange={e => handleChange("difficulty_level", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                <select value={formData.status} onChange={e => handleChange("status", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold">
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Source</label>
                <input type="text" value={formData.source} onChange={e => handleChange("source", e.target.value)} placeholder="e.g. ADRE 2022" className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Year</label>
                <input type="number" value={formData.year} onChange={e => handleChange("year", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tags</label>
              <input type="text" value={formData.tags} onChange={e => handleChange("tags", e.target.value)} placeholder="Comma separated..." className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition">
            Cancel (ESC)
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => handleSave(true)} 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold border-2 border-indigo-600 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition disabled:opacity-50"
            >
              <Copy size={18} /> Save & Add Another
            </button>
            <button 
              onClick={() => handleSave(false)} 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? "Saving..." : <><Save size={18} /> Save Question</>}
            </button>
          </div>
        </div>
      </div>
      <div className="h-24"></div> {/* padding for fixed footer */}
    </div>
  );
}
"""
with open("src/app/admin/studio/questions/new/QuestionEditorClient.tsx", "w", encoding="utf-8") as f:
    f.write(code)
