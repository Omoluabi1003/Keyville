import CTAButton from '../../components/CTAButton';
import Section from '../../components/Section';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Landing',
  description: 'Room-rotation writing practice that feels like a game, with simple steps for middle schoolers.'
};

const quickNotes = [
  { icon: '🎯', text: 'One-click start' },
  { icon: '🧠', text: 'Short quests' },
  { icon: '🏅', text: 'Badges for wins' }
];

const stemIdeas = [
  { title: 'Math puzzle runs', detail: 'Estimation, number talks, and visual models without timers.' },
  { title: 'Science mini-labs', detail: 'Claim-Evidence-Reasoning prompts after observations or demos.' },
  { title: 'Data storytelling', detail: 'Explain charts and ratios in 60 words to build clarity.' }
];

export default function LandingPage() {
  return (
    <>
      <div className="hero hero--simple">
        <div>
          <p className="badge">Made for middle schoolers</p>
          <h1>Quick quests feel like a game.</h1>
          <p className="small">Use a nickname; no student email needed.</p>
          <p className="small">Earn a badge after each short step.</p>
          <div className="cta-stack">
            <CTAButton href="/experience" ariaLabel="Play a quest now">
              Play a Quest
            </CTAButton>
            <Link className="tiny" href="#badges" aria-label="See my badges">
              See my badges
            </Link>
          </div>
          <div className="quick-list" aria-label="Three fast facts about Keyville">
            {quickNotes.map((item) => (
              <div key={item.text} className="quick-list__item">
                <span aria-hidden>{item.icon}</span>
                <span className="small">{item.text}</span>
              </div>
            ))}
          </div>
          <Link className="small" href="/adults">
            For Teachers & Parents
          </Link>
        </div>
        <div className="card" id="badges" aria-label="Recent badges">
          <h3>Recent badges</h3>
          <ul role="list" className="badge-list" style={{ marginTop: '0.5rem' }}>
            <li className="earned-badge">
              <span aria-hidden>🏅</span>
              <div>
                <strong>Quest Starter</strong>
                <p className="small">Pressed play and began.</p>
              </div>
            </li>
            <li className="earned-badge">
              <span aria-hidden>🏅</span>
              <div>
                <strong>Word Builder</strong>
                <p className="small">Used the word bank.</p>
              </div>
            </li>
            <li className="earned-badge">
              <span aria-hidden>🏅</span>
              <div>
                <strong>Calm Finisher</strong>
                <p className="small">Wrapped a quest calmly.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <Section title="Math &amp; science ideas" subtitle="Add STEM-friendly quests without losing the calm writing flow">
        <div className="card-grid">
          {stemIdeas.map((idea) => (
            <div key={idea.title} className="card">
              <h3>{idea.title}</h3>
              <p className="small">{idea.detail}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <CTAButton href="/math-science">See STEM roadmap</CTAButton>
        </div>
      </Section>
    </>
  );
}
