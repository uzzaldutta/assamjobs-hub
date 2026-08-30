import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { CheckCircle2, AlertCircle, Briefcase, GraduationCap, User, Shield } from 'lucide-react';
import React, { useState } from 'react';
import JobCard from '@/components/JobCard';

export default function EligibilityCheckerClient() {
  const [profile, setProfile] = useState({
    age: '',
    qualification: '',
    category: 'General',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const checkEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Fetch latest active jobs
      const res = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.eligibleJobs);
      } else {
        alert("Failed to check eligibility.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Am I Eligible?" 
        subtitle="Enter your details below to instantly find all government and private jobs you are currently eligible to apply for."
        theme="emerald"
      />

      <div className="max-w-6xl mx-auto px-4 mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="text-emerald-500" /> Your Profile
            </h3>
            <form onSubmit={checkEligibility} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Age</label>
                <input 
                  type="number" 
                  required
                  min="16" max="60"
                  placeholder="e.g. 24"
                  value={profile.age}
                  onChange={e => setProfile({...profile, age: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Highest Qualification</label>
                <select 
                  required
                  value={profile.qualification}
                  onChange={e => setProfile({...profile, qualification: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Qualification...</option>
                  <option value="8th Pass">8th Pass</option>
                  <option value="10th Pass (HSLC)">10th Pass (HSLC)</option>
                  <option value="12th Pass (HS)">12th Pass (HS)</option>
                  <option value="Graduation (Any Stream)">Graduation (Any Stream)</option>
                  <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                  <option value="Post Graduation">Post Graduation</option>
                  <option value="Diploma">Diploma</option>
                  <option value="ITI">ITI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Caste Category</label>
                <select 
                  value={profile.category}
                  onChange={e => setProfile({...profile, category: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="General">General (UR)</option>
                  <option value="OBC/MOBC">OBC / MOBC</option>
                  <option value="SC">SC</option>
                  <option value="ST(P)">ST (Plains)</option>
                  <option value="ST(H)">ST (Hills)</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex justify-center items-center gap-2 mt-4"
              >
                {loading ? "Checking..." : "Find My Jobs"}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {results === null ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Shield size={48} className="text-emerald-300 dark:text-emerald-700 mb-4" />
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">Check Your Eligibility</h3>
              <p className="text-emerald-600 dark:text-emerald-500 max-w-sm">
                Enter your age and qualification on the left. Our system will scan all active jobs and match you with the ones you are legally eligible to apply for.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 min-h-[300px] flex flex-col items-center justify-center">
              <AlertCircle size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Matches Found</h3>
              <p className="text-slate-500">We couldn't find any current active jobs that perfectly match your age and qualification. Please check back later!</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" /> You are eligible for {results.length} jobs!
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
