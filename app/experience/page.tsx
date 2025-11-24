import type { Metadata } from 'next';
import ExperienceSandbox from './ExperienceSandbox';
import { buildMetadata } from '../../lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Keyville | Experience Sandbox',
  description: 'Play a room-rotation micro-challenge, view AI feedback, and see telemetry without creating an account.',
  path: '/experience'
});

export default function ExperiencePage() {
  return (
    <div>
      <h1>Experience Keyville in 3 steps</h1>
      <p className="small">No login required. Use your keyboard to tab through each element; controls are screen-reader ready.</p>
      <ExperienceSandbox />
    </div>
  );
}
