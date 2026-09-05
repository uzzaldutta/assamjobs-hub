"use client";


import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Trophy, RotateCcw, Eye, ChevronLeft, Loader2, List, Hash } from "lucide-react";
import { getPracticeSession, getSecureQuestion, checkAnswer } from "../actions";

interface SecureQuestion {
  id: string;
  question_text: string;
  options: { [key: string]: string };
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

interface AnswerResult {
  selected: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  questionText: string;
  options: { [key: string]: string };
}

interface PracticeSession {
  sessionId: string;
  topicId: string;
  questionIds: string[];
  currentIndex: number;
  answers: { [qId: string]: AnswerResult };
  status: "IN_PROGRESS" | "COMPLETED";
}

export default function PracticeEngineClient({ topic }: { topic: any }) {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentQ, setCurrentQ] = useState<SecureQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"PRACTICE" | "RESULT" | "REVIEW">("PRACTICE");
  const [reviewIndex, setReviewIndex] = useState(0);

  const testType = topic.isMock ? 'mock' : 'topic';

  // INITIALIZATION
  useEffect(() => {
    async function init() {
      try {
        // Try to load existing active session from local storage for this topic
        const saved = localStorage.getItem(`practice_session_${topic.id}`);
        if (saved) {
          const parsed: PracticeSession = JSON.parse(saved);
          if (parsed.status === "IN_PROGRESS" && parsed.questionIds.length > 0) {
            setSession(parsed);
            return; // We have a session, next useEffect will load the question
          }
        }
        // Start new session
        const { sessionId, questionIds } = await getPracticeSession(topic.id, testType);
        if (questionIds.length === 0) {
          setError("No questions available for this module.");
          setLoading(false);
          return;
        }
        const newSession: PracticeSession = {
          sessionId, topicId: topic.id, questionIds, currentIndex: 0, answers: {}, status: "IN_PROGRESS"
        };
        setSession(newSession);
        localStorage.setItem(`practice_session_${topic.id}`, JSON.stringify(newSession));
      } catch (err: any) {
        setError(err.message || "Failed to initialize session");
        setLoading(false);
      }
    }
    init();
  }, [topic.id, testType]);

