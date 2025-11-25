import type { Metadata } from 'next';
import ExperienceContent from './ExperienceContent';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Experience',
  description:
    'Experience KEYVILLE in three simple moves with a clear quest flow, scaffolds, audio support, and badges ready for 6th graders.',
  openGraph: {
    title: 'Experience the KEYVILLE quest flow',
    description: 'See how kids pick a quest, write, get hints, and celebrate wins with calm scaffolds and read aloud.'
  }
};

export default function ExperiencePage() {
  return <ExperienceContent />;
}
