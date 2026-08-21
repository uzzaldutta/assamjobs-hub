"use client";

import { useState, useEffect, useRef } from "react";
import { Keyboard, Play, RotateCcw } from "lucide-react";

const SAMPLE_TEXT = "Assam Direct Recruitment Grade III exam requires candidates to demonstrate strong typing skills on a computer. Accurate and fast typing is essential for clerical jobs in the state secretariat, directorates, and other government offices. Practice daily to improve your words per minute and minimize errors under pressure. Good luck with your preparation for the upcoming computer proficiency test.";

export default function TypingTest() {
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      setIsFinished(true);
      calculateResults();
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startGame = () => {
    setIsActive(true);
    setIsFinished(false);
    setTimer(60);
    setInput("");
    setWpm(0);
    setAccuracy(100);
    inputRef.current?.focus();
  };

  const calculateResults = () => {
    const wordsTyped = input.trim().split(/\s+/).length;
    const charsTyped = input.length;
    const correctChars = input.split('').filter((char, i) => char === SAMPLE_TEXT[i]).length;
    
    // WPM = (Total characters / 5) / time in minutes
    const calculatedWpm = Math.round((charsTyped / 5) / (60 / 60)); // 60 seconds
    const calculatedAcc = charsTyped > 0 ? Math.round((correctChars / charsTyped) * 100) : 0;
    
    setWpm(calculatedWpm);
    setAccuracy(calculatedAcc);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive && timer === 60) setIsActive(true);
    if (!isFinished) {
      setInput(e.target.value);
    }
  };

  // Render text with highlighting
  const renderText = () => {
    return SAMPLE_TEXT.split("").map((char, index) => {
      let color = "text-slate-400"; // default
      if (index < input.length) {
        color = char === input[index] ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-red-500 bg-red-50 dark:bg-red-900/20";
      }
      return (
        <span key={index} className={`font-mono text-lg transition-colors ${color}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-4">
            <Keyboard className="text-teal-600 dark:text-teal-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Computer Typing Test</h1>
          <p className="text-slate-500 mt-2">Practice for ADRE Grade III and Assam Secretariat Computer Proficiency Tests.</p>
        </div>

        <div className="flex justify-between items-center mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-center px-6 border-r border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Time Left</p>
            <p className={`text-4xl font-black ${timer <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-slate-100'}`}>
              {timer}s
            </p>
          </div>
          
          <div className="flex gap-8 px-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">WPM</p>
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{isFinished ? wpm : '--'}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Accuracy</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{isFinished ? `${accuracy}%` : '--'}</p>
            </div>
          </div>
          
          <div>
            {!isActive && timer === 60 ? (
              <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-md">
                <Play size={18} /> Start Test
              </button>
            ) : (
              <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl transition shadow-md">
                <RotateCcw size={18} /> Restart
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl leading-relaxed select-none">
          {renderText()}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          disabled={isFinished}
          placeholder={isActive ? "Keep typing..." : "Click Start to begin..."}
          className="w-full h-32 p-4 font-mono text-lg rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition disabled:opacity-50"
        ></textarea>

      </div>
    </div>
  );
}
