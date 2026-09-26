const fs = require('fs');
let env = fs.readFileSync('.env.local', 'utf8');
let match = env.match(/CRON_SECRET=(.*)/);
let secret = match ? match[1].trim() : 'dev-secret';

console.log("Using secret:", secret.substring(0,4) + '...');

const https = require('https');
const options = {
  hostname: 'assamjobs-hub.vercel.app',
  path: '/api/cron/ingestion',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + secret
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log("Response:", res.statusCode, data); });
});
req.on('error', (e) => { console.error(e); });
req.end();
