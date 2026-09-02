
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateQuestionsAction } from "./actions";
import { saveQuestionAction } from "../actions";
import { Sparkles, FileText, CheckCircle, AlertTriangle, X, Play, Loader2, ArrowRight } from "lucide-react";

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
    source: "AI Generated",
    year: new Date().getFullYear().toString(),
    tags: "ai-generated"
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!sourceText.trim()) {
      setErrorMsg("Please provide source text.");
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
        difficulty: formData.difficulty_level
      });
      
      setGeneratedQuestions(res);
      setStep(3); // Go to review
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const removeQuestion = (id: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const approveQuestion = async (q: any) => {
    try {
      const payload = {
        question_text: q.question_text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        exam_id: formData.exam_id || null,
        subject_id: formData.subject_id || null,
        chapter_id: formData.chapter_id || null,
        topic_id: formData.topic_id,
        difficulty_level: formData.difficulty_level,
        source: formData.source,
        year: parseInt(formData.year),
        tags: formData.tags.split(",").map(t => t.trim()),
        status: "DRAFT" // Always enforce DRAFT on first approval
      };
      
      await saveQuestionAction(payload);
      removeQuestion(q.id);
    } catch (e) {
      alert("Failed to save question to database.");
    }
  };

  const handleInlineEdit = (id: string, field: string, value: string) => {
    setGeneratedQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-indigo-600" /> AI Question Factory
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Generate structured MCQs from source material.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 text-sm font-bold">
        <div className={`px-4 py-2 rounded-lg ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1. Source & Metadata</div>
        <ArrowRight size={16} className="text-slate-300" />
        <div className={`px-4 py-2 rounded-lg ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2. Generating</div>
        <ArrowRight size={16} className="text-slate-300" />
        <div className={`px-4 py-2 rounded-lg ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3. Review & Approve</div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-2 font-bold">
          <AlertTriangle size={18} /> {errorMsg}
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-2 flex items-center gap-2"><FileText size={18} className="text-indigo-600"/> 1. Source Context</h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Paste Source Text / Notes / Document Content</label>
              <textarea 
                value={sourceText} 
                onChange={e => setSourceText(e.target.value)} 
                className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste the study material here. The AI will strictly extract facts from this text to generate questions..."
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">Number of Questions</label>
                <select value={count} onChange={e => setCount(parseInt(e.target.value))} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold">
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={25}>25 Questions (Max Batch)</option>
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
                <select value={formData.difficulty_level} onChange={e => handleChange("difficulty_level", e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
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

            <div className="pt-6 text-right">
              <button 
                onClick={handleGenerate} 
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2 ml-auto"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Generating AI Questions...</> : <><Play size={18} /> Generate Batch</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
            <div className="font-bold text-indigo-900">
              Generated {generatedQuestions.length} questions. Please review them below. Approved questions will be saved as DRAFT in the Question Bank.
            </div>
            <button onClick={() => setStep(1)} className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg border hover:bg-indigo-50 text-sm">Generate More</button>
          </div>

          {generatedQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-bold bg-white rounded-2xl border border-slate-200">
              <CheckCircle size={48} className="mx-auto mb-4 text-emerald-400" />
              All questions in this batch have been processed.
            </div>
          ) : (
            generatedQuestions.map((q, index) => (
              <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                
                {/* Editor Column */}
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black uppercase text-slate-400">AI Generated Question #{index + 1}</span>
                     {q.duplicateRisk === 'HIGH' && <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded">HIGH DUPLICATE RISK</span>}
                     {q.duplicateRisk === 'POSSIBLE' && <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded">POSSIBLE DUPLICATE</span>}
                  </div>
                  
                  <textarea 
                    value={q.question_text} 
                    onChange={e => handleInlineEdit(q.id, 'question_text', e.target.value)}
                    className="w-full text-lg font-bold text-slate-900 p-2 border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-colors bg-transparent"
                    rows={2}
                  />

                  <div className="space-y-2 pl-4">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const isCorrect = q.correct_answer === opt;
                      return (
                        <div key={opt} className={`flex items-center gap-3 p-2 rounded-lg border ${isCorrect ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100'}`}>
                          <button 
                            onClick={() => handleInlineEdit(q.id, 'correct_answer', opt)}
                            className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                          >
                            {opt}
                          </button>
                          <input 
                            type="text" 
                            value={q[`option${opt}`]} 
                            onChange={e => handleInlineEdit(q.id, `option${opt}`, e.target.value)}
                            className="flex-1 bg-transparent border-none text-sm font-medium outline-none p-1"
                          />
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">Explanation</span>
                    <textarea 
                      value={q.explanation} 
                      onChange={e => handleInlineEdit(q.id, 'explanation', e.target.value)}
                      className="w-full text-sm text-indigo-900 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
                    />
                  </div>
                </div>

                {/* Actions Column */}
                <div className="w-full md:w-64 bg-slate-50 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    {q.duplicateWarning && (
                       <div className="bg-amber-100 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
                         <strong>Duplicate Warning:</strong>
                         <p className="mt-1 line-clamp-3 italic">"{q.duplicateWarning}"</p>
                       </div>
                    )}
                    
                    <div className="text-xs text-slate-500 space-y-1">
                      <div><strong>Difficulty:</strong> {formData.difficulty_level}</div>
                      <div><strong>Topic:</strong> Assigned</div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <button onClick={() => approveQuestion(q)} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Approve & Save
                    </button>
                    <button onClick={() => removeQuestion(q.id)} className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold rounded-lg text-sm transition flex items-center justify-center gap-2">
                      <X size={16} /> Reject & Discard
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
