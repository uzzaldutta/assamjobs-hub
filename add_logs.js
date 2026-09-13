const fs = require('fs');
let content = fs.readFileSync('src/lib/ingestion/pipeline.ts', 'utf8');
content = content.replace("await supabase.from('ingestion_queue').insert({", "console.log('Inserting into queue:', normalized.title); const { error: qErr } = await supabase.from('ingestion_queue').insert({");
content = content.replace("validation_warnings: validation.warnings\n          });", "validation_warnings: validation.warnings\n          });\n          if (qErr) console.error('Queue Insert Error:', qErr);");
fs.writeFileSync('src/lib/ingestion/pipeline.ts', content);
console.log("Added logs to pipeline");
