const { spawn } = require('child_process');
const path = require('path');

function runScraper(scriptName) {
  return new Promise((resolve) => {
    console.log(`\n[SCHEDULER] Starting ${scriptName}...`);
    const process = spawn('python', [path.join(__dirname, scriptName)], {
      stdio: 'inherit',
      env: { ...process.env }
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.error(`[SCHEDULER] ${scriptName} failed with exit code ${code}`);
        resolve(false);
      } else {
        console.log(`[SCHEDULER] ${scriptName} completed successfully.`);
        resolve(true);
      }
    });
  });
}

async function runPipeline() {
  console.log("=== STARTING FULL EXTRACTION PIPELINE ===");
  
  await runScraper('assamcareer_scraper.py');
  await runScraper('assamtenders_scraper.py');
  await runScraper('jobassam_scraper.py');
  await runScraper('indeed_scraper.py');

  console.log("=== EXTRACTION PIPELINE COMPLETE ===");
}

runPipeline();