  // QUESTION LOADING
  useEffect(() => {
    if (!session || session.questionIds.length === 0) return;
    
    if (session.currentIndex >= session.questionIds.length) {
      if (session.status !== "COMPLETED") {
        const updated = { ...session, status: "COMPLETED" as const };
        setSession(updated);
        localStorage.setItem(`practice_session_${topic.id}`, JSON.stringify(updated));
      }
      if (session?.status === "COMPLETED") setViewMode("RESULT");
      return;
    }
    
    let isMounted = true;
    async function fetchQ() {
      setLoading(true);
      setError("");
      try {
        const qId = session!.questionIds[session!.currentIndex];
        // Fetch it
        const q = await getSecureQuestion(qId);
        if (isMounted) setCurrentQ(q);
      } catch (err: any) {
        if (isMounted) setError("Failed to load question. Please check your connection.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchQ();
    return () => { isMounted = false; };
  }, [session?.currentIndex, session?.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectOption = async (optionKey: string) => {
    if (!session || !currentQ || submitting) return;
    
    // Prevent double submission if already answered
    if (session.answers[currentQ.id]) return;

    setSubmitting(true);
    try {
      const result = await checkAnswer(currentQ.id, optionKey);
      
      const newAnswers = { ...session.answers };
      newAnswers[currentQ.id] = {
        selected: optionKey,
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
        questionText: currentQ.question_text,
        options: currentQ.options
      };

      const updatedSession = { ...session, answers: newAnswers };
      setSession(updatedSession);
      localStorage.setItem(`practice_session_${topic.id}`, JSON.stringify(updatedSession));
      
    } catch (err) {
      setError("Failed to check answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!session) return;
    const nextIndex = session.currentIndex + 1;
    const updatedSession = { ...session, currentIndex: nextIndex };
    if (nextIndex >= session.questionIds.length) {
      updatedSession.status = "COMPLETED";
      setViewMode("RESULT");
    }
    setSession(updatedSession);
    localStorage.setItem(`practice_session_${topic.id}`, JSON.stringify(updatedSession));
    setCurrentQ(null);
  };

  const resetSession = async () => {
    setLoading(true);
    setViewMode("PRACTICE");
    try {
      const { sessionId, questionIds } = await getPracticeSession(topic.id, testType);
      const newSession: PracticeSession = {
        sessionId, topicId: topic.id, questionIds, currentIndex: 0, answers: {}, status: "IN_PROGRESS"
      };
      setSession(newSession);
      localStorage.setItem(`practice_session_${topic.id}`, JSON.stringify(newSession));
    } catch (err: any) {
      setError("Failed to restart");
    }
  };

  if (loading && !currentQ) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Loading Questions...</h3>
      </div>
    );
  }

  if (error && !currentQ) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm px-6">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Oops!</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={resetSession} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
          <RotateCcw size={18} /> Try Again
        </button>
      </div>
    );
  }

  if (viewMode === "RESULT" && session) {
    const total = session.questionIds.length;
    const correct = Object.values(session.answers).filter(a => a.isCorrect).length;
    const incorrect = Object.values(session.answers).length - correct;
    const unattempted = total - Object.values(session.answers).length;
    
    // Save to historical if it's a mock
    if (topic.isMock) {
       // Typically you'd write a server action here to save score to user profile (Phase 7)
    }

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="bg-indigo-600 text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <Trophy size={180} />
          </div>
          <Trophy size={64} className="mx-auto mb-4 text-indigo-200 relative z-10" />
          <h2 className="text-3xl md:text-5xl font-black mb-2 relative z-10">Test Completed</h2>
          <p className="text-indigo-100 font-medium relative z-10 text-lg">Here is your performance summary</p>
        </div>
        
        <div className="p-6 md:p-10 text-center">
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{total}</span>
             </div>
             <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <span className="block text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Correct</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{correct}</span>
             </div>
             <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-800/50">
                <span className="block text-[10px] font-bold text-red-600/70 uppercase tracking-wider mb-1">Incorrect</span>
                <span className="text-3xl font-black text-red-600 dark:text-red-400">{incorrect}</span>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => { setViewMode("REVIEW"); setReviewIndex(0); }}
              className="flex-1 max-w-[200px] flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-3 px-6 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Eye size={18} /> Review Answers
            </button>
            <button 
              onClick={resetSession}
              className="flex-1 max-w-[200px] flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              <RotateCcw size={18} /> Practice Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "REVIEW" && session) {
    const qId = session.questionIds[reviewIndex];
    const answer = session.answers[qId];
    
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button 
            onClick={() => setViewMode("RESULT")}
            className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ChevronLeft size={16} /> Back to Summary
          </button>
          <div className="font-bold text-slate-500">
            Review: {reviewIndex + 1} / {session.questionIds.length}
          </div>
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>
        
        <div className="p-6 md:p-10">
          {!answer ? (
            <div className="text-center py-10 text-slate-500 italic">This question was not attempted.</div>
          ) : (
            <>
              <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed">
                <span className="text-indigo-500 mr-2">Q.</span>
                {answer.questionText}
              </h3>
              
              <div className="space-y-3 mb-8">
                {Object.entries(answer.options).map(([key, text]) => {
                  let bgColor = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                  let icon = null;
                  
                  if (key === answer.correctAnswer) {
                    bgColor = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500";
                    icon = <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />;
                  } else if (key === answer.selected && !answer.isCorrect) {
                    bgColor = "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100";
                    icon = <XCircle size={18} className="text-red-600 dark:text-red-400" />;
                  }
                  
                  return (
                    <div key={key} className={`flex items-start gap-4 p-4 rounded-xl border ${bgColor}`}>
                      <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${key === answer.correctAnswer ? 'bg-emerald-500 text-white' : key === answer.selected && !answer.isCorrect ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {key}
                      </div>
                      <div className="flex-1 font-medium">{text}</div>
                      {icon}
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800/50">
                <h4 className="flex items-center gap-2 font-bold text-indigo-800 dark:text-indigo-300 mb-2">
                  <Lightbulb size={18} className="text-indigo-500" /> Explanation
                </h4>
                <p className="text-indigo-900/80 dark:text-indigo-200/80 text-sm md:text-base leading-relaxed">
                  {answer.explanation || "No detailed explanation available for this question."}
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex border-t border-slate-100 dark:border-slate-800">
           <button 
             disabled={reviewIndex === 0}
             onClick={() => setReviewIndex(r => r - 1)}
             className="flex-1 p-4 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-30 transition-colors"
           >
             Previous
           </button>
           <div className="w-px bg-slate-100 dark:bg-slate-800"></div>
           <button 
             disabled={reviewIndex === session.questionIds.length - 1}
             onClick={() => setReviewIndex(r => r + 1)}
             className="flex-1 p-4 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-30 transition-colors"
           >
             Next
           </button>
        </div>
      </div>
    );
  }

  // DEFAULT PRACTICE VIEW
  if (viewMode === "PRACTICE" && session && currentQ) {
    const isAnswered = !!session.answers[currentQ.id];
    const answer = session.answers[currentQ.id];
    const progressPercent = ((session.currentIndex + (isAnswered ? 1 : 0)) / session.questionIds.length) * 100;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500">
        
        {/* Header / Progress */}
        <div className="p-4 md:px-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question {session.currentIndex + 1} of {session.questionIds.length}
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${
              currentQ.difficulty === 'HARD' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 
              currentQ.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
              'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-6 md:p-8 lg:p-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-8 leading-relaxed">
            <span className="text-indigo-500 mr-2">Q.</span>
            {currentQ.question_text}
          </h2>

          <div className="space-y-4 mb-8">
            {Object.entries(currentQ.options).map(([key, text]) => {
              
              let stateClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer";
              let icon = null;

              if (isAnswered) {
                stateClass = "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 opacity-70 cursor-default"; // Default disabled state
                
                if (key === answer.correctAnswer) {
                  stateClass = "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100 ring-2 ring-emerald-500 dark:ring-emerald-400 cursor-default shadow-sm z-10 relative";
                  icon = <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />;
                } else if (key === answer.selected && !answer.isCorrect) {
                  stateClass = "border-red-300 bg-red-50 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100 cursor-default";
                  icon = <XCircle size={20} className="text-red-600 dark:text-red-400" />;
                }
              }

              return (
                <button
                  key={key}
                  disabled={isAnswered || submitting}
                  onClick={() => handleSelectOption(key)}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${stateClass}`}
                >
                  <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isAnswered && key === answer.correctAnswer ? 'bg-emerald-500 text-white' : 
                    isAnswered && key === answer.selected && !answer.isCorrect ? 'bg-red-500 text-white' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900'
                  }`}>
                    {key}
                  </div>
                  <div className="flex-1 font-medium text-base pt-0.5">{text}</div>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Actions & Explanation */}
          {isAnswered && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 md:p-6 border border-indigo-100 dark:border-indigo-800/50">
                <h4 className="flex items-center gap-2 font-bold text-indigo-800 dark:text-indigo-300 mb-2">
                  <Lightbulb size={18} className="text-indigo-500" /> Explanation
                </h4>
                <p className="text-indigo-900/80 dark:text-indigo-200/80 text-sm md:text-base leading-relaxed">
                  {answer.explanation || "No detailed explanation available for this question."}
                </p>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleNext}
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {session.currentIndex === session.questionIds.length - 1 ? 'Finish Module' : 'Next Question'} <ArrowRight size={18} />
                </button>
              </div>
              
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
