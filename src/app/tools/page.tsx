import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { Compass, Calendar, Mic, FileText, Image as ImageIcon, FileOutput, FileSpreadsheet, Calculator, GraduationCap, BarChart, Keyboard } from "lucide-react";

const toolsData = [
  {
    category: "AI Career Tools",
    description: "Smart tools powered by AI to accelerate your career",
    items: [
      { name: "Career Advisor", icon: <Compass className="text-blue-500" size={24} />, link: "/tools/career-advisor", color: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800" },
      { name: "Study Planner", icon: <Calendar className="text-indigo-500" size={24} />, link: "/tools/study-planner", color: "bg-indigo-50 dark:bg-indigo-900/30", border: "border-indigo-200 dark:border-indigo-800" },
      { name: "Interview Coach", icon: <Mic className="text-purple-500" size={24} />, link: "/tools/interview-prep", color: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-800" },
      { name: "AI CV Maker", icon: <FileText className="text-emerald-500" size={24} />, link: "/tools/cv-maker", color: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800" },
    ]
  },
  {
    category: "Job Application Tools",
    description: "Everything you need to prepare your documents perfectly",
    items: [
      { name: "Photo & Sign Resizer", icon: <ImageIcon className="text-pink-500" size={24} />, link: "/tools/photo-resizer", color: "bg-pink-50 dark:bg-pink-900/30", border: "border-pink-200 dark:border-pink-800" },
      { name: "Image to PDF", icon: <FileOutput className="text-red-500" size={24} />, link: "/tools/pdf-merger", color: "bg-red-50 dark:bg-red-900/30", border: "border-red-200 dark:border-red-800" },
      { name: "Standard Form", icon: <FileSpreadsheet className="text-amber-500" size={24} />, link: "/tools/standard-form", color: "bg-amber-50 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800" },
    ]
  },
  {
    category: "Calculators & Tests",
    description: "Quick utilities for students and job seekers",
    items: [
      { name: "Salary Calculator", icon: <Calculator className="text-teal-500" size={24} />, link: "/tools/salary-calculator", color: "bg-teal-50 dark:bg-teal-900/30", border: "border-teal-200 dark:border-teal-800" },
      { name: "CGPA to Percentage", icon: <GraduationCap className="text-orange-500" size={24} />, link: "/tools/cgpa-converter", color: "bg-orange-50 dark:bg-orange-900/30", border: "border-orange-200 dark:border-orange-800" },
      { name: "Marks Calculator", icon: <BarChart className="text-fuchsia-500" size={24} />, link: "/tools/marks-calculator", color: "bg-fuchsia-50 dark:bg-fuchsia-900/30", border: "border-fuchsia-200 dark:border-fuchsia-800" },
      { name: "Typing Test", icon: <Keyboard className="text-cyan-500" size={24} />, link: "/tools/typing-test", color: "bg-cyan-50 dark:bg-cyan-900/30", border: "border-cyan-200 dark:border-cyan-800" },
    ]
  }
];

export default function ToolsHubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Tools Hub" 
        subtitle="AI tools, calculators, and utilities to help your career"
        theme="blue"
      />

      <div className="max-w-5xl mx-auto w-full px-4 py-8">
        <div className="space-y-12">
          {toolsData.map((section, index) => (
            <div key={index}>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{section.category}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">{section.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.items.map((tool, idx) => (
                  <Link 
                    key={idx} 
                    href={tool.link}
                    className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col items-center text-center"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 border ${tool.color} ${tool.border} group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
