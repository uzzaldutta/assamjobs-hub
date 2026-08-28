"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, ChevronRight, RotateCcw, Award } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMockTests } from "@/hooks/useMockTests";
import mockTestData from "@/data/mock-tests.json";
import AdBanner from "@/components/AdBanner";

export default function DynamicMockTestPage() {
  const params = useParams();
  const testId = params.testId as string;
  const router = useRouter();
  const { saveResult } = useMockTests();

  const [QUESTIONS, setQuestions] = useState<any[]>([]);
  const [testMeta, setTestMeta] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (testId && mockTestData && typeof mockTestData === 'object') {
      const data = (mockTestData as any)[testId];
      if (data) {
        setQuestions(data);
        setTimeLeft(data.length * 60); // 1 min per question default
        setTestMeta({ title: testId.replace(/-/g, ' ').toUpperCase(), duration: data.length });
      } else {
        router.push("/mock-tests"); // fallback
      }
    }
  }, [testId, router]);

  useEffect(() => {
    if (!started || finished || QUESTIONS.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished, QUESTIONS.length]);

  const handleSelect = (optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++;
    });
    return score;
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      const finalScore = calculateScore();
      saveResult({
        testId: testId,
        testName: testMeta?.title || testId,
        score: finalScore,
        totalQuestions: QUESTIONS.length
      });
      setFinished(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (QUESTIONS.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading Test...</div>;

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{testMeta?.title}</h1>
          <p className="text-slate-500 mb-8">{QUESTIONS.length} Questions • {testMeta?.duration} Minutes • Multiple Choice</p>
          <div className="space-y-3 mb-8 text-sm text-left bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <p><span className="font-bold">Rules:</span></p>
            <p>1. You cannot pause the timer once started.</p>
            <p>2. You cannot go back to previous questions.</p>
            <p>3. Submit before the timer runs out!</p>
          </div>
          <button 
            onClick={() => setStarted(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-md"
          >
            Start Test Now
          </button>
          <Link href="/mock-tests" className="block mt-4 text-sm text-slate-500 hover:text-indigo-600">
            Cancel and go back
          </Link>
        </div>
      </div>
    );
  }

  if (finished) {
    const score = calculateScore();
    const percentage = (score / QUESTIONS.length) * 100;
    
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-800 mb-8">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Test Completed!</h2>
            <div className="text-6xl font-black my-6 text-indigo-600 dark:text-indigo-400">
              {score} <span className="text-2xl text-slate-400">/ {QUESTIONS.length}</span>
            </div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-8">
              You scored {percentage.toFixed(0)}%
              {percentage >= 80 ? ' 🎉 Excellent job!' : percentage >= 60 ? ' 👍 Good effort!' : ' 📚 Keep practicing!'}
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center gap-2"
              >
                <RotateCcw size={18} /> Retake Test
              </button>
              <Link 
                href="/mock-tests"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
              >
                More Tests
              </Link>
            </div>
          </div>

          <AdBanner dataAdSlot="MOCK_TEST_RESULT_SLOT" className="mb-8 min-h-[250px]" />

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Answer Review</h3>
          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const isCorrect = userAnswer === q.answer;
              
              return (
                <div key={q.id || idx} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/50' : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? <CheckCircle2 className="text-emerald-600 mt-1 shrink-0" /> : <XCircle className="text-red-600 mt-1 shrink-0" />}
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Q{idx + 1}. {q.question}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9 mb-4">
                    {q.options.map((opt: string, optIdx: number) => (
                      <div 
                        key={optIdx} 
                        className={`p-3 rounded-xl border text-sm font-medium
                          ${optIdx === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 
                            optIdx === userAnswer && !isCorrect ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/40 dark:text-red-300' : 
                            'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}
                        `}
                      >
                        {opt} {optIdx === q.answer && '✅'} {optIdx === userAnswer && !isCorrect && '❌ (Your Answer)'}
                      </div>
                    ))}
                  </div>
                  <div className="pl-9 text-sm text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-black/20 p-3 rounded-xl inline-block mt-2">
                    <span className="font-bold">Explanation:</span> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="text-sm font-bold text-slate-500">
            Question {currentQIndex + 1} <span className="text-slate-300">/ {QUESTIONS.length}</span>
          </div>
          <div className={`flex items-center gap-2 font-bold px-4 py-1.5 rounded-full ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
            {currentQ.question}
          </h2>
          
          <div className="space-y-4">
            {currentQ.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg flex items-center justify-between
                  ${selectedAnswers[currentQIndex] === idx 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}
                `}
              >
                {option}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAnswers[currentQIndex] === idx ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                  {selectedAnswers[currentQIndex] === idx && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={nextQuestion}
            disabled={selectedAnswers[currentQIndex] === undefined}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {currentQIndex === QUESTIONS.length - 1 ? 'Submit Test' : 'Next Question'} 
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
