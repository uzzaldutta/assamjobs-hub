const fs = require('fs');

function fixHomePage() {
    let content = fs.readFileSync('src/app/page.tsx', 'utf8');
    
    const target = `supabase.from('scholarships').select('id, title, provider, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10)`;
    const replacement = `supabase.from('jobs').select('id, title, organization, last_date, scraped_at').eq('status', 'PUBLISHED').or('job_type.eq.SCHOLARSHIP,title.ilike.%scholarship%,title.ilike.%scheme%').order('scraped_at', { ascending: false }).limit(10)`;
    
    content = content.replace(target, replacement);
    fs.writeFileSync('src/app/page.tsx', content);
    console.log("Updated page.tsx");
}
fixHomePage();
