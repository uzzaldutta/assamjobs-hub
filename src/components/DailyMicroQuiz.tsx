"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Flame, 
  Trophy, 
  HelpCircle, 
  Languages, 
  Clock,
  BookOpen
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface QuizQuestion {
  id: string;
  category: string;
  category_as: string;
  question: string;
  question_as: string;
  options: string[];
  options_as: string[];
  answerIndex: number;
  explanation: string;
  explanation_as: string;
}

// 15 High-Yield Curated Questions covering Assam Competitive Exams (ADRE 2.0, APSC CCE, Assam Police, Forest Guard)
const QUESTION_BANK: QuizQuestion[] = [
  {
    id: "q-1",
    category: "Assam History",
    category_as: "অসম বুৰঞ্জী",
    question: "Who was the Ahom King during the historic Battle of Saraighat in 1671?",
    question_as: "১৬৭১ চনৰ ঐতিহাসিক শৰাইঘাটৰ যুদ্ধৰ সময়ত আহোম স্বৰ্গদেউ কোন আছিল?",
    options: ["Rudra Singha", "Udayaditya Singha", "Gadadhar Singha", "Chakradhwaj Singha"],
    options_as: ["ৰুদ্ৰ সিংহ", "উদয়াদিত্য সিংহ", "গদাধৰ সিংহ", "চক্ৰধ্বজ সিংহ"],
    answerIndex: 1,
    explanation: "Although the battle preparations began under King Chakradhwaj Singha, the actual Battle of Saraighat in 1671 took place during the reign of King Udayaditya Singha, led by Lachit Borphukan.",
    explanation_as: "যদিও যুদ্ধৰ প্ৰস্তুতি স্বৰ্গদেউ চক্ৰধ্বজ সিংহৰ দিনত আৰম্ভ হৈছিল, ১৬৭১ চনৰ শৰাইঘাটৰ যুদ্ধ স্বৰ্গদেউ উদয়াদিত্য সিংহৰ ৰাজত্বকালত লাচিত বৰফুকনৰ নেতৃত্বত সংঘটিত হৈছিল।"
  },
  {
    id: "q-2",
    category: "Assam Geography",
    category_as: "অসমৰ ভূগোল",
    question: "Which of the following National Parks in Assam is famous as the only habitat of the Pygmy Hog in the world?",
    question_as: "বিশ্বৰ একমাত্ৰ নল-গাহৰি (Pygmy Hog)ৰ প্ৰাকৃতিক বাসস্থান হিচাপে অসমৰ কোনখন ৰাষ্ট্ৰীয় উদ্যান বিখ্যাত?",
    options: ["Kaziranga National Park", "Manas National Park", "Nameri National Park", "Dibru-Saikhowa National Park"],
    options_as: ["কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান", "মানাহ ৰাষ্ট্ৰীয় উদ্যান", "নামেৰি ৰাষ্ট্ৰীয় উদ্যান", "ডিব্ৰু-ছৈখোৱা ৰাষ্ট্ৰীয় উদ্যান"],
    answerIndex: 1,
    explanation: "Manas National Park is a UNESCO World Heritage Site and the primary natural home for the critically endangered Pygmy Hog.",
    explanation_as: "মানাহ ৰাষ্ট্ৰীয় উদ্যান এখন ইউনেস্কো বিশ্ব ঐতিহ্য ক্ষেত্ৰ আৰু ই সংকটজনকভাৱে বিপন্ন নল-গাহৰিৰ প্ৰধান বাসস্থান।"
  },
  {
    id: "q-3",
    category: "Indian Polity & Assam",
    category_as: "ৰাজনীতি আৰু শাসন ব্যৱস্থা",
    question: "Which special Article of the Indian Constitution contains special provisions with respect to the State of Assam?",
    question_as: "ভাৰতীয় সংবিধানৰ কোনটো বিশেষ অনুচ্ছেদত অসম ৰাজ্যৰ বাবে বিশেষ ব্যৱস্থা সন্নিবিষ্ট কৰা হৈছে?",
    options: ["Article 371A", "Article 371B", "Article 371C", "Article 371F"],
    options_as: ["অনুচ্ছেদ ৩৭১-ক", "অনুচ্ছেদ ৩৭১-খ", "অনুচ্ছেদ ৩৭১-গ", "অনুচ্ছেদ ৩৭১-চ"],
    answerIndex: 1,
    explanation: "Article 371B makes special provisions for the creation of a committee of the Assam Legislative Assembly consisting of members elected from tribal areas.",
    explanation_as: "অনুচ্ছেদ ৩৭১-খ অনুসৰি অসম বিধানসভাৰ জনজাতি এলেকাসমূহৰ পৰা নিৰ্বাচিত সদস্যৰে গঠিত বিশেষ সমিতি গঠনৰ ব্যৱস্থা আছে।"
  },
  {
    id: "q-4",
    category: "Assam Schemes & Current Affairs",
    category_as: "অসমৰ আঁচনি আৰু সাম্প্ৰতিক ঘটনা",
    question: "Under the 'Nijut Moina' Scheme launched by the Assam Government, financial aid is provided to promote:",
    question_as: "অসম চৰকাৰে আৰম্ভ কৰা 'নিজুত মইনা' আঁচনিৰ মূল উদ্দেশ্য কি?",
    options: ["Skill training for unemployed youth", "Higher education of girl students to fight child marriage", "Solar irrigation pumps for farmers", "Subsidized loans for rural artisans"],
    options_as: ["বেকাৰ যুৱক-যুৱতীসকলৰ দক্ষতা প্ৰশিক্ষণ", "বাল্যবিবাহ ৰোধ আৰু ছাত্ৰীসকলৰ উচ্চ শিক্ষাৰ প্ৰসাৰ", "কৃষকৰ বাবে সৌৰ জলসিঞ্চন পাম্প", "গ্ৰাম্য শিল্পীসকলৰ ৰেহাইযুক্ত ঋণ"],
    answerIndex: 1,
    explanation: "The Nijut Moina scheme provides monthly financial stipends to girl students from HS 1st year to Post-Graduation to prevent dropouts and eradicate child marriage in Assam.",
    explanation_as: "উচ্চতৰ মাধ্যমিকৰ পৰা স্নাতকোত্তৰ পৰ্যায়লৈকে ছাত্ৰীসকলক প্ৰতিমাহে আৰ্থিক অনুদান আগবঢ়াই বাল্যবিবাহ ৰোধ কৰাটোৱেই এই আঁচনিৰ মূল লক্ষ্য।"
  },
  {
    id: "q-5",
    category: "General Science & Mental Ability",
    category_as: "সাধাৰণ বিজ্ঞান আৰু যুক্তি",
    question: "Which gas is primarily responsible for the natural blue coloration of the sky during daytime?",
    question_as: "দিনৰ ভাগত আকাশৰ নীলা ৰং দেখা যোৱাৰ বাবে পোহৰৰ কোনটো ভৌতিক পৰিঘটনা দায়ী?",
    options: ["Rayleigh Scattering of light", "Total Internal Reflection", "Dispersion through raindrops", "Atmospheric Diffraction"],
    options_as: ["পোহৰৰ ৰেলী বিচ্ছুৰণ (Rayleigh Scattering)", "পূৰ্ণ অভ্যন্তৰীণ প্ৰতিফলন", "বৰষুণৰ টোপালৰ মাজেৰে বিচ্ছুৰণ", "বায়ুমণ্ডলীয় অপবৰ্তন"],
    answerIndex: 0,
    explanation: "Shorter blue wavelengths of sunlight are scattered much more strongly by atmospheric gas molecules than longer red wavelengths, known as Rayleigh scattering.",
    explanation_as: "বায়ুমণ্ডলৰ অণুসমূহে নীলা ৰঙৰ কম তৰংগদৈৰ্ঘ্য অধিক পৰিমাণে বিচ্ছুৰিত কৰাৰ বাবেই আকাশখন নীলা দেখা যায়।"
  },
  {
    id: "q-6",
    category: "Assam History",
    category_as: "অসম বুৰঞ্জী",
    question: "Who established the Koch dynasty in Western Assam?",
    question_as: "পশ্চিম অসমত কোচ বংশৰ প্ৰতিষ্ঠাপক কোন আছিল?",
    options: ["Naranarayan", "Chilarai", "Viswa Singha", "Pran Narayan"],
    options_as: ["নৰনাৰায়ণ", "চিিলাৰায়", "বিশ্ব সিংহ", "প্ৰাণ নাৰায়ণ"],
    answerIndex: 2,
    explanation: "Viswa Singha (Bisu) established the powerful Koch Kingdom around 1515 AD, which reached its zenith under his sons King Naranarayan and General Chilarai.",
    explanation_as: "১৫১৫ খ্ৰীষ্টাব্দত বিশ্ব সিংহই কোচ সাম্ৰাজ্যৰ ভেটি স্থাপন কৰিছিল, যি তেওঁৰ পুত্ৰ মহাৰাজা নৰনাৰায়ণ আৰু সেনাপতি চিলাৰায়ৰ দিনত সৰ্বোচ্চ শিখৰ পাইছিল।"
  },
  {
    id: "q-7",
    category: "Assam Geography",
    category_as: "অসমৰ ভূগোল",
    question: "Which tributary of the Brahmaputra river is known as the 'River of Gold'?",
    question_as: "ব্ৰহ্মপুত্ৰৰ কোনখন উপনৈক 'সোণৰ নদী' বা 'সোৱণশিৰি' বুলি জনা যায়?",
    options: ["Jia Bharali", "Subansiri", "Manas", "Dhansiri"],
    options_as: ["জীয়া ভৰলী", "সোৱণশিৰি", "মানাহ", "ধনশিৰি"],
    answerIndex: 1,
    explanation: "Subansiri translates from Sanskrit ('Suvarna' + 'Siri') to 'having gold', as its riverbed sands historically contained alluvial gold dust.",
    explanation_as: "সংস্কৃত 'সুবৰ্ণ' (সোণ) শব্দৰ পৰা সোৱণশিৰি নামটো আহিছে, যাৰ বালিত প্ৰাচীন কালত সোণৰ ৰেণু পোৱা গৈছিল।"
  },
  {
    id: "q-8",
    category: "Assam Culture & Literature",
    category_as: "অসমৰ সংস্কৃতি আৰু সাহিত্য",
    question: "In which year was the first Assamese printed book, the translation of the Bible by Atmaram Sarma, published?",
    question_as: "আত্মাৰাম শৰ্মাই অনুবাদ কৰা প্ৰথমখন অসমীয়া ছপা পুথি (ধৰ্মপুস্তক) কোন চনত প্ৰকাশ পাইছিল?",
    options: ["1813", "1826", "1836", "1846"],
    options_as: ["১৮১৩", "১৮২৬", "১৮৩৬", "১৮৪৬"],
    answerIndex: 0,
    explanation: "Atmaram Sarma translated the New Testament into Assamese, which was printed at the Serampore Baptist Mission Press in 1813, marking the birth of modern Assamese printed literature.",
    explanation_as: "১৮১৩ চনত শ্ৰীৰামপুৰ বেপ্টিষ্ট মিছন প্ৰেছৰ পৰা আত্মাৰাম শৰ্মাৰ দ্বাৰা অনূদিত বাইবেল ছপা হয়।"
  },
  {
    id: "q-9",
    category: "Indian Constitution",
    category_as: "ভাৰতৰ সংবিধান",
    question: "Which Schedule of the Indian Constitution governs the administration of Autonomous District Councils in Assam?",
    question_as: "ভাৰতীয় সংবিধানৰ কোনখন অনুসূচীয়ে অসমৰ স্বায়ত্বশাসিত জিলা পৰিষদসমূহৰ প্ৰশাসন নিয়ন্ত্ৰণ কৰে?",
    options: ["Fifth Schedule", "Sixth Schedule", "Seventh Schedule", "Ninth Schedule"],
    options_as: ["পঞ্চম অনুসূচী", "ষষ্ঠ অনুসূচী", "সপ্তম অনুসূচী", "নৱম অনুসূচী"],
    answerIndex: 1,
    explanation: "The Sixth Schedule provides for the administration of tribal areas in Assam (BTAD, Karbi Anglong, Dima Hasao), Meghalaya, Tripura, and Mizoram through Autonomous Councils.",
    explanation_as: "ষষ্ঠ অনুসূচীৰ অধীনত অসমৰ কাৰ্বি আংলং, ডিমা হাছাও আৰু বিটিচি আদি এলেকাত স্বায়ত্বশাসিত পৰিষদ পৰিচালিত হয়।"
  },
  {
    id: "q-10",
    category: "Assam Current Affairs",
    category_as: "অসমৰ সাম্প্ৰতিক তথ্য",
    question: "The historic 'Moidams of Charaideo' were officially inscribed as Assam's first Cultural UNESCO World Heritage Site in:",
    question_as: "চৰাইদেউৰ মৈদামক আনুষ্ঠানিকভাৱে ইউনেস্কোৰ সাংস্কৃতিক বিশ্ব ঐতিহ্য ক্ষেত্ৰ হিচাপে কেতিয়া স্বীকৃতি দিয়া হয়?",
    options: ["July 2024", "January 2025", "August 2023", "December 2022"],
    options_as: ["জুলাই ২০২৪", "জানুৱাৰী ২০২৫", "আগষ্ট ২০২৩", "ডিচেম্বৰ ২০২২"],
    answerIndex: 0,
    explanation: "At the 46th session of the World Heritage Committee in New Delhi in July 2024, the Moidams of the Ahom Dynasty in Charaideo were inscribed as a UNESCO World Heritage Site.",
    explanation_as: "২০২৪ চনৰ জুলাই মাহত নতুন দিল্লীত অনুষ্ঠিত ইউনেস্কোৰ ৪৬তম অধিবেশনত চৰাইদেউ মৈদামক বিশ্ব ঐতিহ্য ক্ষেত্ৰ হিচাপে ঘোষণা কৰা হয়।"
  }
];

