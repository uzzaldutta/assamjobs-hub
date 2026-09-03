const https = require('https');

https.get('https://apsc.nic.in', (res) => {
  console.log('APSC STATUS:', res.statusCode);
}).on('error', (e) => {
  console.error('APSC ERROR:', e.message);
});

https.get('https://jobassam.in', (res) => {
  console.log('JobAssam STATUS:', res.statusCode);
}).on('error', (e) => {
  console.error('JobAssam ERROR:', e.message);
});
