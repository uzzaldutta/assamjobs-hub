"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, ChevronRight, RotateCcw, Award } from "lucide-react";
import Link from "next/link";

const QUESTIONS = [
  {
    id: 1,
    question: "Assam’s capital city is:",
    options: ["Guwahati", "Dispur", "Jorhat", "Silchar"],
    answer: 1,
    explanation: "Dispur became the capital of Assam in 1973, shifting from Shillong."
  },
  {
    id: 2,
    question: "The largest city of Assam is:",
    options: ["Dispur", "Guwahati", "Tezpur", "Dibrugarh"],
    answer: 1,
    explanation: "Guwahati is the largest city in Assam and the largest metropolis in Northeast India."
  },
  {
    id: 3,
    question: "Assam’s Kaziranga National Park lies along which river’s bank?",
    options: ["Barak", "Brahmaputra", "Subansiri", "Manas"],
    answer: 1,
    explanation: "Kaziranga National Park lies along the mighty Brahmaputra river."
  },
  {
    id: 4,
    question: "The Ahom capital was later shifted to:",
    options: ["Charaideo", "Sivasagar", "Guwahati", "Tezpur"],
    answer: 1,
    explanation: "The Ahom capital was shifted to Sivasagar (formerly Rangpur/Garhgaon area) by later kings."
  },
  {
    id: 5,
    question: "Mahatma Gandhi was born in the year:",
    options: ["1869", "1875", "1885", "1890"],
    answer: 0,
    explanation: "Mahatma Gandhi was born on October 2, 1869, in Porbandar, Gujarat."
  },
  {
    id: 6,
    question: "Sukaphaa, founder of the Ahom kingdom, established his capital at:",
    options: ["Sivasagar", "Charaideo", "Guwahati", "Dibrugarh"],
    answer: 1,
    explanation: "Charaideo was the first capital of the Ahom kingdom established by Sukaphaa in 1253."
  },
  {
    id: 7,
    question: "Rongali (Bohag) Bihu, marking the Assamese New Year, is celebrated in which month?",
    options: ["January", "April", "October", "August"],
    answer: 1,
    explanation: "Rongali Bihu is celebrated in mid-April, marking the onset of the Assamese New Year and the coming of Spring."
  },
  {
    id: 8,
    question: "The first Assamese-language newspaper, published in 1846, was:",
    options: ["Asom Bandhu", "Orunodoi", "Natun Asomiya", "Assam Tribune"],
    answer: 1,
    explanation: "Orunodoi was the first Assamese-language magazine, published from Sivasagar in 1846 by American Baptist Missionaries."
  },
  {
    id: 9,
    question: "Majuli, located in Assam, is recognised as the world’s largest:",
    options: ["Delta", "River island", "Wetland", "Mangrove forest"],
    answer: 1,
    explanation: "Majuli is the world's largest river island, located on the Brahmaputra River."
  },
  {
    id: 10,
    question: "The state song of Assam, ‘O Mur Apunar Desh’, was written by:",
    options: ["Lakshminath Bezbaroa", "Hem Baruah", "Jyoti Prasad Agarwala", "Nabin Chandra Bordoloi"],
    answer: 0,
    explanation: "It was written by Lakshminath Bezbaroa, a prominent figure in modern Assamese literature."
  }
];

export default function AssamGkTest() {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  
  // Timer (5 minutes for 5 questions)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    let timer: any;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !finished) {
      setFinished(true);
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const handleSelect = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: optionIndex
    });
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++;
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl text-center border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assam GK Test (Set 1)</h1>
          <p className="text-slate-500 mb-8">5 Questions • 5 Minutes • Multiple Choice</p>
          <div className="space-y-3 mb-8 text-sm text-left bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <p>📋 <span className="font-bold">Rules:</span></p>
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
              You scored {percentage}%
              {percentage >= 80 ? ' 🏆 Excellent job!' : percentage >= 60 ? ' 👍 Good effort!' : ' 📚 Keep practicing!'}
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

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Answer Review</h3>
          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const isCorrect = userAnswer === q.answer;
              
              return (
                <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/50' : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? <CheckCircle2 className="text-emerald-600 mt-1 shrink-0" /> : <XCircle className="text-red-600 mt-1 shrink-0" />}
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Q{idx + 1}. {q.question}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9 mb-4">
                    {q.options.map((opt, optIdx) => (
                      <div 
                        key={optIdx} 
                        className={`p-3 rounded-xl border text-sm font-medium
                          ${optIdx === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 
                            optIdx === userAnswer && !isCorrect ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/40 dark:text-red-300' : 
                            'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}
                        `}
                      >
                        {opt} {optIdx === q.answer && '✓'} {optIdx === userAnswer && !isCorrect && '✗ (Your Answer)'}
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
            {currentQ.options.map((option, idx) => (
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
