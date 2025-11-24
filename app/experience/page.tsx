import type { Metadata } from 'next';
import ExperienceSandbox from './ExperienceSandbox';
import { brand } from '../../lib/navigation';

export const metadata: Metadata = {
  title: `${brand.appName} — project by ${brand.organization} | Experience Sandbox`,
  description: 'Play a room-rotation micro-challenge, view AI feedback, and see telemetry without creating an account.',
  openGraph: {
    title: `Experience the ${brand.appName} sandbox`,
    description: 'Try a guided micro-challenge with AI feedback and telemetry snapshots in under 90 seconds.'
  }
};

export default function ExperiencePage() {
  return (
    <div>
      <h1>Experience {brand.appName} in 3 steps</h1>
      <p className="small">No login required. Use your keyboard to tab through each element; controls are screen-reader ready.</p>
      <ExperienceSandbox />
    </div>
  );
}
