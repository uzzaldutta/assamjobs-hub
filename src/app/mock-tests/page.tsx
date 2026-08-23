import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Award, Clock, ArrowRight, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Assam Mock Tests | AssamJobs Hub",
  description: "Take free online mock tests for ADRE, APSC, and Assam Police exams to boost your preparation.",
};

export default function MockTestsIndex() {
  const tests = [
    {
      id: "assam-gk",
      title: "Assam History & Culture (Set 1)",
      category: "Assam GK",
      questions: 10,
      time: "10 Mins",
      color: "border-blue-200 hover:border-blue-500",
      bg: "bg-blue-50 text-blue-600"
    },
    {
      id: "english-grammar",
      title: "General English (Grammar)",
      category: "English",
      questions: 5,
      time: "5 Mins",
      color: "border-violet-200 hover:border-violet-500",
      bg: "bg-violet-50 text-violet-600"
    },
    {
      id: "logical-reasoning",
      title: "Logical Reasoning & Math",
      category: "Aptitude",
      questions: 5,
      time: "5 Mins",
      color: "border-amber-200 hover:border-amber-500",
      bg: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 flex items-center gap-3">
              <Target className="w-10 h-10 text-yellow-300" /> 
              Online Mock Tests
            </h1>
            <p className="text-indigo-100 max-w-2xl text-lg mb-8">
              Practice for ADRE, Assam Police, and APSC with our free timed quizzes. Get instant scores and detailed answer reviews. No registration required!
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock size={16} /> Real Exam Timer
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Award size={16} /> Instant Score
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <BookOpen className="w-64 h-64 rotate-12" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Available Tests</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test, idx) => (
            <div key={idx} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${test.color} shadow-sm transition-all group relative`}>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${test.bg}`}>
                {test.category}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2">
                {test.title}
              </h3>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-1.5"><BookOpen size={16} /> {test.questions} Qs</div>
                <div className="flex items-center gap-1.5"><Clock size={16} /> {test.time}</div>
              </div>
              
              {test.id.startsWith("coming-soon") ? (
                <button disabled className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-xl cursor-not-allowed">
                  Coming Soon
                </button>
              ) : (
                <Link href={`/mock-tests/${test.id}`} className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white font-bold rounded-xl transition">
                  Start Test <ArrowRight size={18} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
