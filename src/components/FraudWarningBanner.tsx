import { AlertTriangle } from "lucide-react";

export default function FraudWarningBanner() {
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-start gap-3 my-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
      <div>
        <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">Fraud Warning / সাৱধানবাণী</h4>
        <p className="text-xs text-red-600/90 dark:text-red-300/80 mt-1 leading-relaxed">
          Official employers do not ask for payment during recruitment. Never pay for job applications or interviews.
          <br className="my-1"/>
          <span className="italic text-[10px]">চৰকাৰী বা প্ৰকৃত কোম্পানীয়ে কেতিয়াও চাকৰিৰ বাবে ধন নিবিচাৰে। সাৱধান হওঁক!</span>
        </p>
      </div>
    </div>
  );
}
