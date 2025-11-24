import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keyville | Docs',
  description: 'Product documentation hub with setup, classroom tips, and observability instrumentation.'
};

export default function DocsPage() {
  return (
    <div>
      <h1>Documentation</h1>
      <p className="small">Quickstart guides and reference material for classrooms and pilots.</p>

      <Section title="Setup" subtitle="Get live with SSO, roster sync, and sandbox">
        <div className="card-grid">
          <div className="card">
            <h3>Admin checklist</h3>
            <p className="small">SSO setup, roster imports, and privacy review steps.</p>
          </div>
          <div className="card">
            <h3>Classroom launch</h3>
            <p className="small">How to introduce rooms, model a challenge, and share exemplars.</p>
          </div>
          <div className="card">
            <h3>Observability</h3>
            <p className="small">Events tracked: CTA clicks, sandbox completion, time-on-route.</p>
          </div>
        </div>
      </Section>

      <Section title="FAQ">
        <div className="card">
          <h4>How is student data handled?</h4>
          <p className="small">We minimize fields, encrypt in transit and at rest, and separate sandbox data from production.</p>
          <h4>How do exports work?</h4>
          <p className="small">CSV and JSON formats include roster IDs, room completions, and rubric alignment scores.</p>
          <h4>Can we customize prompts?</h4>
          <p className="small">Yes. Teachers can pin district-approved prompts, and AI feedback will align to your rubric language.</p>
        </div>
      </Section>

      <CTAButton href="/about" variant="secondary">
        Learn about the team
      </CTAButton>
    </div>
  );
}
