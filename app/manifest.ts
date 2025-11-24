import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KEYVILLE — project by ETL GIS Consulting LLC',
    short_name: 'KEYVILLE',
    description:
      'Writing growth through playful practice, delivered as a project by ETL GIS Consulting LLC with privacy-first, classroom-ready workflows.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#111827',
    id: '/',
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml'
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml'
      }
    ]
  };
}
