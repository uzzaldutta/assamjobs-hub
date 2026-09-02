with open("src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Update metadata if it exists
old_metadata = """export const metadata: Metadata = {
  title: "AssamJobs Hub - Government & Private Jobs in Assam",
  description: "Find the latest Government and Private Jobs in Assam, mock tests, previous year papers, and study materials.",
};"""

new_metadata = """export const metadata: Metadata = {
  title: {
    template: '%s | AssamJobs Hub',
    default: 'AssamJobs Hub - Government & Private Jobs in Assam',
  },
  description: 'Find the latest Government and Private Jobs in Assam, mock tests, previous year papers, and study materials for ADRE, APSC, and Assam Police.',
  openGraph: {
    title: 'AssamJobs Hub',
    description: 'The Ultimate Platform for Assam Govt Jobs and Mock Tests',
    url: 'https://assamjobs-hub.vercel.app',
    siteName: 'AssamJobs Hub',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AssamJobs Hub - Jobs & Mock Tests',
    description: 'Find the latest Government and Private Jobs in Assam, plus free Mock Tests.',
  },
};"""

if old_metadata in content:
    content = content.replace(old_metadata, new_metadata)
else:
    # try replacing just the export const metadata block
    import re
    content = re.sub(
        r'export const metadata: Metadata = \{.*?\};', 
        new_metadata, 
        content, 
        flags=re.DOTALL
    )

with open("src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
