import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the header block
start_tag = '<header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between">'
end_tag = '</header>'

start_idx = content.find(start_tag)
end_idx = content.find(end_tag, start_idx) + len(end_tag)

if start_idx != -1 and end_idx != -1:
    header_content = content[start_idx:end_idx]
    
    # We will replace it with our 2-tier design. We just need to extract the nav links to preserve them.
    # Extract nav links from <Link href="/"> to <a href="https://play.google.com...
    nav_start = header_content.find('<nav')
    nav_end = header_content.find('</nav>') + len('</nav>')
    nav_block = header_content[nav_start:nav_end]
    
    # modify nav block wrapper to look clean
    nav_block = nav_block.replace(
        'className="hidden lg:flex items-center p-1.5 bg-emerald-50/80 dark:bg-emerald-900/40 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-700/50 rounded-2xl shadow-sm"',
        'className="flex items-center p-1.5 bg-emerald-50/50 dark:bg-emerald-900/20 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/30 rounded-2xl shadow-sm w-full max-w-5xl justify-between mx-auto"'
    )
    
    new_header = f'''<header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl transition-all duration-300">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                  
                  {{/* Top Tier: Logo & Tools */}}
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/50 lg:border-none">
                    <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                      <img src="/logo.jpg?v=4" alt="AssamJobs Hub Logo" className="h-10 md:h-12 w-auto object-contain rounded-lg" />
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      <LanguageToggle />
                      <ThemeToggle />
                      <MobileMenu className="lg:hidden" />
                    </div>
                  </div>

                  {{/* Bottom Tier: Centered Desktop Navigation */}}
                  <div className="hidden lg:flex justify-center pb-3 pt-1 w-full">
                    {nav_block}
                  </div>
                </div>
              </header>'''

    new_content = content[:start_idx] + new_header + content[end_idx:]
    
    with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Header restructured successfully.")
else:
    print("Could not find header boundaries.")
