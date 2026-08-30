"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2, BookText } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function AIStudyMaterialGenerator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateMaterial = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-study-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate study material");
      }

      if (data.materialId) {
        window.location.href = `/study-materials/${data.materialId}`;
      } else {
        throw new Error("Missing material ID from server.");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="✨ AI Study Material Generator"
        subtitle="Type any exam topic, and our AI will generate a concise, high-yield study guide instantly."
        theme="blue"
      />

      <div className="flex justify-center -mt-16 mb-8 relative z-20">
        <Link href="/study-materials" className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold py-2 px-6 rounded-full shadow-sm hover:shadow-md transition flex items-center gap-2">
          <BookText size={18} />
          Browse Saved Materials
        </Link>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-10 text-center">
          <BookOpen className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-4">What do you want to study?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            Enter a specific topic (e.g., "Assam History: The Ahom Kingdom", "General Science: Vitamins", or "Indian Polity: Fundamental Rights").
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <div className="max-w-2xl mx-auto space-y-4">
            <input 
              type="text" 
              placeholder="Enter study topic..." 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-center text-xl md:text-2xl p-6 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition dark:bg-slate-950 dark:border-slate-800 dark:focus:border-indigo-500"
            />
            
            <button
              onClick={generateMaterial}
              disabled={loading || !topic.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition text-lg shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Generating Guide... (Takes 5-10s)
                </>
              ) : (
                <>
                  <BookOpen size={24} /> Generate Study Guide
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
