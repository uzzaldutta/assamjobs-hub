import os

routes = [
    'src/app/admit-cards/page.tsx',
    'src/app/results/page.tsx',
    'src/app/study-materials/page.tsx',
    'src/app/syllabus/page.tsx'
]

dedupe_logic = """
  // Deduplicate array (keeps the first occurrence based on Title + Organization)
  const seenHashes = new Set();
  allAdmitCards = allAdmitCards.filter(job => {
    const hash = `${job.title}_${job.organization}`.toLowerCase().replace(/\s+/g, '');
    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  });
"""

for filepath in routes:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    var_name = 'allAdmitCards' if 'admit-cards' in filepath else ('allResults' if 'results' in filepath else ('allMaterials' if 'study-materials' in filepath else 'allSyllabus'))
    
    # Replace variable name in logic
    custom_logic = dedupe_logic.replace('allAdmitCards', var_name)
    
    # Insert right before return (
    if 'return (' in content and 'seenHashes' not in content:
        content = content.replace('  return (', custom_logic + '\n  return (')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
# Also do tenders
tenders_path = 'src/app/tenders/page.tsx'
if os.path.exists(tenders_path):
    with open(tenders_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'seenHashes' not in content:
        custom_logic = dedupe_logic.replace('allAdmitCards', 'allTenders')
        content = content.replace('  return (', custom_logic + '\n  return (')
        with open(tenders_path, 'w', encoding='utf-8') as f:
            f.write(content)
