import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';
import { brand } from '../../lib/navigation';

export const metadata: Metadata = {
  title: `${brand.appName} — project by ${brand.organization} | Students`,
  description: 'Student journey with practice loops, accessibility-first controls, and AI nudges that build stamina.'
};

export default function StudentsPage() {
  return (
    <div>
      <h1>{brand.appName} student journey</h1>
      <p className="small">Guided practice loops keep students on-task while reinforcing writing stamina.</p>

      <Section title="Practice loop" subtitle="Three-step writing loop students can finish in under 5 minutes">
        <div className="card-grid">
          <div className="card">
            <h3>Prime</h3>
            <p className="small">Room intro explains the purpose, sample mentor text, and sentence stems.</p>
          </div>
          <div className="card">
            <h3>Write</h3>
            <p className="small">Timer-free focus mode with ARIA labels and clear tab order for all controls.</p>
          </div>
          <div className="card">
            <h3>Reflect</h3>
            <p className="small">AI nudges tied to rubric language so students see clear next steps.</p>
          </div>
        </div>
      </Section>

      <Section title="Accessibility" subtitle="VoiceOver and NVDA tested across the writing flow">
        <ul role="list" style={{ paddingLeft: '1rem' }}>
          <li>Visible focus states on all controls</li>
          <li>Readable contrast for dark backgrounds (WCAG AA)</li>
          <li>ARIA labels for navigation, demo controls, and CTAs</li>
          <li>Skip-to-content link for keyboard-only users</li>
        </ul>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <CTAButton href="/experience">Launch sandbox</CTAButton>
        <CTAButton href="/storycraft" variant="secondary">
          Explore micro-story studio
        </CTAButton>
      </div>
    </div>
  );
}
