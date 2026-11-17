const cron = require('node-cron');
const dns = require('dns');

// Prioritize IPv4 DNS to avoid router IPv6 timeouts
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const LOCAL_PORT = process.env.PORT || 3001;
const CRON_SECRET = process.env.CRON_SECRET || 'assamhub_cron_2026';

console.log('====================================================');
console.log('  ASSAMJOBSHUB — FULLY AUTOMATIC BACKGROUND CRON    ');
console.log('====================================================');
console.log('Status: ACTIVE');
console.log('Schedule: Every 1 hour (Continuous Autonomous Extraction)');
console.log('Target: Jobs, Admissions, Results, Admit Cards & Scholarships');
console.log('----------------------------------------------------');

async function triggerIngestion() {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`\n[${timestamp}] Initiating automated feed extraction...`);

  // Try localhost first, fall back to production if local server is not listening
  const localUrl = `http://localhost:${LOCAL_PORT}/api/cron/ingestion?token=${CRON_SECRET}`;
  const prodUrl = `https://assamjobshub.com/api/cron/ingestion?token=${CRON_SECRET}`;

  let targetUrl = localUrl;
  let useProd = false;

  try {
    const probe = await fetch(`http://localhost:${LOCAL_PORT}/`, { signal: AbortSignal.timeout(3000) });
    if (!probe.ok && probe.status !== 404) useProd = true;
  } catch (e) {
    useProd = true;
  }

  if (useProd) {
    targetUrl = prodUrl;
    console.log(`[Auto-Cron] Localhost:${LOCAL_PORT} not responding, using Production: ${prodUrl}`);
  } else {
    console.log(`[Auto-Cron] Running via Local Server: ${localUrl}`);
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'AssamJobsHub-LocalDaemon/1.0' },
      signal: AbortSignal.timeout(180000) // 3 min timeout
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✓ [Auto-Cron Success] Extraction completed successfully at ${new Date().toLocaleTimeString('en-IN')}:`, data);
    } else {
      console.warn(`✗ [Auto-Cron Warning] Server returned HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (err) {
    console.error(`✗ [Auto-Cron Error] Failed to execute automated ingestion:`, err.message);
  }
}

// 1. Trigger an immediate extraction on launch
triggerIngestion();

// 2. Schedule automatic continuous extraction every 1 hour (at minute 0 of every hour)
cron.schedule('0 * * * *', () => {
  triggerIngestion();
});

console.log('\nDaemon is running in the background. Press Ctrl+C to stop.');
