import os

file_path = "src/app/layout.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_meta = """export const metadata: Metadata = {
  title: {
    template: '%s | AssamJobs Hub',
    default: 'AssamJobs Hub - Government & Private Jobs in Assam',
  },
  description: 'Find the latest Government and Private Jobs in Assam, mock tests, previous year papers, and study materials for ADRE, APSC, and Assam Police.',
};"""

new_meta = """export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com'),
  title: {
    template: '%s | AssamJobs Hub',
    default: 'AssamJobs Hub - Government & Private Jobs in Assam',
  },
  description: 'Find the latest Government and Private Jobs in Assam, mock tests, previous year papers, and study materials for ADRE, APSC, and Assam Police.',
  openGraph: {
    title: 'AssamJobs Hub - Government & Private Jobs in Assam',
    description: 'Find the latest Government and Private Jobs in Assam, mock tests, previous year papers, and study materials for ADRE, APSC, and Assam Police.',
    url: '/',
    siteName: 'AssamJobs Hub',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AssamJobs Hub',
    description: 'Find the latest Government and Private Jobs in Assam, mock tests, previous year papers, and study materials.',
  },
};"""

content = content.replace(old_meta, new_meta)
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
