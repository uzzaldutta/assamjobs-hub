const fs = require('fs');

let jobAssam = fs.readFileSync('src/lib/ingestion/adapters/JobAssamAdapter.ts', 'utf8');
jobAssam = jobAssam.replace(/Name of Organization:.*?\//g, "Name of Organization:\\s*([^\\n]+)/");
jobAssam = jobAssam.replace(/Organization Name:.*?\//g, "Organization Name:\\s*([^\\n]+)/");
jobAssam = jobAssam.replace(/Last Date:.*?\//g, "Last Date:\\s*([^\\n]+)/");
jobAssam = jobAssam.replace(/Total Vacancy:.*?\//g, "Total Vacancy:\\s*(\\d+)/");
jobAssam = jobAssam.replace(/No of Posts:.*?\//g, "No of Posts:\\s*(\\d+)/");

fs.writeFileSync('src/lib/ingestion/adapters/JobAssamAdapter.ts', jobAssam);
