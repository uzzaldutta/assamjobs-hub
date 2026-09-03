code = """

export async function retrySourceAction(sourceId: string, adapterName: string) {
  // We cannot directly invoke the Pipeline from the browser/actions if it imports server-only modules 
  // without careful setup, but for the sake of the Admin UI action we can dispatch an API call or logic here.
  // We'll simulate the call. In a real environment, this triggers a queue or Edge function.
  try {
     // A secure approach is calling an internal API route that executes the pipeline securely
     const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/run-ingestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, adapterName })
     });
     if (!res.ok) throw new Error('API failed');
  } catch (err) {
     console.error("Retry failed", err);
  }
}
"""
with open("src/app/admin/studio/ingestion/actions.ts", "a", encoding="utf-8") as f:
    f.write(code)
