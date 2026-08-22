const { spawn } = require('child_process');
const path = require('path');

if (!process.env.GEMINI_API_KEY || !process.env.API_BASE_URL) {
  console.error("\n[CRITICAL ERROR] The GitHub Action is missing the required Secrets! (GEMINI_API_KEY or API_BASE_URL)");
  console.error("Please add these keys to your GitHub Repository Settings -> Secrets and Variables -> Actions.");
  process.exit(1);
}

function runScraper(scriptName) {
  return new Promise((resolve) => {
    console.log(`\n[SCHEDULER] Starting ${scriptName}...`);
    const childProcess = spawn(process.platform === 'win32' ? 'python' : 'python3', [path.join(__dirname, scriptName)], {
      stdio: 'inherit',
      env: { ...process.env }
    });

    childProcess.on('error', (err) => {
      console.error(`[SCHEDULER ERROR] Failed to start ${scriptName}:`, err);
      resolve(false);
    });

    childProcess.on('close', (code) => {
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
  await runScraper('assamcareer_private_scraper.py');
  await runScraper('assamtenders_dotcom_scraper.py');
  await runScraper('jobassam_scraper.py');
  await runScraper('govtjobguru_scraper.py');
  await runScraper('indeed_scraper.py');
  await runScraper('admissions_scraper.py');

  console.log("=== EXTRACTION PIPELINE COMPLETE ===");
}

runPipeline();
