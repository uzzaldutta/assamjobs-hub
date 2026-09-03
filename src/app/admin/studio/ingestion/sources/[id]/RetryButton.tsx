
'use client';
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { retrySourceAction } from "../../actions";

export default function RetryButton({ sourceId, adapterName }: { sourceId: string, adapterName: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRetry() {
    setLoading(true);
    await retrySourceAction(sourceId, adapterName);
    setLoading(false);
    window.location.reload();
  }

  return (
    <button 
      onClick={handleRetry} 
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 shadow-sm"
    >
      <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
      {loading ? 'Retrying...' : 'Force Retry Now'}
    </button>
  );
}
