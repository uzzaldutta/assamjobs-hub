"use client";

import { useState, useEffect } from "react";

export interface SavedJob {
  id: string;
  title: string;
  organization: string;
  type: string;
  district: string;
  vacancies: string;
  lastDate: string;
  savedAt: number;
}

export function useBookmarks() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("saved_jobs");
    if (saved) {
      try {
        setSavedJobs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved jobs", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Check if a job is saved
  const isSaved = (jobId: string) => {
    return savedJobs.some((job) => job.id === jobId);
  };

  // Toggle save status
  const toggleSave = (job: any) => {
    setSavedJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      let newSaved;
      
      if (exists) {
        // Remove it
        newSaved = prev.filter((j) => j.id !== job.id);
      } else {
        // Add it
        const savedJob: SavedJob = {
          id: job.id,
          title: job.title || "",
          organization: job.organization || "",
          type: job.type || "",
          district: job.district || "",
          vacancies: job.vacancies || "",
          lastDate: job.lastDate || "",
          savedAt: Date.now(),
        };
        newSaved = [savedJob, ...prev];
      }
      
      // Save to local storage
      localStorage.setItem("saved_jobs", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  return {
    savedJobs,
    isLoaded,
    isSaved,
    toggleSave,
  };
}
