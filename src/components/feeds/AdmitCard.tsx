
import React from 'react';
import { Calendar, FileText, CheckCircle, AlertCircle, Building, ExternalLink, Download } from 'lucide-react';

export default function AdmitCard({ admitCard }: { admitCard: any }) {
  const isVerified = admitCard.verification_status === 'VERIFIED';
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-teal-100 text-teal-700 text-[10px] font-black uppercase rounded tracking-wider">
              Admit Card
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
            {admitCard.title}
          </h3>
          <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5">
            <Building size={14} className="text-slate-400" /> {admitCard.organization}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 md:col-span-1">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Name</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 truncate">
            <FileText size={14} className="text-slate-400"/> {admitCard.exam_name || 'Various Exams'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Date</span>
          <span className="text-sm font-bold text-slate-700 truncate">
            {admitCard.exam_date ? new Date(admitCard.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Release Date</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
            <Calendar size={12} className="text-teal-500"/> 
            {admitCard.release_date ? new Date(admitCard.release_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
        {admitCard.download_url || admitCard.official_source_url ? (
          <a 
            href={admitCard.download_url || admitCard.official_source_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/20 rounded-xl font-bold text-sm text-center transition flex justify-center items-center gap-2"
          >
            Download <Download size={14} />
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
