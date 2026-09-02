
import React from 'react';
import { Calendar, Building, MapPin, CheckCircle, AlertCircle, FileText, ExternalLink, IndianRupee } from 'lucide-react';

export default function TenderCard({ tender }: { tender: any }) {
  const isClosed = tender.closing_date ? new Date(tender.closing_date) < new Date() : false;
  const isVerified = tender.verification_status === 'VERIFIED';
  
  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${isClosed ? 'opacity-75 border-slate-200' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded tracking-wider">
              {tender.department || 'Govt Tender'}
            </span>
            {isVerified ? (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded flex items-center gap-1 tracking-wider">
                <CheckCircle size={10} /> Verified Official
              </span>
            ) : (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded flex items-center gap-1 tracking-wider">
                <AlertCircle size={10} /> Source Unverified
              </span>
            )}
            {isClosed && (
               <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded tracking-wider">
                 Closed
               </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
            {tender.title}
          </h3>
          <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5">
            <Building size={14} className="text-slate-400" /> {tender.organization}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tender No.</span>
          <span className="text-sm font-bold text-slate-700 truncate">{tender.tender_number || 'N/A'}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Value</span>
          <span className="text-sm font-bold text-slate-700 truncate flex items-center gap-0.5">
            {tender.estimated_value ? <><IndianRupee size={12}/> {tender.estimated_value}</> : 'N/A'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Closing Date</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
            <Calendar size={12} className={isClosed ? "text-red-400" : "text-emerald-500"}/> 
            {tender.closing_date ? new Date(tender.closing_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</span>
          <span className="text-sm font-bold text-slate-700 truncate flex items-center gap-1">
            <MapPin size={12} className="text-slate-400"/> {tender.location || 'Assam'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
        <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
           <FileText size={14}/> 
           {tender.discovered_sources && tender.discovered_sources.length > 0 ? 
              `Discovered via ${tender.discovered_sources[0].source_name || 'Multiple Sources'}` 
              : 'Direct Ingestion'
           }
        </div>
        {tender.official_source_url ? (
          <a 
            href={tender.official_source_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-center transition flex justify-center items-center gap-2 ${
              isClosed ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/20'
            }`}
          >
            View Tender <ExternalLink size={14} />
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
