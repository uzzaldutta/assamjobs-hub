const fs = require('fs');
const content = fs.readFileSync('vercel.json', 'utf8');
try {
  JSON.parse(content);
  console.log("Valid JSON (Node)");
} catch (e) {
  console.log("Invalid JSON:", e.message);
}
