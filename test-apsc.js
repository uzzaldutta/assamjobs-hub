process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');

https.get('https://apsc.nic.in', (res) => {
  console.log('APSC STATUS:', res.statusCode);
}).on('error', (e) => {
  console.error('APSC ERROR:', e.message);
});
