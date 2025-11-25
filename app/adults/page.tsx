import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | For Teachers & Parents',
  description: 'Adult explainer with 20-minute story, skill alignment, privacy, and pricing overview.'
};

const skills = [
  { skill: 'Argument', quest: 'Debate room · claim + evidence' },
  { skill: 'Narrative', quest: 'Story sprint · beginning, middle, end' },
  { skill: 'Informative', quest: 'Explain it · facts + transitions' },
  { skill: 'Voice & tone', quest: 'Email room · audience-friendly edits' }
];

const pricing = [
  { tier: 'Classroom pilot', price: 'Free for 1 class', includes: 'Up to 32 students, exports, live support' },
  { tier: 'School plan', price: '$6 / student / month', includes: 'Admin controls, SIS export, priority chat' },
  { tier: 'Family plan', price: '$9 / month', includes: 'Up to 3 kids, quest library, badge history' }
];

export default function AdultsPage() {
  return (
    <div>
      <header className="hero hero--simple">
        <div>
          <p className="badge">For Teachers & Parents</p>
          <h1>See how Keyville fits into your routine.</h1>
          <p className="small">Students can use nicknames. We do not require email for students.</p>
          <p className="small">Student work can be deleted by a teacher or parent at any time.</p>
          <CTAButton href="/pricing" ariaLabel="Request a pilot or plan">
            Request a pilot
          </CTAButton>
        </div>
        <div className="card" aria-label="Dashboard previews">
          <h3>Classroom previews</h3>
          <p className="small">Snapshots you can share with your team.</p>
          <div className="card-grid" style={{ marginTop: '0.5rem' }}>
            <div className="card">
              <p className="small">Teacher view</p>
              <p className="tiny">Live rooms, badge unlocks, export buttons</p>
              <ul className="tiny" role="list">
                <li>Stamina trend</li>
                <li>Revision count</li>
                <li>Reflection notes</li>
              </ul>
            </div>
            <div className="card">
              <p className="small">Student view</p>
              <p className="tiny">Single-step screens with read aloud icons</p>
              <ul className="tiny" role="list">
                <li>Word bank toggle</li>
                <li>Progress bar</li>
                <li>Badge tray</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <Section title="How it works in 20 minutes" subtitle="One short block that fits home or class">
        <div className="timeline">
          <div className="timeline-item">
            <h3>Before class</h3>
            <p className="small">Pick a quest, set a timer, and remind students to use nicknames.</p>
          </div>
          <div className="timeline-item">
            <h3>During the 15-minute quest</h3>
            <p className="small">Students see one task per screen with read-aloud icons and default scaffolds on.</p>
          </div>
          <div className="timeline-item">
            <h3>After class</h3>
            <p className="small">Review reflections, badges, and exports without extra cleanup.</p>
          </div>
        </div>
      </Section>

      <Section title="Skill alignment" subtitle="Short mapping of skills to quest types">
        <div className="card">
          <table className="alignment-table">
            <thead>
              <tr>
                <th scope="col">ELA skill</th>
                <th scope="col">Quest type</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((row) => (
                <tr key={row.skill}>
                  <td>{row.skill}</td>
                  <td>{row.quest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Trust & Pricing" subtitle="Plain-language privacy, data, and cost">
        <div className="card-grid">
          <div className="card">
            <h3>Trust basics</h3>
            <ul role="list" className="tiny">
              <li>We are COPPA and FERPA aware.</li>
              <li>Data we collect: student codename, quest responses, badges.</li>
              <li>Data we never collect: student personal emails, phone numbers, or home addresses.</li>
              <li>Retention: student work can be deleted on request; automated cleanup after 12 months of inactivity.</li>
              <li>Exports: teachers and parents can download reflections and quests as CSV.</li>
            </ul>
          </div>
          <div className="card">
            <h3>Pricing</h3>
            <table className="alignment-table">
              <thead>
                <tr>
                  <th scope="col">Tier</th>
                  <th scope="col">Price</th>
                  <th scope="col">Includes</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((row) => (
                  <tr key={row.tier}>
                    <td>{row.tier}</td>
                    <td>{row.price}</td>
                    <td>{row.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="Questions" subtitle="Clear entry points for adults">
        <div className="card-grid">
          <div className="card">
            <h3>Data choices</h3>
            <p className="small">Students can use nicknames. We do not require email for students.</p>
          </div>
          <div className="card">
            <h3>Support</h3>
            <p className="small">Message us for deletion help or to export work for your records.</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
