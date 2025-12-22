import CTAButton from '../../components/CTAButton';
import Section from '../../components/Section';
import type { Metadata } from 'next';
import LandingInteractive, { DemoQuest } from '../../components/LandingInteractive';

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

const screenshotPlaceholders = [
  {
    title: 'Quest prompt',
    description: 'Short directions with a colorful badge countdown.',
    color: '#ff8bd133'
  },
  {
    title: 'Word bank in action',
    description: 'Students tap helpful phrases and add them instantly.',
    color: '#7dd3ff33'
  },
  {
    title: 'Calm finish screen',
    description: 'Reflect, breathe, and claim the badge reward.',
    color: '#c7f9cc44'
  }
];

export default function LandingPage() {
  return (
    <>
      <LandingInteractive quickNotes={quickNotes} />

      <div className="village-band">
        <div className="village-illustration" aria-hidden>
          <div className="village-sun" />
          <div className="village-hill" />
          <div className="village-houses">
            <div className="house" />
            <div className="house house--tall" />
            <div className="house" />
          </div>
        </div>
        <div>
          <h2>Built like a calm village</h2>
          <p className="small">
            Each quest is a short walk: start, collect words, write, then end with a badge and a breath. The village vibe
            keeps screens friendly for younger writers.
          </p>
          <div className="cta-inline">
            <CTAButton href="/adults" variant="secondary" ariaLabel="Explore the adult guide">
              Adults guide
            </CTAButton>
            <CTAButton href="/math-science" ariaLabel="See math and science quests">
              Math &amp; science quests
            </CTAButton>
          </div>
        </div>
      </div>

      <Section
        title="Screenshots"
        subtitle="Peek at real quests—use placeholders until your own captures are ready"
        id="screens"
      >
        <div className="card-grid">
          {screenshotPlaceholders.map((shot) => (
            <div key={shot.title} className="card screenshot-card" style={{ backgroundColor: shot.color }}>
              <div className="screenshot-frame">
                <div className="screenshot-bar" />
                <div className="screenshot-body">
                  <div className="screenshot-block" />
                  <div className="screenshot-block screenshot-block--wide" />
                  <div className="screenshot-block" />
                </div>
              </div>
              <h3>{shot.title}</h3>
              <p className="small">{shot.description}</p>
            </div>
          ))}
        </div>
      </Section>

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

      <Section
        title="Try a sample quest"
        subtitle="Students can experiment instantly without accounts or saving"
        id="demo"
      >
        <DemoQuest />
      </Section>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="brand-mark">
              <span className="brand-primary">KEYVILLE</span>
              <span className="brand-subtitle">Calm writing quests</span>
            </div>
            <p className="small" style={{ marginTop: '0.75rem' }}>
              Calm writing quests that build skills—and badges.
            </p>
          </div>
          <div>
            <p className="small">Keep exploring</p>
            <ul className="footer-links">
              <li>
                <CTAButton href="/experience" ariaLabel="Play a quest now">
                  Play a quest
                </CTAButton>
              </li>
              <li>
                <CTAButton href="/adults" variant="secondary" ariaLabel="Adults">
                  Adults
                </CTAButton>
              </li>
              <li>
                <CTAButton href="/math-science" variant="secondary" ariaLabel="Math and science">
                  Math &amp; Science
                </CTAButton>
              </li>
            </ul>
          </div>
          <div>
            <p className="small">Stay calm &amp; curious</p>
            <p className="small">© {new Date().getFullYear()} ETL GIS Consulting LLC</p>
            <CTAButton href="/privacy" variant="secondary" ariaLabel="Privacy policy">
              Privacy
            </CTAButton>
          </div>
        </div>
      </footer>
    </>
  );
}
