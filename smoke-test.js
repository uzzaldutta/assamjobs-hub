const http = require('http');

const routes = [
  '/',
  '/jobs',
  '/govt-jobs',
  '/private-jobs',
  '/updates',
  '/exams',
  '/search?q=Assam'
];

async function test() {
  let passed = true;
  for (const route of routes) {
    await new Promise(resolve => {
      http.get(`http://localhost:9000${route}`, (res) => {
        console.log(`Route ${route}: ${res.statusCode}`);
        if (res.statusCode !== 200) passed = false;
        res.resume();
        resolve();
      }).on('error', (e) => {
        console.log(`Route ${route}: Failed to connect - ${e.message}`);
        passed = false;
        resolve();
      });
    });
  }
  console.log(`Smoke test ${passed ? 'PASSED' : 'FAILED'}`);
}
test();

