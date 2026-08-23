import { Metadata } from "next";
import Link from "next/link";
import { Calculator, FileText, Image as ImageIcon, Type, Briefcase, GraduationCap, FileOutput, ShieldQuestion, ChevronRight, Award, Sparkles, Wallet, CreditCard, MapPin, Bookmark, Calendar, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Applicant Tools | AssamJobs Hub",
  description: "Free tools for job applicants in Assam including Standard Form, Salary Calculator, Typing Test, and more.",
};

export default function ToolsIndexPage() {
  const tools = [
    {
      id: "marks-calculator",
      title: "SEBA / AHSEC Marks Calculator",
      description: "Calculate your exact percentage, best of 5, and division instantly.",
      icon: <Award className="w-6 h-6" />,
      color: "border-blue-100 dark:border-blue-900 hover:border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      id: "interview-prep",
      title: "AI Interview Coach",
      description: "Type any job title and instantly get the top 10 most likely interview questions.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "border-violet-100 dark:border-violet-900 hover:border-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/20"
    },
    {
      id: "study-planner",
      title: "AI Study Planner",
      description: "Generate a custom day-by-day study timetable optimized for Assam exams.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "border-cyan-100 dark:border-cyan-900 hover:border-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-900/20"
    },
    {
      id: "career-advisor",
      title: "AI Career Path Advisor",
      description: "Enter your qualifications and get a personalized list of Govt jobs you are eligible for.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "border-fuchsia-100 dark:border-fuchsia-900 hover:border-fuchsia-500",
      bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20"
    },
    {
      id: "fee-calculator",
      title: "Exam Fee Calculator",
      description: "Check your exact application fee and exemptions for major exams based on caste.",
      icon: <Wallet className="w-6 h-6" />,
      color: "border-emerald-100 dark:border-emerald-900 hover:border-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      id: "standard-form",
      title: "Auto Standard Form",
      description: "Generate Assam Govt Standard Form automatically.",
      icon: <FileText size={28} className="text-indigo-500" />,
      color: "border-indigo-100 dark:border-indigo-900 hover:border-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      id: "salary-calculator",
      title: "Salary Calculator",
      description: "Calculate in-hand salary for Assam Govt employees.",
      icon: <CreditCard size={28} className="text-emerald-500" />,
      color: "border-emerald-100 dark:border-emerald-900 hover:border-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      id: "typing-test",
      title: "Typing Speed Test",
      description: "Practice for ADRE skill tests with live WPM tracking.",
      icon: <Award size={28} className="text-teal-500" />,
      color: "border-teal-100 dark:border-teal-900 hover:border-teal-500",
      bg: "bg-teal-50 dark:bg-teal-900/20"
    },
    {
      id: "photo-resizer",
      title: "Photo & Sign Resizer",
      description: "Resize images to exact KB/Pixel requirements.",
      icon: <MapPin size={28} className="text-pink-500" />,
      color: "border-pink-100 dark:border-pink-900 hover:border-pink-500",
      bg: "bg-pink-50 dark:bg-pink-900/20"
    },
    {
      id: "cgpa-converter",
      title: "CGPA Converter",
      description: "Convert CGPA to percentage according to university rules.",
      icon: <GraduationCap size={28} className="text-amber-500" />,
      color: "border-amber-100 dark:border-amber-900 hover:border-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      id: "pdf-merger",
      title: "Image to PDF",
      description: "Convert and merge multiple images into a single PDF.",
      icon: <Bookmark size={28} className="text-rose-500" />,
      color: "border-rose-100 dark:border-rose-900 hover:border-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20"
    },
    {
      id: "age-calculator",
      title: "Age Calculator",
      description: "Calculate your exact age as of a specific cut-off date.",
      icon: <Calendar size={28} className="text-blue-500" />,
      color: "border-blue-100 dark:border-blue-900 hover:border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      id: "cv-maker",
      title: "AI CV Maker",
      description: "Create a professional ATS-friendly resume instantly.",
      icon: <Briefcase size={28} className="text-purple-500" />,
      color: "border-purple-100 dark:border-purple-900 hover:border-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-6 pb-8 md:pb-6 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-300" /> Free Applicant Tools
        </h2>
        <p className="text-indigo-100 text-sm max-w-lg mx-auto">
          A suite of free, privacy-friendly tools designed specifically to help Assam job seekers format documents and prepare for exams.
        </p>
      </div>

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {tools.map((tool) => (
          <Link 
            key={tool.id} 
            href={`/tools/${tool.id}`}
            className={`flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-slate-900 border ${tool.color} shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${tool.bg} group-hover:scale-110 transition-transform duration-300`}>
              {tool.icon}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1 text-center">
              {tool.title}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
