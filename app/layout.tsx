import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import PWAProvider from '@/components/providers/PWAProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maritime Document Endorser',
  description: 'Professional document endorsement application for maritime professionals',
  manifest: '/manifest.json',
  themeColor: '#0369A1',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Maritime Endorser" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <PWAProvider>
          {children}
        </PWAProvider>
        <Toaster />
      </body>
    </html>
  );
}