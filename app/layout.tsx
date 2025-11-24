import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { siteMetadata } from '../lib/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: siteMetadata.openGraph,
  twitter: siteMetadata.twitter,
  metadataBase: new URL('https://keyville.app')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NavBar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
