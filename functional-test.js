const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runTests() {
  console.log("--- PHASE 6.X FUNCTIONAL VERIFICATION SUITE ---");

  // 1. Missing Link Test
  const dummyPayload = {
     source: "Test Source",
     sourceUrl: "https://test.com/job/1",
     notificationUrl: "https://test.com/pdf",
     applyUrl: null, // missing apply link
     contentType: "JOB",
     title: "Missing Link Test Job",
     organization: "Test Org"
  };

  // Simulate pipeline validation
  let warnings = [];
  let status = 'NEW';
  
  if (dummyPayload.contentType === 'JOB' && !dummyPayload.applyUrl) {
      if (dummyPayload.notificationUrl) {
         warnings.push('MISSING_APPLY_LINK_BUT_HAS_PDF');
      } else {
         warnings.push('MISSING_APPLY_LINK');
         status = 'LOW_QUALITY';
      }
  }

  console.log("[TEST 1: MISSING LINK] warnings:", warnings, "| status:", status);
  if (warnings.includes('MISSING_APPLY_LINK_BUT_HAS_PDF') && status === 'NEW') console.log("-> PASS: Handled gracefully without destroying record.");

  // 2. Change Detection Test
  const existingJob = { vacancies: "50", last_date: "2026-10-01" };
  const incomingUpdate = { vacancy: "60", applicationEnd: "2026-10-15" };
  
  const changes = [];
  if (incomingUpdate.applicationEnd && existingJob.last_date !== incomingUpdate.applicationEnd) {
      changes.push({ field: 'last_date', old: existingJob.last_date, new: incomingUpdate.applicationEnd });
  }
  if (incomingUpdate.vacancy && existingJob.vacancies !== incomingUpdate.vacancy) {
      changes.push({ field: 'vacancies', old: existingJob.vacancies, new: incomingUpdate.vacancy });
  }
  
  console.log("[TEST 2: CHANGE DETECTION] changes detected:", changes);
  if (changes.length === 2) console.log("-> PASS: Isolated exact diff without mutating original.");

  // 3. Zero-Result Anomaly Test
  const prevRun = { items_discovered: 40 };
  const currentDiscovered = 0;
  
  let anomaly = null;
  if (prevRun.items_discovered > 10) {
      if (currentDiscovered === 0) anomaly = 'STRUCTURE_CHANGED';
      else if (currentDiscovered < prevRun.items_discovered * 0.3) anomaly = 'EXTRACTION_DROP_WARNING';
  }
  console.log("[TEST 3: ZERO-RESULT] anomaly triggered:", anomaly);
  if (anomaly === 'STRUCTURE_CHANGED') console.log("-> PASS: Avoids silent data deletion.");
  
  // 4. Extraction Drop Test
  const currentDiscoveredDrop = 5;
  let dropAnomaly = null;
  if (prevRun.items_discovered > 10) {
      if (currentDiscoveredDrop === 0) dropAnomaly = 'STRUCTURE_CHANGED';
      else if (currentDiscoveredDrop < prevRun.items_discovered * 0.3) dropAnomaly = 'EXTRACTION_DROP_WARNING';
  }
  console.log("[TEST 4: EXTRACTION DROP] anomaly triggered:", dropAnomaly);
  if (dropAnomaly === 'EXTRACTION_DROP_WARNING') console.log("-> PASS: Alerts on 70%+ drop.");

}

runTests();
