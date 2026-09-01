client_page = """
"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Trophy, RotateCcw } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

interface PracticeEngineClientProps {
  topic: any;
  questions: Question[];
}

export default function PracticeEngineClient({ topic, questions }: PracticeEngineClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  // Save progress silently to local storage
  useEffect(() => {
    if (isAnswered && typeof window !== "undefined") {
      try {
        const stats = JSON.parse(localStorage.getItem("topic_stats") || "{}");
        const topicStats = stats[topic.id] || { correct: 0, total: 0 };
        
        // Only count it once per session for simplicity right now
        topicStats.total += 1;
        if (selectedAnswer === currentQ.correct_answer) {
          topicStats.correct += 1;
        }
        
        stats[topic.id] = topicStats;
        localStorage.setItem("topic_stats", JSON.stringify(stats));
      } catch(e) {}
    }
  }, [isAnswered]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectOption = (optionKey: string) => {
    if (isAnswered) return;
    setSelectedAnswer(optionKey);
    setIsAnswered(true);
    
    if (optionKey === currentQ.correct_answer) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore({ correct: 0, incorrect: 0 });
    setIsFinished(false);
  };

  if (isFinished) {
    const accuracy = Math.round((score.correct / questions.length) * 100);
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-500 shadow-sm">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Practice Complete!</h2>
        <p className="text-slate-500 mb-8">You have completed all available questions for this topic.</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <div className="text-2xl font-black text-slate-800 dark:text-white">{questions.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{score.correct}</div>
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mt-1">Correct</div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{accuracy}%</div>
            <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mt-1">Accuracy</div>
          </div>
        </div>

        <button onClick={handleRestart} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors">
          <RotateCcw size={20} /> Practice Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm font-bold text-slate-500">
          {currentIndex + 1} <span className="opacity-50">/ {questions.length}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
            currentQ.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            currentQ.difficulty === 'HARD' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
          }`}>
            {currentQ.difficulty}
          </span>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed mb-8">
          {currentQ.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {(["A", "B", "C", "D"] as const).map((key) => {
            const isSelected = selectedAnswer === key;
            const isCorrect = key === currentQ.correct_answer;
            
            let btnClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/80";
            
            if (isAnswered) {
              if (isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 font-bold z-10 scale-[1.02] shadow-sm";
              } else if (isSelected && !isCorrect) {
                btnClass = "border-red-300 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 opacity-80";
              } else {
                btnClass = "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 opacity-50";
              }
            } else if (isSelected) {
               // Should not be reachable since click triggers isAnswered instantly, but just in case
               btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700";
            }

            return (
              <button
                key={key}
                onClick={() => handleSelectOption(key)}
                disabled={isAnswered}
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
                  {currentQ.options[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instant Explanation (Slides down if answered) */}
        {isAnswered && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {currentQ.explanation ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-2">
                  <Lightbulb size={18} /> Explanation
                </div>
                <p className="text-blue-900 dark:text-blue-300 text-sm leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            ) : (
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-sm text-slate-500">
                 Correct Answer: Option {currentQ.correct_answer}
               </div>
            )}

            <button 
              onClick={handleNext} 
              className="mt-6 w-full py-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "View Results"} <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
"""

with open("src/app/practice/[topicId]/PracticeEngineClient.tsx", "w", encoding="utf-8") as f:
    f.write(client_page)

print("Created practice client component")
