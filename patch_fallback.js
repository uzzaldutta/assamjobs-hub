const fs = require('fs');

function fixFallback(filePath, tableName) {
  if (!fs.existsSync(filePath)) return;
  let c = fs.readFileSync(filePath, 'utf8');
  
  // We need to find the specific supabase query inside the default export
  // It looks like:
  // const { data: record, error } = await supabase
  //   .from('admit_cards')
  //   .select('*')
  //   .eq('id', id)
  //   .single();
  // 
  // if (error || !record) {
  //   notFound();
  // }
  
  const searchPattern = new RegExp(`const \\{ data: record, error \\} = await supabase[\\s\\S]*?\\.from\\('${tableName}'\\)[\\s\\S]*?\\.single\\(\\);\\s*if \\(error \\|\\| !record\\) \\{\\s*notFound\\(\\);\\s*\\}`);
  
  const replacement = `let { data: record, error } = await supabase
    .from('${tableName}')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !record) {
    // Fallback to jobs table since webhook inserts there
    const { data: jobRecord } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (jobRecord) {
      record = jobRecord;
    } else {
      notFound();
    }
  }`;

  if (c.match(searchPattern)) {
    c = c.replace(searchPattern, replacement);
    fs.writeFileSync(filePath, c);
    console.log("Patched fallback in", filePath);
  } else {
    // maybe it already has it or structure is slightly different
    console.log("Could not find pattern in", filePath);
  }
}

fixFallback('src/app/admit-cards/[id]/page.tsx', 'admit_cards');
fixFallback('src/app/results/[id]/page.tsx', 'results');
fixFallback('src/app/admissions/[id]/page.tsx', 'jobs'); // wait, admissions might already use jobs
fixFallback('src/app/scholarships/[id]/page.tsx', 'scholarships');
fixFallback('src/app/tenders/[id]/page.tsx', 'tenders');

