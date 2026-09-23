const fs = require('fs');

function patchFile(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (c.includes('`/jobs/${job.id}`')) {
    c = c.replace(/`\/jobs\/\$\{job\.id\}`/g, '`/jobs/${job.slug || job.id}`');
    changed = true;
  }
  
  if (c.includes('`/jobs/${item.id}`')) {
    c = c.replace(/`\/jobs\/\$\{item\.id\}`/g, '`/jobs/${item.slug || item.id}`');
    changed = true;
  }
  
  if (c.includes('`/jobs/${j.id}`')) {
    c = c.replace(/`\/jobs\/\$\{j\.id\}`/g, '`/jobs/${j.slug || j.id}`');
    changed = true;
  }

  if (c.includes('`/jobs/${a.id}`')) {
    c = c.replace(/`\/jobs\/\$\{a\.id\}`/g, '`/jobs/${a.slug || a.id}`');
    changed = true;
  }

  // Check if they need 'slug' added to the supabase .select() query!
  if (c.includes(".select('") && !c.includes("slug")) {
    // This is tricky, let's just append slug if id is selected
    if (c.includes('id, ') || c.includes('id,')) {
      c = c.replace(/id, /g, 'id, slug, ');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, c);
    console.log(`Patched links in ${file}`);
  }
}

const files = [
  'src/app/page.tsx',
  'src/app/jobs/page.tsx',
  'src/components/ClassicUpdatesBoard.tsx',
  'src/components/JobCard.tsx',
  'src/components/LatestUpdatesScroller.tsx',
  'src/components/ScrollableJobFeed.tsx',
  'src/components/FeedList.tsx',
  'src/app/updates/page.tsx',
  'src/app/search/SearchClient.tsx'
];

files.forEach(patchFile);
