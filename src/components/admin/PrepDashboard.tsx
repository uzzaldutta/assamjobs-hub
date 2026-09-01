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

        {/* ===================== SYLLABUS TAB (Placeholder) ===================== */}
        {activeTab === "syllabus" && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Syllabus Builder</h3>
            </div>
            <p className="text-slate-500 text-sm">Select an exam to start building its Subjects, Chapters, and Topics hierarchy. (Coming in next step)</p>
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
