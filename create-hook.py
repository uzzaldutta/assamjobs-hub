import os

os.makedirs("src/hooks", exist_ok=True)

hook_content = """
import { useState, useEffect } from "react";

export interface ExamHistoryItem {
  id: string;
  title: string;
  slug: string;
  viewedAt: string;
}

export function useExamHistory() {
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("recentExams");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load exam history from localStorage", e);
    }
  }, []);

  const addExam = (exam: { id: string; title: string; slug: string }) => {
    if (typeof window === "undefined") return;
    try {
      const current = [...history];
      const filtered = current.filter((e) => e.id !== exam.id);
      const newItem = {
        id: exam.id,
        title: exam.title,
        slug: exam.slug,
        viewedAt: new Date().toISOString()
      };
      filtered.unshift(newItem);
      const newHistory = filtered.slice(0, 5); // Keep last 5
      
      setHistory(newHistory);
      localStorage.setItem("recentExams", JSON.stringify(newHistory));
    } catch (e) {
      console.warn("Failed to save exam history to localStorage", e);
    }
  };

  const clearHistory = () => {
    if (typeof window === "undefined") return;
    try {
      setHistory([]);
      localStorage.removeItem("recentExams");
    } catch (e) {
      console.warn("Failed to clear exam history", e);
    }
  };

  return { history, addExam, clearHistory };
}
"""

with open("src/hooks/useExamHistory.ts", "w", encoding="utf-8") as f:
    f.write(hook_content)

print("Created useExamHistory hook.")
