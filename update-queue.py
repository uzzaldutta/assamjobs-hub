import re

with open("src/app/admin/studio/ingestion/queue/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

new_ui = """
            const payload = item.normalized_payload || {};
            const sourceMeta = item.ingestion_sources;
            
            // Calculate Priority
            let priority = 'NORMAL';
            let pColor = 'bg-slate-100 text-slate-700';
            if (item.status === 'LOW_QUALITY' && item.validation_errors?.includes('MISSING_LINK')) { priority = 'CRITICAL'; pColor = 'bg-red-100 text-red-700'; }
            else if (item.status === 'CHANGE_DETECTED' || item.status === 'VERIFICATION_PENDING' || item.status === 'DUPLICATE_RISK') { priority = 'HIGH'; pColor = 'bg-orange-100 text-orange-700'; }
            else if (item.status === 'NEW') { priority = 'NORMAL'; pColor = 'bg-emerald-100 text-emerald-700'; }

            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase ${pColor}`}>
                      {priority} PRIORITY
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.status === 'NEW' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'CHANGE_DETECTED' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'DUPLICATE_RISK' ? 'bg-amber-100 text-amber-700' :
                      item.status === 'VERIFICATION_PENDING' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
"""

content = re.sub(
    r'const payload = item\.normalized_payload \|\| \{\};\s*const sourceMeta = item\.ingestion_sources;\s*return \(\s*<div key=\{item\.id\}.*?>\s*<div.*?>\s*<div.*?>\s*<span.*?>\s*\{item\.status[^}]*\}\s*</span',
    new_ui,
    content,
    flags=re.DOTALL
)

with open("src/app/admin/studio/ingestion/queue/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
