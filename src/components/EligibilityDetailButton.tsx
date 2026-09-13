"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import EligibilityCheckModal from "./EligibilityCheckModal";

export default function EligibilityDetailButton({ job }: { job: any }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-3 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-3 px-4 rounded-xl transition-colors"
      >
        <CheckCircle2 size={18} />
        Check My Eligibility
      </button>
      
      <EligibilityCheckModal 
        job={job}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
