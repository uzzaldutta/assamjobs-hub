"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Keyboard, Play, RotateCcw, Shuffle, Sparkles, Trophy, CheckCircle2, AlertCircle, Timer } from "lucide-react";
import { CURATED_PASSAGES, generateRandomToughPassage, TypingPassage } from "@/data/typing-passages";

export default function TypingTest() {
  const [selectedCategory, setSelectedCategory] = useState<string>("tough");
  const [testDuration, setTestDuration] = useState<number>(60);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentTitle, setCurrentTitle] = useState<string>("Dynamic Tough Words Challenge");
  const [currentDifficulty, setCurrentDifficulty] = useState<string>("Extreme");

  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorsCount, setErrorsCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or load a new passage
  const loadNewPassage = (category = selectedCategory) => {
    setIsActive(false);
    setIsFinished(false);
    setInput("");
    setTimer(testDuration);
    setWpm(0);
    setAccuracy(100);
    setErrorsCount(0);

    if (category === "tough") {
      const generated = generateRandomToughPassage(60);
      setCurrentText(generated);
      setCurrentTitle("Randomized Tough Words Challenge (Non-Repeating)");
      setCurrentDifficulty("Extreme");
    } else {
      const filtered = CURATED_PASSAGES.filter((p) => category === "all" || p.category === category);
      const randomItem = filtered[Math.floor(Math.random() * filtered.length)] || CURATED_PASSAGES[0];
      setCurrentText(randomItem.text);
      setCurrentTitle(randomItem.title);
      setCurrentDifficulty(randomItem.difficulty);
    }
  };

  useEffect(() => {
    loadNewPassage("tough");
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      calculateFinalResults();
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startGame = () => {
    setIsActive(true);
    setIsFinished(false);
    setTimer(testDuration);
    setInput("");
    setWpm(0);
    setAccuracy(100);
    setErrorsCount(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const calculateFinalResults = () => {
    const charsTyped = input.length;
    let correct = 0;
    let errors = 0;

    for (let i = 0; i < charsTyped; i++) {
      if (input[i] === currentText[i]) {
        correct++;
      } else {
        errors++;
      }
    }

    const timeSpentMinutes = (testDuration - timer) / 60 || 1;
    const grossWpm = Math.round((charsTyped / 5) / timeSpentMinutes);
    const netWpm = Math.max(0, Math.round(((charsTyped - errors) / 5) / timeSpentMinutes));
    const calculatedAcc = charsTyped > 0 ? Math.round((correct / charsTyped) * 100) : 0;

    setWpm(netWpm);
    setAccuracy(calculatedAcc);
    setErrorsCount(errors);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!isActive && timer === testDuration) {
      setIsActive(true);
    }

    if (!isFinished) {
      setInput(val);

      // Live WPM and accuracy update
      const charsTyped = val.length;
      let correct = 0;
      let errors = 0;
      for (let i = 0; i < charsTyped; i++) {
        if (val[i] === currentText[i]) correct++;
        else errors++;
      }

      const elapsedSeconds = testDuration - timer;
      if (elapsedSeconds > 2) {
        const timeMinutes = elapsedSeconds / 60;
        const currentNetWpm = Math.max(0, Math.round(((charsTyped - errors) / 5) / timeMinutes));
        setWpm(currentNetWpm);
      }
      setAccuracy(charsTyped > 0 ? Math.round((correct / charsTyped) * 100) : 100);
      setErrorsCount(errors);

      // Auto-finish if full passage completed
      if (val.length >= currentText.length) {
        setIsActive(false);
        setIsFinished(true);
        calculateFinalResults();
      }
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    loadNewPassage(cat);
  };

  const handleDurationChange = (dur: number) => {
    setTestDuration(dur);
    setTimer(dur);
    setIsActive(false);
    setIsFinished(false);
    setInput("");
  };

  // Render text highlighting
  const renderText = () => {
    return currentText.split("").map((char, index) => {
      let colorClass = "text-slate-400 dark:text-slate-500";
      if (index < input.length) {
        colorClass = char === input[index] 
          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-bold" 
          : "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 font-bold underline";
      } else if (index === input.length) {
        colorClass = "border-b-2 border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-slate-800 dark:text-slate-200";
      }
      return (
        <span key={index} className={`font-mono text-base sm:text-lg transition-colors ${colorClass}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3.5 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white rounded-2xl shadow-lg shadow-teal-500/20 mb-3">
            <Keyboard size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Government Exam Typing Test
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
            Simulate real-world computer proficiency exams for ADRE Grade III, Assam Secretariat, Court Stenographers, and APSC with high-difficulty vocabulary.
          </p>
        </div>

        {/* Categories & Difficulty Selector */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Word Bank:</span>
              {[
                { id: "tough", label: "Random Tough Words", icon: Sparkles },
                { id: "secretariat", label: "Secretariat & Admin" },
                { id: "legal", label: "Legal & Court" },
                { id: "assam", label: "Assam Heritage" },
                { id: "numbers", label: "Numbers & Symbols" },
                { id: "all", label: "All Topics" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-[1.02]"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.icon && <cat.icon size={13} />}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { sec: 60, label: "1 Min" },
                { sec: 120, label: "2 Min" },
                { sec: 300, label: "5 Min (Exam)" },
              ].map((d) => (
                <button
                  key={d.sec}
                  onClick={() => handleDurationChange(d.sec)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    testDuration === d.sec
                      ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current Passage Info Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                currentDifficulty === 'Extreme' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800' :
                currentDifficulty === 'Hard' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              }`}>
                {currentDifficulty}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                {currentTitle}
              </p>
            </div>

            <button
              onClick={() => loadNewPassage()}
              className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 transition shadow-sm shrink-0"
              title="Get a fresh unseen passage with random tough words"
            >
              <Shuffle size={13} className="text-teal-600 dark:text-teal-400" />
              <span>Shuffle Words</span>
            </button>
          </div>
        </div>

        {/* Dashboard Bar: Timer, WPM, Accuracy */}
        <div className="flex justify-between items-center mb-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-center px-4 sm:px-6 border-r border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <Timer size={14} /> Time Left
            </p>
            <p className={`text-3xl sm:text-4xl font-black ${timer <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-slate-100'}`}>
              {timer}s
            </p>
          </div>
          
          <div className="flex gap-4 sm:gap-8 px-2 sm:px-6">
            <div className="text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Net WPM</p>
              <p className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">{wpm}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accuracy</p>
              <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{accuracy}%</p>
            </div>
            <div className="text-center hidden sm:block">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Errors</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-500">{errorsCount}</p>
            </div>
          </div>
          
          <div>
            {!isActive && timer === testDuration ? (
              <button 
                onClick={startGame} 
                className="flex items-center gap-2 px-5 sm:px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-lg shadow-teal-600/20 active:scale-95 text-sm sm:text-base"
              >
                <Play size={18} /> Start Test
              </button>
            ) : (
              <button 
                onClick={() => loadNewPassage()} 
                className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl transition shadow-md active:scale-95 text-sm sm:text-base"
              >
                <RotateCcw size={18} /> Restart
              </button>
            )}
          </div>
        </div>

        {/* Text Display Box */}
        <div className="mb-6 p-6 sm:p-7 bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl leading-relaxed sm:leading-loose select-none max-h-56 overflow-y-auto">
          {renderText()}
        </div>

        {/* Typing Input */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          disabled={isFinished}
          placeholder={isActive ? "Keep typing accurately..." : "Click Start Test or start typing here..."}
          className="w-full h-36 p-4 sm:p-5 font-mono text-base sm:text-lg rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition disabled:opacity-50 resize-none"
        ></textarea>

        {/* Completion Modal / Summary */}
        {isFinished && (
          <div className="mt-6 p-6 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-500 text-white rounded-xl">
                <Trophy size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Test Completed!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Your typing speed: <strong className="text-teal-600 dark:text-teal-400">{wpm} WPM</strong> with <strong className="text-blue-600 dark:text-blue-400">{accuracy}% Accuracy</strong> ({errorsCount} errors).
                </p>
              </div>
            </div>
            <button
              onClick={() => loadNewPassage()}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md shrink-0"
            >
              Try Next Unseen Passage &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
