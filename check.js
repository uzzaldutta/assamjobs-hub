const https = require('https');
https.get('https://assamjobshub.com/sitemap.xml', (res) => {
  console.log('Status Code:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
