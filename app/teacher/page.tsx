import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import { caseStudies } from '../../lib/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '../../lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Keyville | Teacher Mode',
  description: 'Rotation workflow, rubric overlays, exports, accessibility, and pilot readiness for teachers.',
  path: '/teacher'
});

export default function TeacherPage() {
  return (
    <div>
      <h1>Teacher mode</h1>
      <p className="small">Built for smooth rotations and evidence you can export.</p>

      <Section title="Classroom rotation workflow" subtitle="Predictable steps that keep rotations calm">
        <div className="timeline">
          <div className="timeline-item">
            <h3>Launch</h3>
            <p className="small">Queue rooms, assign by readiness, and pre-load scaffolds for emergent writers.</p>
          </div>
          <div className="timeline-item">
            <h3>Monitor</h3>
            <p className="small">Live view of stamina (words/min), rubric alignment, and flagged students needing support.</p>
          </div>
          <div className="timeline-item">
            <h3>Debrief</h3>
            <p className="small">Export SIS-friendly CSVs, badge growth, and share exemplars with one click.</p>
          </div>
        </div>
      </Section>

      <Section title="Rubrics, stamina, accessibility">
        <div className="card-grid">
          <div className="card">
            <h3>Rubric overlays</h3>
            <p className="small">Align prompts to your rubric language. AI feedback references the same anchors.</p>
          </div>
          <div className="card">
            <h3>Writing stamina tracking</h3>
            <p className="small">Minutes in focus, revision loops, and words written trend by student.</p>
          </div>
          <div className="card">
            <h3>Accessibility story</h3>
            <p className="small">VoiceOver labels, keyboard-friendly controls, and dyslexia-friendly spacing options.</p>
          </div>
        </div>
      </Section>

      <Section title="Exports and governance" subtitle="Proof you can send to admins without reformatting">
        <div className="card-grid">
          <div className="card">
            <h3>CSV + SIS friendly</h3>
            <p className="small">Roster IDs, room completion, and rubric alignment exports.</p>
          </div>
          <div className="card">
            <h3>Dashboard snapshots</h3>
            <p className="small">One-click PDF for family conferences and PLC share-outs.</p>
          </div>
          <div className="card">
            <h3>Support SLAs</h3>
            <p className="small">Pilot governance, live chat during school hours, and escalation to humans fast.</p>
          </div>
        </div>
      </Section>

      <Section title="Case studies" subtitle="What teachers see during pilots">
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
              <blockquote>
                “{study.quote}”
                <br />
                <span className="small">— {study.role}</span>
              </blockquote>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <CTAButton href="/pricing">Request pilot</CTAButton>
        <CTAButton href="/privacy" variant="secondary">
          Review privacy
        </CTAButton>
      </div>
    </div>
  );
}