export default function DailyMicroQuiz() {
  const { lang } = useLanguage();
  const [preferredLang, setPreferredLang] = useState<"en" | "as">(lang === "as" ? "as" : "en");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(1);
  const [todayQuiz, setTodayQuiz] = useState<QuizQuestion[]>([]);

  // Update preferred lang if site lang changes
  useEffect(() => {
    setPreferredLang(lang === "as" ? "as" : "en");
  }, [lang]);

  // Load deterministic questions based on today's day of year
  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Pick 5 rotating questions
    const selected: QuizQuestion[] = [];
    const total = QUESTION_BANK.length;
    for (let i = 0; i < 5; i++) {
      const qIndex = (dayOfYear + i * 2) % total;
      selected.push(QUESTION_BANK[qIndex]);
    }
    setTodayQuiz(selected);

    // Load streak from localStorage
    try {
      const storedStreak = localStorage.getItem("ajh_daily_streak");
      const lastCompletedDate = localStorage.getItem("ajh_daily_streak_date");
      const todayDateStr = now.toISOString().split("T")[0];

      if (storedStreak) {
        setStreak(parseInt(storedStreak, 10));
      }

      // Check if already completed today
      if (lastCompletedDate === todayDateStr) {
        const savedScore = localStorage.getItem("ajh_daily_score");
        if (savedScore) {
          // Pre-complete
          // setIsCompleted(true);
        }
      }
    } catch {
      // Ignore localStorage issues
    }
  }, []);

  const currentQ = todayQuiz[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // Already answered

    const newAnswers = { ...selectedAnswers, [currentIndex]: optionIndex };
    setSelectedAnswers(newAnswers);

    // Track analytics
    try {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "daily_quiz_answer", {
          question_id: currentQ.id,
          is_correct: optionIndex === currentQ.answerIndex,
        });
      }
    } catch {}
  };

  const handleNext = () => {
    if (currentIndex < todayQuiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz Finished!
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsCompleted(true);
    const score = calculateScore();

    try {
      const todayDateStr = new Date().toISOString().split("T")[0];
      const lastCompleted = localStorage.getItem("ajh_daily_streak_date");

      let newStreak = streak;
      if (lastCompleted !== todayDateStr) {
        newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("ajh_daily_streak", newStreak.toString());
        localStorage.setItem("ajh_daily_streak_date", todayDateStr);
      }
      localStorage.setItem("ajh_daily_score", `${score}/${todayQuiz.length}`);

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "daily_quiz_completed", {
          score,
          total: todayQuiz.length,
          streak: newStreak,
        });
      }
    } catch {}
  };

  const calculateScore = () => {
    let score = 0;
    todayQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) score++;
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const isAssam = preferredLang === "as";

  if (!currentQ && !isCompleted) return null;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-indigo-100 dark:border-indigo-950/60 shadow-md relative overflow-hidden">
      {/* Background Gradient Accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                {isAssam ? "দৈনিক ৫ মিনিটৰ পৰীক্ষা প্ৰস্তুতি" : "Daily 5-Min Exam Practice"}
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                <Flame size={12} className="text-amber-500 fill-amber-500" /> {streak}-Day Streak
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAssam
                ? "ADRE 2.0, APSC CCE আৰু অসম পুলিচৰ বাবে প্ৰতিদিনে ৫টা নিৰ্বাচিত প্ৰশ্ন"
                : "5 high-yield GK & Aptitude questions curated for ADRE, APSC & Assam Police"}
            </p>
          </div>
        </div>

        {/* Action Controls: Language Toggle & Streak on Mobile */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setPreferredLang(isAssam ? "en" : "as")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            title="Toggle Question Language"
          >
            <Languages size={13} className="text-indigo-600 dark:text-indigo-400" />
            <span>{isAssam ? "English" : "অসমীয়া"}</span>
          </button>

          <span className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Flame size={13} className="text-amber-500 fill-amber-500" /> {streak}d
          </span>
        </div>
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {!isCompleted ? (
        <div className="space-y-5">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-extrabold text-[11px]">
              <BookOpen size={13} /> {isAssam ? currentQ.category_as : currentQ.category}
            </span>
            <span>
              {isAssam ? `প্ৰশ্ন ${currentIndex + 1} / ${todayQuiz.length}` : `Question ${currentIndex + 1} of ${todayQuiz.length}`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / todayQuiz.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {isAssam ? currentQ.question_as : currentQ.question}
            </h4>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, optIdx) => {
              const optText = isAssam ? currentQ.options_as[optIdx] : option;
              const hasAnswered = selectedAnswers[currentIndex] !== undefined;
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const isCorrect = optIdx === currentQ.answerIndex;

              let btnClass = "border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200";

              if (hasAnswered) {
                if (isCorrect) {
                  btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm";
                } else if (isSelected && !isCorrect) {
                  btnClass = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold";
                } else {
                  btnClass = "opacity-50 border-slate-200 dark:border-slate-800";
                }
              }

              const letters = ["A", "B", "C", "D"];

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 ${btnClass} group`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                      hasAnswered && isCorrect 
                        ? "bg-emerald-500 text-white" 
                        : hasAnswered && isSelected
                        ? "bg-rose-500 text-white"
                        : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    }`}>
                      {letters[optIdx]}
                    </span>
                    <span className="font-semibold leading-tight">{optText}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout (Reveals after answering) */}
          {selectedAnswers[currentIndex] !== undefined && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-2.5">
                <HelpCircle size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-0.5">
                    {isAssam ? "💡 স্পষ্টীকৰণ:" : "💡 Answer Explanation:"}
                  </span>
                  {isAssam ? currentQ.explanation_as : currentQ.explanation}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {selectedAnswers[currentIndex] === undefined ? (
                isAssam ? "এটা উত্তৰ নিৰ্বাচন কৰক" : "Select an option to verify"
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {selectedAnswers[currentIndex] === currentQ.answerIndex 
                    ? (isAssam ? "✓ সঠিক উত্তৰ!" : "✓ Correct Answer!") 
                    : (isAssam ? "✗ ভুল উত্তৰ" : "✗ Incorrect")}
                </span>
              )}
            </span>

            {selectedAnswers[currentIndex] !== undefined && (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all animate-in fade-in"
              >
                <span>
                  {currentIndex === todayQuiz.length - 1 
                    ? (isAssam ? "ফলাফল চাওক" : "See Final Score") 
                    : (isAssam ? "পৰৱৰ্তী প্ৰশ্ন" : "Next Question")}
                </span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ SCORE COMPLETION CARD */
        <div className="text-center py-6 px-4 space-y-5 animate-in zoom-in-95 duration-400">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg">
            <Trophy size={32} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-2">
              <CheckCircle2 size={14} /> {isAssam ? "দৈনিক অভ্যাস সম্পূৰ্ণ" : "Daily Practice Completed"}
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAssam ? `আপোনাৰ নম্বৰ: ${calculateScore()} / ${todayQuiz.length}` : `You Scored ${calculateScore()} / ${todayQuiz.length}!`}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              {calculateScore() >= 4 
                ? (isAssam ? "অসাধাৰণ প্ৰদৰ্শন! আপোনাৰ প্ৰস্তুতি সঠিক দিশত আছে।" : "Outstanding score! You are on track for upcoming Assam recruitment exams.")
                : (isAssam ? "ভাল প্ৰচেষ্টা! প্ৰতিদিনে এনেদৰে ৫ মিনিট অভ্যাস কৰক।" : "Good effort! Practice daily for 5 minutes to build strong Assam GK mastery.")}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <RotateCcw size={14} />
              <span>{isAssam ? "পুনৰ চেষ্টা কৰক" : "Retake Quiz"}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `I scored ${calculateScore()}/5 in today's AssamJobs Daily Quiz! Test your Assam GK & Exam prep here: https://assamjobshub.com`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow transition"
            >
              <Share2 size={14} />
              <span>{isAssam ? "হোৱাটছএপত শ্বেয়াৰ কৰক" : "Share on WhatsApp"}</span>
            </a>

            <Link
              href="/mock-tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
            >
              <span>{isAssam ? "সম্পূৰ্ণ মক টেষ্ট দিয়ক (১০০+ প্ৰশ্ন)" : "Take Full Mock Test (100+ Qs)"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
