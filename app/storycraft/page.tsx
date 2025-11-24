import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';
import { brand } from '../../lib/navigation';

export const metadata: Metadata = {
  title: `${brand.appName} — project by ${brand.organization} | Storycraft Studio`,
  description: 'Micro-story studio overview with templates, AI tone coaching, and accessible controls.'
};

export default function StorycraftPage() {
  return (
    <div>
      <h1>{brand.appName} Storycraft Studio</h1>
      <p className="small">Micro-story templates, tone coaching, and revision passes built for middle school writers.</p>

      <Section title="Templates" subtitle="Curated rooms that match standards and stamina goals">
        <div className="card-grid">
          <div className="card">
            <h3>Narrative spark</h3>
            <p className="small">30-60 word bursts to practice point of view and sensory details.</p>
          </div>
          <div className="card">
            <h3>Evidence builder</h3>
            <p className="small">Students pair claims with short evidence snippets to prep for essays.</p>
          </div>
          <div className="card">
            <h3>Dialogue lab</h3>
            <p className="small">Focus on punctuation, tone, and character intent through quick role-play prompts.</p>
          </div>
        </div>
      </Section>

      <Section title="AI tone coaching">
        <div className="card">
          <p>Coaching stays within rubric-aligned tone: supportive, specific, and classroom-safe.</p>
          <ul role="list" style={{ paddingLeft: '1rem' }}>
            <li>Highlights evidence of growth</li>
            <li>Points to concrete next steps instead of vague praise</li>
            <li>Never collects PII; runs with demo data in the sandbox</li>
          </ul>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/experience">Launch demo</CTAButton>
        <CTAButton href="/teacher" variant="secondary">
          See teacher controls
        </CTAButton>
      </div>
    </div>
  );
}
