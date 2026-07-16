import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'trends-sampler',
  description: 'Qualitative observations about AI-related discourse, based on a small sample of curated Reddit posts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
