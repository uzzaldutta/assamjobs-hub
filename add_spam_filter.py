import os

routes = [
    'src/app/page.tsx',
    'src/app/govt-jobs/page.tsx',
    'src/app/private-jobs/page.tsx',
    'src/app/tenders/page.tsx'
]

exclusion_logic = """
  // Filter out non-job spam/promotional posts scraped by accident
  const spamKeywords = ["bio-data maker", "scheme", "merit award", "scholarship", "whatsapp group", "telegram", "join our"];
  __VAR__ = __VAR__.filter(job => {
    if (!job.title) return false;
    const lowerTitle = job.title.toLowerCase();
    return !spamKeywords.some(keyword => lowerTitle.includes(keyword));
  });
"""

for filepath in routes:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    var_name = 'jobs' if 'govt-jobs' in filepath or 'private-jobs' in filepath else ('allTenders' if 'tenders' in filepath else 'allJobs')
    
    custom_logic = exclusion_logic.replace('__VAR__', var_name)
    
    if 'spamKeywords' not in content:
        # Insert right after the deduplication block (seenHashes.add)
        target_str = 'seenHashes.add(hash);\n    return true;\n  });'
        if target_str in content:
            content = content.replace(target_str, target_str + '\n' + custom_logic)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        else:
            # Fallback: find "return (" and insert before it
            return_idx = content.find('  return (')
            if return_idx != -1:
                content = content[:return_idx] + custom_logic + '\n' + content[return_idx:]
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
