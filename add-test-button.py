code = """
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
      alert(`TEST EXTRACTION COMPLETE\n\nHTTP: ${data.http_status}\nDiscovered: ${data.items_discovered}\nValid: ${data.items_valid}\nDuplicates: ${data.duplicates}\nMissing Links: ${data.missing_links}`);
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
"""
with open("src/app/admin/studio/ingestion/sources/[id]/TestButton.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("src/app/admin/studio/ingestion/sources/[id]/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

page = page.replace('import RetryButton from "./RetryButton";', 'import RetryButton from "./RetryButton";\nimport TestButton from "./TestButton";')
page = page.replace('<RetryButton', '<TestButton sourceId={source.id} adapterName={source.adapter_name} />\n        <RetryButton')

with open("src/app/admin/studio/ingestion/sources/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)
