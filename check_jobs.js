const https = require('https');
https.get('https://assamjobshub.com/jobs', (resp) => {
  console.log("Status Code /jobs:", resp.statusCode);
}).on("error", (err) => { console.log("Error: " + err.message); });
