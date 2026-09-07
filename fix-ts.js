const fs = require('fs');
let content = fs.readFileSync('src/app/jobs/[id]/page.tsx', 'utf-8');
content = content.replace('<ShareButtons title={job.title} url={`https://assamjobs.in/jobs/${job.id}`} />', '<ShareButtons title={job.title} />');
content = content.replace('<AdBanner />', '<AdBanner dataAdSlot="1234567890" />');
fs.writeFileSync('src/app/jobs/[id]/page.tsx', content);
