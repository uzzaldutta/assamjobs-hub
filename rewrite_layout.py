import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports for DesktopNav and MobileBottomNav
if 'import DesktopNav' not in content:
    content = content.replace('import MobileMenu from "../components/MobileMenu";', 
                             'import MobileMenu from "../components/MobileMenu";\nimport DesktopNav from "../components/DesktopNav";\nimport MobileBottomNav from "../components/MobileBottomNav";')

# 2. Re-write the header section
header_start = content.find('              {/* Header */}')
header_end = content.find('              {/* Main Content Area */}')

new_header = """              {/* Header */}
              <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl transition-all duration-300">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-between items-center h-16 md:h-20">
                  
                  {/* Logo */}
                  <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0 mr-8">
                    <img src="/logo.png?v=5" alt="AssamJobs Hub Logo" className="h-10 md:h-14 w-auto object-contain drop-shadow-sm" />
                  </Link>

                  {/* Desktop Navigation */}
                  <div className="flex-1 hidden lg:flex justify-center">
                    <DesktopNav />
                  </div>
                  
                  {/* Tools & Toggles (Desktop & Mobile) */}
                  <div className="flex items-center gap-4 shrink-0">
                    <button className="hidden lg:flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 w-10 h-10 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block mx-1"></div>
                    <LanguageToggle />
                    <ThemeToggle />
                    
                    {/* Notification Bell (Mobile & Desktop) */}
                    <button className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>

                    {/* Desktop Sign In */}
                    <button className="hidden lg:flex bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-600/20 transition-all text-sm ml-2">
                      Sign In
                    </button>
                    
                    {/* Mobile Hamburger (Now moved to Bottom Nav, but keeping a simplified one for settings fallback if needed, or remove it entirely) */}
                    {/* We are removing MobileMenu component here since we have BottomNav! */}
                  </div>
                </div>
              </header>

"""
content = content[:header_start] + new_header + content[header_end:]

# 3. Add MobileBottomNav before closing body tag
if '<MobileBottomNav />' not in content:
    content = content.replace('      </body>', '        <MobileBottomNav />\n      </body>')
    # Add pb-20 to main container to account for bottom nav on mobile
    content = content.replace('<main className="flex-grow">', '<main className="flex-grow pb-20 lg:pb-0">')

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
