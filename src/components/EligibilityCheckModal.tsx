"use client";

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface EligibilityCheckModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EligibilityCheckModal({ job, isOpen, onClose }: EligibilityCheckModalProps) {
  const [profile, setProfile] = useState({ age: '', qualification: '', category: 'General (UR)' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ eligible: boolean; reason: string } | null>(null);

  if (!isOpen) return null;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/check-single-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, job })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.evaluation);
      } else {
        alert("Failed to check eligibility. Please try again.");
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-900 dark:text-white">Am I Eligible?</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <span className="font-medium">Checking for:</span> {job.title}
          </div>
          
          {result ? (
            <div className={`p-4 rounded-xl border ${result.eligible ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
              <div className="flex items-start gap-3">
                {result.eligible ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-bold ${result.eligible ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                    {result.eligible ? "You look eligible!" : "Probably Not Eligible"}
                  </h4>
                  <p className={`text-sm mt-1 ${result.eligible ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {result.reason}
                  </p>
                </div>
              </div>
              <button onClick={() => setResult(null)} className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Check another profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Your Age</label>
                <input 
                  type="number" 
                  required 
                  min="16" max="65"
                  className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={profile.age} 
                  onChange={e => setProfile({...profile, age: e.target.value})} 
                  placeholder="e.g. 25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Highest Qualification</label>
                <select 
                  required
                  className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile.qualification}
                  onChange={e => setProfile({...profile, qualification: e.target.value})}
                >
                  <option value="">Select Qualification...</option>
                  <option value="8th Pass">8th Pass</option>
                  <option value="10th Pass (HSLC)">10th Pass (HSLC)</option>
                  <option value="12th Pass (HS)">12th Pass (HS)</option>
                  <option value="ITI / Diploma">ITI / Diploma</option>
                  <option value="Graduation (Any Stream)">Graduation (Any Stream)</option>
                  <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                  <option value="Post Graduation">Post Graduation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Category</label>
                <select 
                  className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile.category}
                  onChange={e => setProfile({...profile, category: e.target.value})}
                >
                  <option value="General (UR)">General (UR)</option>
                  <option value="OBC / MOBC">OBC / MOBC</option>
                  <option value="SC">SC</option>
                  <option value="ST (P)">ST (P)</option>
                  <option value="ST (H)">ST (H)</option>
                  <option value="PWD">PWD</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  "Check My Eligibility"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
