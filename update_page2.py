import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the component injection to pass recentItems and closingSoonItems
scroller_pattern = r'<LatestUpdatesScroller recentJobs=\{govtJobs \|\| \[\]\} closingSoonJobs=\{closingSoonJobs \|\| \[\]\} />'
content = re.sub(scroller_pattern, '<LatestUpdatesScroller recentItems={allRecent} closingSoonItems={allClosing} />', content)

if "import { FeedItem }" not in content:
    content = content.replace('import LatestUpdatesScroller from "@/components/LatestUpdatesScroller";', 'import LatestUpdatesScroller, { FeedItem } from "@/components/LatestUpdatesScroller";')


fetch_block = """
  // Unified Data Fetching for Latest Updates Scroller
  const today = new Date().toISOString();
  
  // 1. Fetch Recent Items
  const [
    { data: rJobs },
    { data: rTenders },
    { data: rAdmissions },
    { data: rResults },
    { data: rAdmitCards },
    { data: rScholarships }
  ] = await Promise.all([
    supabase.from('jobs').select('id, title, organization, job_type, last_date, created_at, scraped_at').eq('status', 'PUBLISHED').order('scraped_at', { ascending: false }).limit(6),
    supabase.from('tenders').select('id, title, organization, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(3),
    supabase.from('admissions').select('id, title, institution_name, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(3),
    supabase.from('results').select('id, title, organization, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(3),
    supabase.from('admit_cards').select('id, title, organization, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(3),
    supabase.from('scholarships').select('id, title, provider, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(3)
  ]);

  const mapToFeed = (items: any[], type: string, urlPrefix: string, orgField: string = 'organization'): FeedItem[] => {
    if (!items) return [];
    return items.map(item => ({
      id: item.id,
      title: item.title,
      organization: item[orgField] || 'Various Departments',
      badge_text: type === 'JOB' ? (item.job_type || 'GOVERNMENT') : type,
      url: `${urlPrefix}/${item.id}`,
      last_date: item.last_date || null,
      created_at: item.created_at || item.scraped_at
    }));
  };

  const allRecent = [
    ...mapToFeed(rJobs || [], 'JOB', '/jobs'),
    ...mapToFeed(rTenders || [], 'TENDER', '/tenders'),
    ...mapToFeed(rAdmissions || [], 'ADMISSION', '/admissions', 'institution_name'),
    ...mapToFeed(rResults || [], 'RESULT', '/results'),
    ...mapToFeed(rAdmitCards || [], 'ADMIT CARD', '/admit-cards'),
    ...mapToFeed(rScholarships || [], 'SCHOLARSHIP', '/scholarships', 'provider')
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

  // 2. Fetch Closing Soon Items (Future dates)
  const [
    { data: cJobs },
    { data: cTenders },
    { data: cAdmissions },
    { data: cScholarships }
  ] = await Promise.all([
    supabase.from('jobs').select('id, title, organization, job_type, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(6),
    supabase.from('tenders').select('id, title, organization, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(3),
    supabase.from('admissions').select('id, title, institution_name, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(3),
    supabase.from('scholarships').select('id, title, provider, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(3)
  ]);

  const allClosing = [
    ...mapToFeed(cJobs || [], 'JOB', '/jobs'),
    ...mapToFeed(cTenders || [], 'TENDER', '/tenders'),
    ...mapToFeed(cAdmissions || [], 'ADMISSION', '/admissions', 'institution_name'),
    ...mapToFeed(cScholarships || [], 'SCHOLARSHIP', '/scholarships', 'provider')
  ].sort((a, b) => new Date(a.last_date!).getTime() - new Date(b.last_date!).getTime()).slice(0, 10);

  // Fetch Latest Govt Jobs
"""

# Inject before "// Fetch Latest Govt Jobs"
if "// Unified Data Fetching" not in content:
    content = content.replace("  // Fetch Latest Govt Jobs", fetch_block)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated page.tsx correctly")
