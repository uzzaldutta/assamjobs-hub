const fs = require('fs');
const path = require('path');

const srcRoot = 'G:/assamjobs-hub_Oct24';
const dstRoot = 'E:/Uzzal/App Development/assamjobs-hub';

const files = [
  'src/components/UnifiedJobMatrix.tsx',
  'src/components/HeroSection.tsx',
  'src/components/CategoryGrid.tsx',
  'src/components/GoogleAnalytics.tsx',
  'src/lib/jobClassifier.ts',
  'src/lib/ingestion/pipeline.ts',
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/admin/studio/ingestion/actions.ts',
  'scripts/create-desktop-zip.ps1',
  'scripts/reclassify-private-jobs.ts',
  'scripts/run-auto-feed-silent.vbs',
  'scripts/run-auto-feed.bat',
  '.env.local'
];

for (const rel of files) {
  const src = path.join(srcRoot, rel);
  const dst = path.join(dstRoot, rel);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log(`Synced to E: ${rel}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
}
console.log('Sync complete.');
