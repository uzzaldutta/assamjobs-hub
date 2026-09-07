const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const keys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'CRON_SECRET',
  'NEXT_PUBLIC_SITE_URL'
];
keys.forEach(k => {
  console.log(`${k}: ${env.includes(k + '=') ? 'PRESENT' : 'MISSING'}`);
});
