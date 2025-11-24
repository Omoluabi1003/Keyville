import CTAButton from '../../components/CTAButton';
import Section from '../../components/Section';
import { caseStudies, heroStats } from '../../lib/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keyville | Landing',
  description: 'Room-rotation writing practice with live AI feedback, telemetry, and teacher workflows ready for districts.'
};

export default function LandingPage() {
  return (
    <div>
      <section className="hero">
        <div>
          <div className="badge">Writing growth in under 90 seconds</div>
          <h1>Interactive writing rooms that actually fit classrooms</h1>
          <p>
            Keyville brings practice, AI feedback, and teacher-ready exports into one multi-page app. Students rotate through
            focused rooms, teachers see stamina and growth, and districts keep privacy first.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <CTAButton href="/experience" ariaLabel="Start sandbox experience">
              Start sandbox
            </CTAButton>
            <CTAButton href="/pricing" variant="secondary">
              See pilot tiers
            </CTAButton>
          </div>
        </div>
        <div className="card" aria-label="Highlights">
          <h3>Proof over promises</h3>
          <ul role="list" style={{ paddingLeft: '1rem' }}>
            <li>42k micro-challenges completed across pilots</li>
            <li>Telemetry-ready exports for SIS ingestion</li>
            <li>AI feedback tuned to middle school rubrics</li>
          </ul>
          <div className="card-grid" style={{ marginTop: '1rem' }}>
            {heroStats.map((stat) => (
              <div className="card" key={stat.label}>
                <p className="small">{stat.label}</p>
                <h3>{stat.value}</h3>
                <p className="small">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title="Buyer journeys" subtitle="Routes for every persona to self-serve">
        <div className="card-grid">
          <div className="card">
            <h3>Students</h3>
            <p className="small">Guided practice, voiceover-friendly controls, and AI nudges that respect age boundaries.</p>
            <CTAButton href="/students" ariaLabel="View student route" variant="secondary">
              View student path
            </CTAButton>
          </div>
          <div className="card">
            <h3>Teachers</h3>
            <p className="small">Classroom rotation workflow, exports, and rubric overlays teachers can rely on.</p>
            <CTAButton href="/teacher" ariaLabel="View teacher route" variant="secondary">
              Teacher dashboard
            </CTAButton>
          </div>
          <div className="card">
            <h3>District readiness</h3>
            <p className="small">Privacy, security, and integrations with SSO and roster sync to launch quickly.</p>
            <CTAButton href="/security" ariaLabel="View security posture" variant="secondary">
              Review trust center
            </CTAButton>
          </div>
        </div>
      </Section>

      <Section
        title="Case studies"
        subtitle="District pilots that improved writing stamina and reduced teacher load"
        id="case-studies"
      >
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
                “{study.quote}”<br />
                <span className="small">— {study.role}</span>
              </blockquote>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
