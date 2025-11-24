import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Storycraft Studio',
  description: 'Micro-story studio overview with templates, AI tone coaching, and accessible controls inside KEYVILLE.'
};

export default function StorycraftPage() {
  return (
    <div>
      <h1>Storycraft Studio</h1>
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

      <Section
        title="Student experience upgrades"
        subtitle="Quest structure, scaffolds, and supports designed to feel like a friendly, focused journey"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Visible learning path</h3>
            <p className="small">
              Quests map into 4-6 themed worlds (Narrative, Descriptive, Opinion, Research Lite, Dialogue, Poetry) so
              students always know what is next.
            </p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Each world offers 5-8 micro-quests plus a boss quest</li>
              <li>Built-in “return to path” reminder keeps momentum steady</li>
            </ul>
          </div>

          <div className="card">
            <h3>Three-tier prompt scaffolding</h3>
            <p className="small">Warm-up, Stretch, and Challenge paths ladder rigor without calling out levels.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Prompts start concrete and personal, then layer detail and structure</li>
              <li>Students choose their comfort tier while teachers see pacing</li>
            </ul>
          </div>

          <div className="card">
            <h3>Micro-skills per quest</h3>
            <p className="small">Every quest isolates one writing move so wins feel bite-sized and repeatable.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Examples: strong verbs, sensory detail, topic sentence, evidence use, dialogue punctuation</li>
              <li>Each completion unlocks a one-line “skill earned” card</li>
            </ul>
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

      <Section title="Kid-friendly feedback" subtitle="Gentle, concise bands keep revisions clear and safe">
        <div className="card-grid">
          <div className="card">
            <h3>Glow</h3>
            <p className="small">Highlights what worked well in under two sentences so effort is celebrated.</p>
          </div>
          <div className="card">
            <h3>Grow</h3>
            <p className="small">Offers one improvement opportunity with a concrete example to copy.</p>
          </div>
          <div className="card">
            <h3>Go again</h3>
            <p className="small">Optional retry prompt with a friendly nudge to apply the tip immediately.</p>
          </div>
        </div>
      </Section>

      <Section title="Light gamification" subtitle="Motivation without leaderboards or pressure">
        <div className="card-grid">
          <div className="card">
            <h3>Personal bests</h3>
            <p className="small">Badges and streaks celebrate consistency; no ranking or comparison.</p>
          </div>
          <div className="card">
            <h3>Avatar customization</h3>
            <p className="small">Earn cosmetic unlocks for finishing quests and boss challenges.</p>
          </div>
          <div className="card">
            <h3>Return path reminders</h3>
            <p className="small">Subtle notifications guide students back to their current world and tier.</p>
          </div>
        </div>
      </Section>

      <Section
        title="Accessibility defaults"
        subtitle="All prompts, feedback, and controls ship with built-in supports"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Read-aloud</h3>
            <p className="small">Narrates prompts and feedback with user-controlled pace and replay.</p>
          </div>
          <div className="card">
            <h3>Dyslexia-friendly fonts</h3>
            <p className="small">Toggleable typeface plus generous spacing to reduce visual fatigue.</p>
          </div>
          <div className="card">
            <h3>Focus mode</h3>
            <p className="small">Hides UI chrome during writing and keeps ARIA labels intact for screen readers.</p>
          </div>
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
