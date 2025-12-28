import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GenomeProvider } from '@/components/GenomeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Personal UX Genome',
  description: 'The interface that learns you',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GenomeProvider>
          {children}
        </GenomeProvider>
      </body>
    </html>
  );
}

