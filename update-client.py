client_page = """
"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Trophy, RotateCcw, Eye, ChevronLeft, Loader2 } from "lucide-react";
import { getPracticeSession, getSecureQuestion, checkAnswer } from "../actions";

interface SecureQuestion {
  id: string;
  question_text: string;
  options: { A: string; B: string; C: string; D: string };
  difficulty: string;
}

interface AnswerRecord {
  selected: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  questionText: string;
  options: { A: string; B: string; C: string; D: string };
}

interface PracticeSession {
  sessionId: string;
  topicId: string;
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, AnswerRecord>;
  status: "IN_PROGRESS" | "COMPLETED";
}

export default function PracticeEngineClient({ topic }: { topic: any }) {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentQ, setCurrentQ] = useState<SecureQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"PRACTICE" | "RESULT" | "REVIEW">("PRACTICE");

  const storageKey = `practice_sess_${topic.id}`;

  // 1. Initialize or Load Session
  useEffect(() => {
    async function init() {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed: PracticeSession = JSON.parse(stored);
          if (parsed.status === "IN_PROGRESS") {
            setSession(parsed);
            return;
          }
        }
        // Start new session
        const { sessionId, questionIds } = await getPracticeSession(topic.id);
        if (questionIds.length === 0) {
          setError("No questions available for this topic.");
          setLoading(false);
          return;
        }
        const newSession: PracticeSession = {
          sessionId,
          topicId: topic.id,
          questionIds,
          currentIndex: 0,
          answers: {},
          status: "IN_PROGRESS"
        };
        setSession(newSession);
        localStorage.setItem(storageKey, JSON.stringify(newSession));
      } catch (err: any) {
        setError(err.message || "Failed to start session.");
      }
    }
    init();
  }, [topic.id, storageKey]);

  // 2. Load Current Question securely
  useEffect(() => {
    if (!session || session.status === "COMPLETED") {
      if (session?.status === "COMPLETED") setViewMode("RESULT");
      return;
    }
    
    let isMounted = true;
    async function fetchQ() {
      setLoading(true);
      setError("");
      try {
        const qId = session!.questionIds[session!.currentIndex];
        // If we already answered it (e.g., refresh after answer but before next), we still need the text to render it, 
        // but we already have it in session.answers. Actually, let's just fetch it to be clean.
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
      localStorage.setItem(storageKey, JSON.stringify(updatedSession));
      
    } catch (err) {
      alert("Network error submitting answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!session) return;
    if (session.currentIndex < session.questionIds.length - 1) {
      const updated = { ...session, currentIndex: session.currentIndex + 1 };
      setSession(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } else {
      const updated: PracticeSession = { ...session, status: "COMPLETED" };
      setSession(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setViewMode("RESULT");
    }
  };

  const handleRestart = async () => {
    setLoading(true);
    setViewMode("PRACTICE");
    try {
      const { sessionId, questionIds } = await getPracticeSession(topic.id);
      const newSession: PracticeSession = {
        sessionId, topicId: topic.id, questionIds, currentIndex: 0, answers: {}, status: "IN_PROGRESS"
      };
      setSession(newSession);
      localStorage.setItem(storageKey, JSON.stringify(newSession));
    } catch(err) {
      setError("Failed to restart.");
    }
  };

  if (error && !currentQ) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold">Retry</button>
      </div>
    );
  }

  if (!session || (loading && !currentQ)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium tracking-wide">Loading secure session...</p>
      </div>
    );
  }

  const totalQuestions = session.questionIds.length;
  const answeredIds = Object.keys(session.answers);
  const correctCount = Object.values(session.answers).filter(a => a.isCorrect).length;
  const incorrectCount = answeredIds.length - correctCount;
  const accuracy = answeredIds.length > 0 ? Math.round((correctCount / answeredIds.length) * 100) : 0;

  if (viewMode === "RESULT") {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-500 shadow-sm">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Practice Complete</h2>
        <p className="text-slate-500 mb-8">You have completed the question set for {topic.title}.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <div className="text-2xl font-black text-slate-800 dark:text-white">{totalQuestions}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{correctCount}</div>
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mt-1">Correct</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl">
            <div className="text-2xl font-black text-red-600 dark:text-red-400">{incorrectCount}</div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mt-1">Incorrect</div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{accuracy}%</div>
            <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mt-1">Accuracy</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button onClick={() => setViewMode("REVIEW")} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors">
            <Eye size={20} /> Review Answers
          </button>
          <button onClick={handleRestart} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors">
            <RotateCcw size={20} /> Practice Again
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === "REVIEW") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setViewMode("RESULT")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Results
          </button>
          <div className="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Review Mode</div>
        </div>
        
        {session.questionIds.map((qId, index) => {
          const ans = session.answers[qId];
          if (!ans) return null;
          
          return (
            <div key={qId} className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 ${ans.isCorrect ? 'border-emerald-100 dark:border-emerald-900/30' : 'border-red-100 dark:border-red-900/30'} shadow-sm`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-slate-400 font-black text-sm uppercase tracking-wider">Q {index + 1}</span>
                {ans.isCorrect ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md"><CheckCircle2 size={14}/> Correct</span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md"><XCircle size={14}/> Incorrect</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{ans.questionText}</h3>
              
              <div className="space-y-2 mb-6">
                 {(["A", "B", "C", "D"] as const).map(key => {
                    const isSelected = ans.selected === key;
                    const isActualCorrect = ans.correctAnswer === key;
                    
                    let bg = "bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-transparent";
                    if (isActualCorrect) bg = "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold";
                    else if (isSelected && !isActualCorrect) bg = "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 line-through opacity-70";
                    
                    return (
                      <div key={key} className={`p-3 rounded-xl border flex items-start gap-3 ${bg}`}>
                        <div className="font-black mt-0.5">{key}</div>
                        <div>{ans.options[key as keyof typeof ans.options]}</div>
                      </div>
                    );
                 })}
              </div>
              
              {ans.explanation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-900 dark:text-blue-300">
                  <div className="font-bold flex items-center gap-1 mb-1"><Lightbulb size={16}/> Explanation</div>
                  {ans.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // PRACTICE MODE
  const isAnswered = !!(currentQ && session.answers[currentQ.id]);
  const currentAnswer = currentQ ? session.answers[currentQ.id] : null;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((session.currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm font-bold text-slate-500">
          {session.currentIndex + 1} <span className="opacity-50">/ {totalQuestions}</span>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className={`bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
              currentQ.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              currentQ.difficulty === 'HARD' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            }`}>
              {currentQ.difficulty}
            </span>
            {submitting && <Loader2 size={16} className="animate-spin text-indigo-500" />}
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed mb-8">
            {currentQ.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {(["A", "B", "C", "D"] as const).map((key) => {
              const isSelected = currentAnswer?.selected === key;
              const isCorrect = currentAnswer?.correctAnswer === key;
              
              let btnClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/80";
              
              if (isAnswered) {
                if (isCorrect) {
                  btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 font-bold z-10 scale-[1.02] shadow-sm";
                } else if (isSelected && !isCorrect) {
                  btnClass = "border-red-300 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 opacity-80";
                } else {
                  btnClass = "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 opacity-50";
                }
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  disabled={isAnswered || submitting}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${btnClass}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 transition-colors ${
                    isAnswered && isCorrect ? "bg-emerald-500 text-white" : 
                    isAnswered && isSelected && !isCorrect ? "bg-red-200 text-red-600" :
                    "bg-slate-100 dark:bg-slate-700 text-slate-500"
                  }`}>
                    {isAnswered && isCorrect ? <CheckCircle2 size={18} /> : 
                     isAnswered && isSelected && !isCorrect ? <XCircle size={18} /> : key}
                  </div>
                  <span className="text-base md:text-lg leading-relaxed flex-1">
                    {currentQ.options[key as keyof typeof currentQ.options]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Instant Explanation */}
          {isAnswered && currentAnswer && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              {currentAnswer.explanation ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-2">
                    <Lightbulb size={18} /> Explanation
                  </div>
                  <p className="text-blue-900 dark:text-blue-300 text-sm leading-relaxed">
                    {currentAnswer.explanation}
                  </p>
                </div>
              ) : (
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-sm text-slate-500">
                   Correct Answer: Option {currentAnswer.correctAnswer}
                 </div>
              )}

              <button 
                onClick={handleNext} 
                className="mt-6 w-full py-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                {session.currentIndex < totalQuestions - 1 ? "Next Question" : "View Results"} <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"""

with open("src/app/practice/[topicId]/PracticeEngineClient.tsx", "w", encoding="utf-8") as f:
    f.write(client_page)
