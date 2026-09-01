client_code = """
"use client";

import { useState, useEffect, useRef } from "react";
import { startMockTestSession, submitMockTest } from "@/lib/mock-test/actions";
import { Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Bookmark, X, Loader2, ArrowRight, Target, BarChart3, Activity } from "lucide-react";
import Link from "next/link";

type ViewState = "LANDING" | "ACTIVE" | "SUBMITTING" | "RESULT" | "REVIEW";

interface Question {
  id: string;
  questionNumber: number;
  question_text: string;
  options: any;
}

export default function MockTestEngine({ testId, initialMetadata }: { testId: string, initialMetadata: any }) {
  const [view, setView] = useState<ViewState>("LANDING");
  const [session, setSession] = useState<{ token: string, expiresAt: number } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState("");
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const storageKey = `mock_active_${testId}`;

  // 1. Initial Load & Recovery
  useEffect(() => {
    try {
      const active = localStorage.getItem(storageKey);
      if (active) {
        const parsed = JSON.parse(active);
        // If expired locally, auto-submit. Otherwise resume.
        if (Date.now() < parsed.expiresAt) {
          setSession({ token: parsed.sessionToken, expiresAt: parsed.expiresAt });
          setQuestions(parsed.questions);
          setAnswers(parsed.answers || {});
          setMarkedForReview(parsed.marked || {});
          setVisited(parsed.visited || {});
          setCurrentIndex(parsed.currentIndex || 0);
          setView("ACTIVE");
        } else {
          // Expired. Auto submit it.
          executeSubmission(parsed.sessionToken, parsed.answers || {});
        }
      }
    } catch (e) {}
  }, []);

  // 2. Timer Logic
  useEffect(() => {
    if (view !== "ACTIVE" || !session) return;
    
    const tick = () => {
      const remaining = session.expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeRemaining(0);
        executeSubmission(session.token, answers); // Auto submit
      } else {
        setTimeRemaining(remaining);
      }
    };
    
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [view, session, answers]);

  // Sync state to local storage when active
  useEffect(() => {
    if (view === "ACTIVE" && session) {
      localStorage.setItem(storageKey, JSON.stringify({
        sessionToken: session.token,
        expiresAt: session.expiresAt,
        questions,
        answers,
        marked: markedForReview,
        visited,
        currentIndex
      }));
    }
  }, [view, answers, markedForReview, visited, currentIndex]);

  const handleStart = async () => {
    setView("SUBMITTING");
    setError("");
    try {
      const data = await startMockTestSession(testId);
      setSession({ token: data.sessionToken, expiresAt: data.expiresAt });
      setQuestions(data.questions);
      setVisited({ [data.questions[0].id]: true });
      setView("ACTIVE");
    } catch (e: any) {
      setError(e.message || "Failed to start test");
      setView("LANDING");
    }
  };

  const executeSubmission = async (token: string, finalAnswers: Record<string, string>) => {
    setView("SUBMITTING");
    setShowSubmitConfirm(false);
    try {
      const report = await submitMockTest(token, finalAnswers);
      setResultData(report);
      localStorage.removeItem(storageKey); // Clear active session
      setView("RESULT");
    } catch (e: any) {
      alert("Submission failed. Answers saved locally. Check network.");
      setView("ACTIVE");
    }
  };

  const handleSelectAnswer = (opt: string) => {
    const q = questions[currentIndex];
    setAnswers({ ...answers, [q.id]: opt });
  };

  const handleClear = () => {
    const q = questions[currentIndex];
    const newA = { ...answers };
    delete newA[q.id];
    setAnswers(newA);
  };

  const handleToggleMark = () => {
    const q = questions[currentIndex];
    setMarkedForReview({ ...markedForReview, [q.id]: !markedForReview[q.id] });
  };

  const navigateTo = (index: number) => {
    setCurrentIndex(index);
    setVisited({ ...visited, [questions[index].id]: true });
    setShowPaletteMobile(false);
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(Math.max(0, ms) / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (qId: string) => {
    const isAns = !!answers[qId];
    const isMark = !!markedForReview[qId];
    const isVis = !!visited[qId];
    
    if (isAns && isMark) return "bg-purple-600 text-white border-purple-700 shadow-md";
    if (isMark) return "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700";
    if (isAns) return "bg-emerald-500 text-white border-emerald-600 shadow-md";
    if (isVis) return "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50";
    return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
  };

  // -------------------------------------------------------------
  // VIEW: LANDING
  if (view === "LANDING") {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold text-xs rounded-lg mb-6 uppercase tracking-widest">
            {initialMetadata.prep_exams?.title || "Mock Test"}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">{initialMetadata.title}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-1"><Clock size={16}/> Duration</div>
              <div className="text-xl font-black text-slate-800 dark:text-white">{initialMetadata.duration_minutes} Mins</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
               <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-1"><Target size={16}/> Questions</div>
               <div className="text-xl font-black text-slate-800 dark:text-white">{initialMetadata.question_count}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
               <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-1"><CheckCircle2 size={16}/> Marks</div>
               <div className="text-xl font-black text-slate-800 dark:text-white">{initialMetadata.total_marks}</div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl">
               <div className="text-sm font-bold text-red-500 mb-1 flex items-center gap-1"><AlertTriangle size={16}/> Penalty</div>
               <div className="text-xl font-black text-red-700 dark:text-red-400">-{initialMetadata.negative_marking}</div>
            </div>
          </div>
          
          <div className="mb-10 prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-bold">Important Instructions</h3>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{initialMetadata.instructions}</p>
          </div>
          
          {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl font-bold">{error}</div>}
          
          <button onClick={handleStart} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
            Start Mock Test Now
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: SUBMITTING / LOADING
  if (view === "SUBMITTING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={48} className="text-indigo-600 animate-spin mb-6" />
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Processing Secure Session</h2>
        <p className="text-slate-500 mt-2">Please do not close this window.</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: ACTIVE SIMULATOR
  if (view === "ACTIVE" && questions.length > 0) {
    const q = questions[currentIndex];
    
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
           <div className="font-black text-lg text-slate-800 dark:text-white truncate max-w-[200px] md:max-w-md">{initialMetadata.title}</div>
           <div className={`font-mono font-black text-xl flex items-center gap-2 px-4 py-1.5 rounded-lg ${timeRemaining < 300000 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
             <Clock size={20} /> {formatTime(timeRemaining)}
           </div>
        </header>
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-64px)]">
           {/* Left Pane: Question Area */}
           <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Question {q.questionNumber} of {questions.length}</span>
                  <button onClick={handleToggleMark} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${markedForReview[q.id] ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <Bookmark size={16} className={markedForReview[q.id] ? 'fill-current' : ''} /> Mark for Review
                  </button>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed mb-8">{q.question_text}</h2>
                
                <div className="space-y-3">
                  {(["A", "B", "C", "D"] as const).map(key => {
                    const isSel = answers[q.id] === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectAnswer(key)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${isSel ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 shadow-sm scale-[1.01]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 transition-colors ${isSel ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>{key}</div>
                        <span className="text-base md:text-lg">{q.options[key as keyof typeof q.options]}</span>
                      </button>
                    )
                  })}
                </div>
                
                {answers[q.id] && (
                  <div className="mt-6 flex justify-end">
                    <button onClick={handleClear} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Clear Answer</button>
                  </div>
                )}
             </div>
           </div>
           
           {/* Right Pane: Desktop Palette */}
           <div className="hidden md:flex w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col p-6 overflow-y-auto">
             <h3 className="font-black text-slate-800 dark:text-white mb-4">Question Palette</h3>
             
             {/* Legend */}
             <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded"></div> Answered</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded"></div> Not Answered</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"></div> Not Visited</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-700 rounded"></div> Marked</div>
             </div>
             
             <div className="grid grid-cols-5 gap-2 content-start">
               {questions.map((qs, i) => (
                 <button key={qs.id} onClick={() => navigateTo(i)} className={`w-10 h-10 rounded-xl font-bold text-sm border-2 transition-all ${currentIndex === i ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-110 z-10' : ''} ${getStatusColor(qs.id)}`}>
                   {qs.questionNumber}
                 </button>
               ))}
             </div>
           </div>
        </div>
        
        {/* Bottom Action Bar */}
        <div className="fixed md:absolute bottom-0 left-0 right-0 md:right-80 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           <button onClick={() => navigateTo(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold disabled:opacity-50">Previous</button>
           
           <button onClick={() => setShowPaletteMobile(true)} className="md:hidden p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl font-black text-sm flex items-center gap-2">
             <BarChart3 size={18} /> Palette
           </button>
           
           {currentIndex === questions.length - 1 ? (
             <button onClick={() => setShowSubmitConfirm(true)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-lg">Submit Test</button>
           ) : (
             <button onClick={() => navigateTo(currentIndex + 1)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-lg">Next <ChevronRight size={18} className="inline"/></button>
           )}
        </div>
        
        {/* Mobile Palette Drawer */}
        {showPaletteMobile && (
          <div className="md:hidden fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-end animate-in fade-in">
             <div className="w-full bg-white dark:bg-slate-900 rounded-t-3xl p-6 h-[80vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black text-xl text-slate-800 dark:text-white">Question Palette</h3>
                 <button onClick={() => setShowPaletteMobile(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20}/></button>
               </div>
               
               <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded"></div> Answered</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div> Not Answered</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div> Marked</div>
               </div>
               
               <div className="flex-1 overflow-y-auto pb-20">
                 <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                   {questions.map((qs, i) => (
                     <button key={qs.id} onClick={() => navigateTo(i)} className={`w-12 h-12 rounded-xl font-bold text-base border-2 ${currentIndex === i ? 'ring-2 ring-indigo-500' : ''} ${getStatusColor(qs.id)}`}>
                       {qs.questionNumber}
                     </button>
                   ))}
                 </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                 <button onClick={() => setShowSubmitConfirm(true)} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-lg shadow-lg">Submit Final Test</button>
               </div>
             </div>
          </div>
        )}
        
        {/* Submit Confirm Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-sm text-center animate-in zoom-in-95">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Submit Test?</h3>
                <div className="space-y-3 text-left mb-8">
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300"><span>Answered</span><span className="font-black text-emerald-600">{Object.keys(answers).length}</span></div>
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300"><span>Unanswered</span><span className="font-black text-red-500">{questions.length - Object.keys(answers).length}</span></div>
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300"><span>Marked for Review</span><span className="font-black text-purple-600">{Object.keys(markedForReview).filter(k=>markedForReview[k]).length}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold">Resume</button>
                  <button onClick={() => executeSubmission(session!.token, answers)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black">Submit</button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: RESULT DASHBOARD
  if (view === "RESULT" && resultData) {
    const { summary, topicAnalytics } = resultData;
    
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Performance Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <div className="lg:col-span-1 bg-indigo-600 rounded-3xl p-8 text-white flex flex-col items-center justify-center shadow-xl shadow-indigo-600/20 text-center">
            <div className="text-indigo-200 font-bold tracking-widest uppercase text-sm mb-2">Final Score</div>
            <div className="text-7xl font-black mb-2">{summary.finalScore}</div>
            <div className="text-indigo-200 font-medium mb-8">Out of {initialMetadata.total_marks} marks</div>
            
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-3xl font-black">{summary.accuracy}%</div>
                <div className="text-xs font-bold text-indigo-200 uppercase mt-1">Accuracy</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-xl font-black mt-1.5">{formatTime(summary.timeUsed)}</div>
                <div className="text-xs font-bold text-indigo-200 uppercase mt-1">Time Used</div>
              </div>
            </div>
          </div>
          
          {/* Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
               <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Activity size={20}/> Submission Breakdown</h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                    <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{summary.totalQuestions}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase mt-1">Total</div>
                 </div>
                 <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl text-center border border-emerald-100 dark:border-emerald-900/30">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{summary.correct}</div>
                    <div className="text-xs font-bold text-emerald-500 uppercase mt-1">Correct</div>
                 </div>
                 <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl text-center border border-red-100 dark:border-red-900/30">
                    <div className="text-2xl font-black text-red-600 dark:text-red-400">{summary.incorrect}</div>
                    <div className="text-xs font-bold text-red-500 uppercase mt-1">Incorrect</div>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                    <div className="text-2xl font-black text-slate-500">{summary.unanswered}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase mt-1">Unanswered</div>
                 </div>
               </div>
               {summary.negativePenalty > 0 && (
                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold text-center">
                   Negative Marking Penalty: -{summary.negativePenalty} marks
                 </div>
               )}
            </div>
            
            {/* Weak Areas */}
            {topicAnalytics && topicAnalytics.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Topic Performance</h3>
                <p className="text-sm text-slate-500 mb-6">Target your weakest areas with the Practice Engine to improve your score.</p>
                <div className="space-y-4">
                  {topicAnalytics.map((t: any) => (
                    <div key={t.topicId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/30">
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 dark:text-white mb-1">{t.title}</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${t.accuracy >= 75 ? 'bg-emerald-500' : t.accuracy >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{width: `${t.accuracy}%`}}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-black text-lg ${t.accuracy >= 75 ? 'text-emerald-600 dark:text-emerald-400' : t.accuracy >= 50 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>{t.accuracy}%</span>
                        {t.accuracy < 70 && (
                          <Link href={`/practice/${t.topicId}`} className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-xl text-xs font-black uppercase tracking-wider transition-colors">
                            Practice
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => setView("REVIEW")} className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-md hover:bg-slate-800 transition-colors">
                Review Solutions
              </button>
              <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-black text-lg transition-colors">
                Retake Test
              </button>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: SOLUTIONS REVIEW
  if (view === "REVIEW" && resultData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-4 sticky top-0 z-40">
           <button onClick={() => setView("RESULT")} className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
             <ChevronLeft size={20}/> Back to Results
           </button>
           <div className="ml-auto font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-sm">Review Mode</div>
        </header>
        
        <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
           {resultData.detailedResults.map((r: any) => (
             <div key={r.questionId} className={`bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border-2 shadow-sm ${r.isCorrect ? 'border-emerald-100 dark:border-emerald-900/30' : r.isUnanswered ? 'border-slate-200 dark:border-slate-800' : 'border-red-100 dark:border-red-900/30'}`}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Question {r.questionNumber}</span>
                  {r.isCorrect ? <span className="text-xs font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-1 rounded">Correct</span> :
                   r.isUnanswered ? <span className="text-xs font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">Unanswered</span> :
                   <span className="text-xs font-black uppercase bg-red-50 text-red-600 px-2 py-1 rounded">Incorrect</span>}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{r.questionText}</h3>
                
                <div className="space-y-3 mb-8">
                  {(["A", "B", "C", "D"] as const).map(key => {
                    const isActualCorrect = key === r.correctAnswer;
                    const isStudentSelected = key === r.studentAnswer;
                    
                    let bg = "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500";
                    if (isActualCorrect) bg = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold";
                    else if (isStudentSelected && !isActualCorrect) bg = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500 line-through opacity-70";
                    
                    return (
                      <div key={key} className={`p-4 rounded-2xl border-2 flex items-start gap-4 ${bg}`}>
                        <div className="font-black mt-0.5">{key}</div>
                        <div>{r.options[key as keyof typeof r.options]}</div>
                      </div>
                    )
                  })}
                </div>
                
                {r.explanation && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-2xl">
                    <div className="font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-widest text-xs flex items-center gap-1">Explanation</div>
                    <div className="text-blue-900 dark:text-blue-300 text-sm whitespace-pre-wrap">{r.explanation}</div>
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>
    )
  }

  return null;
}
"""

with open("src/app/mock-test/[testId]/MockTestEngine.tsx", "w", encoding="utf-8") as f:
    f.write(client_code)
