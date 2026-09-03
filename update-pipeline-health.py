import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

replacement = """
    } catch (runErr: any) {
      console.error(`Source ${source.source_name} failed:`, runErr);
      if (runRecord) {
        const isStructureChange = runErr.message.includes("STRUCTURE_CHANGED");
        await supabase.from('ingestion_runs').update({
          status: isStructureChange ? 'STRUCTURE_CHANGED' : 'FAILED',
          finished_at: new Date().toISOString(),
          run_log: runErr.message,
          items_discovered: itemsDiscovered
        }).eq('id', runRecord.id);
      }
    }

    // Evaluate Source Health
    try {
      const { data: finalRun } = await supabase.from('ingestion_runs').select('status, run_log').eq('id', runRecord?.id).single();
      const finalStatus = finalRun?.status || 'FAILED';
      
      let newHealth = 'HEALTHY';
      // @ts-ignore
      let consecutiveFailures = source.consecutive_failures || 0;
      
      if (finalStatus === 'SUCCESS') {
         consecutiveFailures = 0;
         if (itemsExtracted > 0 && itemsMissingLink > itemsExtracted * 0.5) {
            newHealth = 'WARNING'; // High missing links
         } else if (itemsExtracted > 0 && itemsInvalidLink > itemsExtracted * 0.5) {
            newHealth = 'WARNING'; // High invalid links
         }
      } else {
         consecutiveFailures++;
         if (consecutiveFailures >= 3) {
            newHealth = 'OFFLINE';
         } else {
            newHealth = 'FAILING';
         }
      }
      
      if (source.is_active === false) {
         newHealth = 'DISABLED';
      }

      const sourceUpdates: any = {
        current_health: newHealth,
        consecutive_failures: consecutiveFailures,
        updated_at: new Date().toISOString()
      };
      
      if (finalStatus === 'SUCCESS') {
         sourceUpdates.last_successful_run = new Date().toISOString();
         sourceUpdates.last_error = null;
      } else {
         sourceUpdates.last_failed_run = new Date().toISOString();
         sourceUpdates.last_error = finalRun?.run_log || 'Unknown error';
      }

      await supabase.from('ingestion_sources').update(sourceUpdates).eq('id', source.id);
    } catch (healthErr) {
       console.error("Failed to update source health", healthErr);
    }

  }
"""

content = re.sub(
    r'\} catch \(runErr: any\) \{[\s\S]*?\.eq\(\'id\', runRecord\.id\);\s*\}\s*\}\s*\}',
    replacement + "\n}",
    content
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
