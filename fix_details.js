const fs = require('fs');

function fixFile(filePath, isResult) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const tableName = isResult ? 'results' : 'admit_cards';
  const dateField = isResult ? 'result_date' : 'exam_date';
  
  // Fix generateMetadata
  const metaFind = `const { data: record } = await supabase.from('${tableName}').select('*').eq('id', params.id).single();`;
  const metaReplace = `let { data: record } = await supabase.from('${tableName}').select('*').eq('id', params.id).single();
  if (!record) {
    const { data: jobRecord } = await supabase.from('jobs').select('*').eq('id', params.id).single();
    if (jobRecord) record = { ...jobRecord, ${dateField}: jobRecord.last_date };
  }`;
  content = content.replace(metaFind, metaReplace);
  
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
      record = { ...jobRecord, ${dateField}: jobRecord.last_date };
      error = null;
    }
  }`;
  content = content.replace(queryFind, queryReplace);
  
  fs.writeFileSync(filePath, content);
}

fixFile('src/app/admit-cards/[id]/page.tsx', false);
fixFile('src/app/results/[id]/page.tsx', true);
console.log("Fixed!");
