import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import { caseStudies } from '../../lib/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '../../lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Keyville | About',
  description: 'Mission, pilots, partners, and team behind Keyville.',
  path: '/about'
});

export default function AboutPage() {
  return (
    <div>
      <h1>About Keyville</h1>
      <p className="small">We help students build writing stamina with playful practice and trustworthy AI.</p>

      <Section title="Mission">
        <div className="card">
          <p>Our mission is to make feedback loops fast, kind, and aligned to what teachers already say in class.</p>
          <p className="small">We work with districts to launch pilots that respect privacy and classroom realities.</p>
        </div>
      </Section>

      <Section title="Pilots and partners" subtitle="Highlights from recent collaborations">
        <div className="card-grid">
          {caseStudies.map((study) => (
            <div className="card" key={study.name}>
              <p className="small">{study.dates}</p>
              <h3>{study.name}</h3>
              <ul role="list" style={{ paddingLeft: '1rem' }}>
                {study.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Testimonials">
        <div className="card-grid">
          <div className="card">
            <blockquote>
              “Our sixth graders finally saw feedback as a friend, not a threat.”
              <br />
              <span className="small">Assistant Principal</span>
            </blockquote>
          </div>
          <div className="card">
            <blockquote>
              “The pilot gave us exports we could actually use in PLCs without extra cleanup.”
              <br />
              <span className="small">ELA Department Chair</span>
            </blockquote>
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/pricing">Request pilot</CTAButton>
        <CTAButton href="/privacy" variant="secondary">
          View privacy commitments
        </CTAButton>
      </div>
    </div>
  );
}
