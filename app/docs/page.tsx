import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Docs',
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

      <Section title="6th-grade style guide" subtitle="Warm, playful writing for student-facing quests">
        <div className="card">
          <h4>Keep the tone cozy</h4>
          <p className="small">Sound like a friendly guide inviting kids into a quest or clubhouse.</p>
          <h4>Use everyday words</h4>
          <p className="small">Pick simple terms; if a new word pops up, add a quick hint in parentheses.</p>
          <h4>Keep directions short</h4>
          <p className="small">Write 1–2 crisp sentences so steps feel doable.</p>
          <h4>Paint gentle pictures</h4>
          <p className="small">Use calm metaphors like puzzles, teams, or maps instead of harsh ones.</p>
          <h4>Invite choice</h4>
          <p className="small">Frame actions as challenges: “Try,” “Pick,” or “See if you can...”</p>
          <h4>Stay consistent</h4>
          <p className="small">Reuse clear verbs and nouns so every quest feels familiar.</p>
        </div>
      </Section>

      <CTAButton href="/about" variant="secondary">
        Learn about the team
      </CTAButton>
    </div>
  );
}
