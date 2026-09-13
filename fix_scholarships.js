const fs = require('fs');

function fixScholarshipsPage() {
    let content = fs.readFileSync('src/app/scholarships/page.tsx', 'utf8');
    
    // Replace table and filters
    const queryFind = `let queryBuilder = supabase
    .from('scholarships')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED');`;
    
    const queryReplace = `let queryBuilder = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .or('job_type.eq.SCHOLARSHIP,title.ilike.%scholarship%,title.ilike.%scheme%');`;
    
    content = content.replace(queryFind, queryReplace);
    
    // Replace application_deadline and created_at
    content = content.replace(/application_deadline/g, 'last_date');
    content = content.replace(/created_at/g, 'scraped_at');
    
    fs.writeFileSync('src/app/scholarships/page.tsx', content);
    console.log("Updated scholarships/page.tsx");
}

fixScholarshipsPage();
