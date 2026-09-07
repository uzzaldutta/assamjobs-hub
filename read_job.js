const fs = require('fs');
if (fs.existsSync('src/app/jobs/[id]/page.tsx')) {
    console.log(fs.readFileSync('src/app/jobs/[id]/page.tsx', 'utf8').substring(0, 1000));
} else {
    console.log('File not found');
}
