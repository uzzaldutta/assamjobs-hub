"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, CheckCircle2, XCircle, ArrowRight, BrainCircuit, RefreshCw, Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export default function AIMockTestGenerator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const generateTest = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError("");
    setQuestions([]);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const res = await fetch("/api/generate-mock-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate test");
      }

      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });
    return score;
  };

  // Reset entirely
  const startOver = () => {
    setQuestions([]);
    setTopic("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="✨ AI Mock Test Generator"
        subtitle="Type any exam name or subject, and our AI will generate a challenging 20-question mock test instantly."
        theme="purple"
      />

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10 max-w-4xl">
        
        {/* State 1: Input Topic */}
        {questions.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-10 text-center">
            <BrainCircuit size={48} className="text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">What do you want to practice?</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
              Enter an exam name (e.g. "ADRE Grade III") or a specific subject (e.g. "Assam History").
            </p>

            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., APSC CCE General Studies..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-4 px-6 text-lg font-medium text-slate-800 dark:text-slate-200 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all"
                onKeyDown={(e) => { if (e.key === 'Enter') generateTest() }}
              />
              <button 
                onClick={generateTest}
                disabled={loading || !topic.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold px-8 py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? <><Loader2 className="animate-spin" size={20} /> Crafting Test...</> : <><Sparkles size={20} /> Generate</>}
              </button>
            </div>
            
            {error && <p className="text-red-500 font-bold mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/50">{error}</p>}
          </div>
        )}

        {/* State 2: Taking the Quiz */}
        {questions.length > 0 && !showResults && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Question {currentQuestionIdx + 1} of {questions.length}
              </span>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold rounded-lg text-sm">
                {topic}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIdx) / questions.length) * 100}%` }}
              ></div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-8 leading-relaxed">
              {questions[currentQuestionIdx].question}
            </h3>

            <div className="space-y-3 mb-8">
              {questions[currentQuestionIdx].options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>
                      {isSelected && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                    </div>
                    <span className="font-medium text-lg">{opt}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestionIdx] === undefined}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-50 font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition"
              >
                {currentQuestionIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* State 3: Results & Explanations */}
        {showResults && (
          <div className="space-y-6">
            
            {/* Score Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-8 text-center text-white relative overflow-hidden">
              <Trophy size={64} className="mx-auto mb-4 text-yellow-300 opacity-90" />
              <h2 className="text-3xl font-black mb-2">Test Completed!</h2>
              <p className="text-indigo-100 text-lg mb-6">Your score for "{topic}"</p>
              
              <div className="inline-block bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/30">
                <span className="text-5xl font-black">{calculateScore()}</span>
                <span className="text-xl font-medium opacity-80"> / {questions.length}</span>
              </div>
              
              <div className="mt-8 flex justify-center gap-4">
                <button onClick={startOver} className="bg-white text-indigo-700 hover:bg-slate-50 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition">
                  <RefreshCw size={18} /> Generate New Test
                </button>
                <Link href="/mock-tests" className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition border border-indigo-500">
                  Back to Dashboard
                </Link>
              </div>
            </div>

            {/* Answer Breakdown */}
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-8 mb-4">Answer Breakdown & Explanations</h3>
            
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div key={idx} className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-2 overflow-hidden ${isCorrect ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-red-200 dark:border-red-900/50'}`}>
                    
                    <div className="p-6">
                      <div className="flex gap-3 mb-4">
                        <span className={`shrink-0 mt-1 ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        </span>
                        <h4 className="font-bold text-lg text-slate-800 dark:text-white leading-relaxed">
                          <span className="text-slate-400 mr-2">{idx + 1}.</span>
                          {q.question}
                        </h4>
                      </div>

                      <div className="pl-9 space-y-2 mb-6">
                        {q.options.map((opt, optIdx) => {
                          const isSelectedOpt = userAns === optIdx;
                          const isCorrectOpt = q.correctAnswerIndex === optIdx;
                          
                          let bg = "bg-slate-50 dark:bg-slate-950/50";
                          let text = "text-slate-600 dark:text-slate-400";
                          let border = "border border-slate-200 dark:border-slate-800";
                          
                          if (isCorrectOpt) {
                            bg = "bg-emerald-50 dark:bg-emerald-900/20";
                            text = "text-emerald-700 dark:text-emerald-300 font-bold";
                            border = "border border-emerald-200 dark:border-emerald-800/50";
                          } else if (isSelectedOpt && !isCorrectOpt) {
                            bg = "bg-red-50 dark:bg-red-900/20";
                            text = "text-red-700 dark:text-red-300 font-bold line-through opacity-70";
                            border = "border border-red-200 dark:border-red-800/50";
                          }

                          return (
                            <div key={optIdx} className={`p-3 rounded-xl ${bg} ${text} ${border} flex justify-between items-center`}>
                              <span>{opt}</span>
                              {isCorrectOpt && <CheckCircle2 size={16} className="text-emerald-500" />}
                              {isSelectedOpt && !isCorrectOpt && <XCircle size={16} className="text-red-500" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* AI Explanation */}
                      <div className="ml-9 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 flex gap-3">
                        <Sparkles size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">AI Explanation</span>
                          <p className="text-indigo-800/80 dark:text-indigo-200/80 text-sm leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
