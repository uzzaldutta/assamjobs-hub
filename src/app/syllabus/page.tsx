"use client";

import PageHeader from "@/components/PageHeader";
import { FileText, Download, GraduationCap, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const mockSyllabus = [
  {
    id: "s1",
    title: "ADRE Grade III & IV (Assam Direct Recruitment)",
    organization: "SLRC Assam",
    topics: ["General Knowledge (Assam History, Geography)", "General English", "Mathematics (Class 10 level)", "Mental Ability / Logical Reasoning"],
    examPattern: "100 Multiple Choice Questions (OMR based) carrying 1.5 marks each. Negative marking of 0.5 for Grade III.",
    pdfLink: "#"
  },
  {
    id: "s2",
    title: "Assam Police SI (Sub Inspector)",
    organization: "SLPRB Assam",
    topics: ["Logical Reasoning, Aptitude, Comprehension", "History and Culture of Assam and India", "General Knowledge", "General Science"],
    examPattern: "100 questions carrying 100 marks. 1/2 mark negative for every wrong answer.",
    pdfLink: "#"
  },
  {
    id: "s3",
    title: "APSC CCE (Combined Competitive Exam)",
    organization: "Assam Public Service Commission",
    topics: ["General Studies I (Indian History, Geography, Polity)", "General Studies II (Aptitude, Comprehension)", "Assam specific GS"],
    examPattern: "Prelims (2 Papers, 400 marks). Mains (6 Papers, 1500 marks) followed by Interview (275 marks).",
    pdfLink: "#"
  }
];

export default function SyllabusPage() {
  const [expandedId, setExpandedId] = useState<string | null>(mockSyllabus[0].id);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      
      <PageHeader 
        title="Exam Syllabus" 
        subtitle="Download official syllabuses for all major Assam exams"
        theme="blue"
      />

      <div className="px-4 mt-8 max-w-5xl mx-auto w-full pb-20">
        
        <div className="space-y-4">
          {mockSyllabus.map(item => {
            const isExpanded = expandedId === item.id;
          
            return (
              <div 
                key={item.id} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-indigo-300 shadow-md bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200'}`}
              >
                {/* Header (Clickable) */}
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.organization}</p>
                  </div>
                  <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Body (Expandable) */}
                {isExpanded && (
                  <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-indigo-500" /> Key Topics
                        </h4>
                        <ul className="space-y-2">
                          {item.topics.map((topic, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" /> Exam Pattern
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 leading-relaxed">
                            {item.examPattern}
                          </p>
                        </div>

                        <a 
                          href={item.pdfLink} 
                          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-xl transition shadow-sm"
                        >
                          <Download size={18} /> Download Full Syllabus PDF
                        </a>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
