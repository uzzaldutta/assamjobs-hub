
'use client';
import { useState } from "react";
import { SearchCode } from "lucide-react";

export default function TestButton({ sourceId, adapterName }: { sourceId: string, adapterName: string }) {
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/test-source`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ sourceId, adapterName })
      });
      const data = await res.json();
      alert(`TEST EXTRACTION COMPLETE

HTTP: ${data.http_status}
Discovered: ${data.items_discovered}
Valid: ${data.items_valid}
Duplicates: ${data.duplicates}
Missing Links: ${data.missing_links}`);
    } catch (err) {
      alert("Test execution failed.");
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={handleTest} 
      disabled={loading}
      className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 shadow-sm mr-2"
    >
      <SearchCode size={14} className={loading ? "animate-pulse" : ""} /> 
      {loading ? 'Testing...' : 'Test Source (Dry Run)'}
    </button>
  );
}
