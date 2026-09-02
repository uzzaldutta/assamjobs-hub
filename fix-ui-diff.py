import re

with open("src/app/admin/studio/ingestion/queue/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

diff_ui = """
              {item.status === 'CHANGE_DETECTED' && item.change_diff && item.change_diff.length > 0 && (
                <div className="mt-4 border border-amber-200 bg-amber-50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3"><AlertTriangle size={16}/> Changes Detected vs Canonical Record</h4>
                  <div className="space-y-2">
                    {item.change_diff.map((diff: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-3 gap-2 text-sm bg-white p-2 rounded border border-amber-100">
                        <div className="font-bold text-slate-700 capitalize">{diff.field.replace('_', ' ')}</div>
                        <div className="text-red-600 line-through truncate" title={diff.old_value}>{diff.old_value || 'None'}</div>
                        <div className="text-emerald-600 font-bold truncate" title={diff.new_value}>{diff.new_value || 'None'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
"""

content = content.replace("              <div className=\"flex items-center gap-4 text-sm font-medium\">", diff_ui + "\n              <div className=\"flex items-center gap-4 text-sm font-medium\">")

with open("src/app/admin/studio/ingestion/queue/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
