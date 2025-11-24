import type { Metadata } from 'next';

const baseUrl = 'https://keyville.app';

export function buildMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const absoluteUrl = new URL(path, baseUrl).toString();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: 'Keyville',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    metadataBase: new URL(baseUrl)
  };
}
