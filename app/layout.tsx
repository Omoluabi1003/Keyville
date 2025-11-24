import type { Metadata } from 'next';
import './globals.css';
import { Baloo_2 } from 'next/font/google';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InstallPrompt from '../components/InstallPrompt';
import { brand, siteMetadata } from '../lib/navigation';

const baloo = Baloo_2({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: siteMetadata.openGraph,
  twitter: siteMetadata.twitter,
  applicationName: brand.byline,
  manifest: '/manifest.webmanifest',
  metadataBase: new URL('https://etl-gis.com'),
  themeColor: '#111827'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={baloo.className}>
      <body>
        <NavBar />
        <InstallPrompt />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
