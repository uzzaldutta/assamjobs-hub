code_adm = """
import React from 'react';
import { Calendar, GraduationCap, CheckCircle, AlertCircle, Building2, ExternalLink } from 'lucide-react';

export default function AdmissionCard({ admission }: { admission: any }) {
  const isClosed = admission.application_deadline ? new Date(admission.application_deadline) < new Date() : false;
  const isVerified = admission.verification_status === 'VERIFIED';
  
  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${isClosed ? 'opacity-75 border-slate-200' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-violet-100 text-violet-700 text-[10px] font-black uppercase rounded tracking-wider">
              {admission.admission_type || 'Admission'}
            </span>
            {isVerified ? (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded flex items-center gap-1 tracking-wider">
                <CheckCircle size={10} /> Verified
              </span>
            ) : (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded flex items-center gap-1 tracking-wider">
                <AlertCircle size={10} /> Unverified
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
            {admission.title}
          </h3>
          <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5">
            <Building2 size={14} className="text-slate-400" /> {admission.institution}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 md:col-span-2">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course / Program</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 truncate">
            <GraduationCap size={14} className="text-slate-400"/> {admission.course || 'Various Courses'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Entrance Exam</span>
          <span className="text-sm font-bold text-slate-700 truncate">
            {admission.entrance_exam || 'Merit Based'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
            <Calendar size={12} className={isClosed ? "text-red-400" : "text-emerald-500"}/> 
            {admission.application_deadline ? new Date(admission.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
        <div className="text-xs font-medium text-slate-500 truncate max-w-xs">
           Eligibility: {admission.eligibility || 'See notification for details'}
        </div>
        {admission.application_link || admission.official_source_url ? (
          <a 
            href={admission.application_link || admission.official_source_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-center transition flex justify-center items-center gap-2 ${
              isClosed ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-600/20'
            }`}
          >
            Apply Now <ExternalLink size={14} />
          </a>
        ) : (
          <button disabled className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-center bg-slate-100 text-slate-400 cursor-not-allowed">
            Link Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
"""

code_res = """
import React from 'react';
import { Calendar, FileText, CheckCircle, AlertCircle, Award, ExternalLink } from 'lucide-react';

export default function ResultCard({ result }: { result: any }) {
  const isVerified = result.verification_status === 'VERIFIED';
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded tracking-wider">
              {result.result_type || 'Result'}
            </span>
            {isVerified ? (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded flex items-center gap-1 tracking-wider">
                <CheckCircle size={10} /> Verified
              </span>
            ) : (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded flex items-center gap-1 tracking-wider">
                <AlertCircle size={10} /> Unverified
              </span>
            )}
            {result.year && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded tracking-wider">
                {result.year}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
            {result.title}
          </h3>
          <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5">
            <Award size={14} className="text-slate-400" /> {result.organization}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 md:col-span-2">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Name</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 truncate">
            <FileText size={14} className="text-slate-400"/> {result.exam_name || 'Various Exams'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Date</span>
          <span className="text-sm font-bold text-slate-700 truncate">
            {result.exam_date ? new Date(result.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Result Declared</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
            <Calendar size={12} className="text-blue-500"/> 
            {result.result_date ? new Date(result.result_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
        {result.result_url || result.official_source_url ? (
          <a 
            href={result.result_url || result.official_source_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 rounded-xl font-bold text-sm text-center transition flex justify-center items-center gap-2"
          >
            Check Result <ExternalLink size={14} />
          </a>
        ) : (
          <button disabled className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-center bg-slate-100 text-slate-400 cursor-not-allowed">
            Link Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
"""

with open("src/components/feeds/AdmissionCard.tsx", "w", encoding="utf-8") as f:
    f.write(code_adm)

with open("src/components/feeds/ResultCard.tsx", "w", encoding="utf-8") as f:
    f.write(code_res)
