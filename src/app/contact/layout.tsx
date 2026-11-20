import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Editorial Desk | AssamJobsHub',
  description: 'Get in touch with the AssamJobsHub editorial team for support, corrections, or recruitment notification inquiries.',
  alternates: { canonical: 'https://assamjobshub.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
