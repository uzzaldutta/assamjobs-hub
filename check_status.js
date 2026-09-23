const https = require('https');
https.get('https://assamjobshub.com', (resp) => {
  console.log("Status Code:", resp.statusCode);
}).on("error", (err) => { console.log("Error: " + err.message); });
