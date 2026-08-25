"use client";

import { useState, useEffect } from "react";

export interface TestResult {
  id: string;
  testId: string;
  testName: string;
  score: number;
  totalQuestions: number;
  completedAt: number;
}

export function useMockTests() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mock_test_results");
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse mock test results", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveResult = (result: Omit<TestResult, "id" | "completedAt">) => {
    setResults((prev) => {
      const newResult: TestResult = {
        ...result,
        id: Math.random().toString(36).substring(7),
        completedAt: Date.now(),
      };
      const newResults = [newResult, ...prev];
      localStorage.setItem("mock_test_results", JSON.stringify(newResults));
      return newResults;
    });
  };

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const totalPercentage = results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0);
    return Math.round(totalPercentage / results.length);
  };

  return {
    results,
    isLoaded,
    saveResult,
    testsCompleted: results.length,
    averageScore: getAverageScore(),
  };
}
