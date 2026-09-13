const fs = require('fs');

function fixScholarshipsDetail() {
    const filePath = 'src/app/scholarships/[id]/page.tsx';
    if (!fs.existsSync(filePath)) {
        console.log("File does not exist:", filePath);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    
    const tableName = 'scholarships';
    
    // Fix generateMetadata
    const metaFind = `const { data: record } = await supabase.from('${tableName}').select('*').eq('id', params.id).single();`;
    const metaReplace = `let { data: record } = await supabase.from('${tableName}').select('*').eq('id', params.id).single();
  if (!record) {
    const { data: jobRecord } = await supabase.from('jobs').select('*').eq('id', params.id).single();
    if (jobRecord) record = { ...jobRecord };
  }`;
    if (content.includes(metaFind)) {
        content = content.replace(metaFind, metaReplace);
    }
  
    // Fix UpdateDetails
    const queryFind = `const { data: record, error } = await supabase
    .from('${tableName}')
    .select('*')
    .eq('id', id)
    .single();`;
  
    const queryReplace = `let { data: record, error } = await supabase
    .from('${tableName}')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !record) {
    const { data: jobRecord, error: jobError } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (!jobError && jobRecord) {
      record = { ...jobRecord };
      error = null;
    }
  }`;
    if (content.includes(queryFind)) {
        content = content.replace(queryFind, queryReplace);
    }

    // Fix application_deadline to fallback to last_date
    const deadlineFind = `const end = new Date(record.application_deadline);`;
    const deadlineReplace = `const end = new Date(record.application_deadline || record.last_date);`;
    if (content.includes(deadlineFind)) {
        content = content.replace(deadlineFind, deadlineReplace);
    }
  
    fs.writeFileSync(filePath, content);
    console.log("Fixed detail page.");
}
fixScholarshipsDetail();
