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

      <Section
        title="Accessibility and readability"
        subtitle="Keep every quest comfortable for younger readers with varied strengths"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Flexible text controls</h3>
            <p className="small">Teachers and students can bump font size, spacing, and contrast without leaving the flow.</p>
          </div>
          <div className="card">
            <h3>Navigation that waits</h3>
            <p className="small">Timers and prompts respect slower reading speeds with generous default durations.</p>
          </div>
          <div className="card">
            <h3>Read-aloud and speak-hint</h3>
            <p className="small">Optional narration and whispered hints provide auditory reinforcement when focus drifts.</p>
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

      <Section
        title="Revision flow"
        subtitle="Friendly nudges keep students iterating without feeling stuck"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Try-again prompts</h3>
            <p className="small">"Nice start! Now add one interesting detail…" messages model the next move in a few words.</p>
          </div>
          <div className="card">
            <h3>Quick hints</h3>
            <p className="small">Tap for bite-sized hints that appear inline, then celebrate small wins with soft confetti.</p>
          </div>
          <div className="card">
            <h3>One-click retry</h3>
            <p className="small">Students can re-open their draft with edits pre-highlighted to keep momentum going.</p>
          </div>
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
            <h3>Calm progress tracker</h3>
            <p className="small">
              A visible quest progress bar and streak meter show momentum without grades, encouraging retries with
              unlimited hints.
            </p>
          </div>
          <div className="card">
            <h3>Avatar customization</h3>
            <p className="small">Earn cosmetic unlocks for finishing quests and boss challenges.</p>
          </div>
          <div className="card">
            <h3>Return path reminders</h3>
            <p className="small">Subtle notifications guide students back to their current world and tier.</p>
          </div>
          <div className="card">
            <h3>Missions and unlocks</h3>
            <p className="small">Optional side quests appear after streaks to build momentum without cluttering the map.</p>
          </div>
        </div>
      </Section>

      <Section
        title="Teacher and family connection"
        subtitle="Share progress simply with the adults who help students grow"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Parent and guardian view</h3>
            <p className="small">Weekly snapshots show "what your kids did this week" with highlights and talking points.</p>
          </div>
          <div className="card">
            <h3>Teacher dashboard</h3>
            <p className="small">Lightweight class tracker with printable reports to encourage adoption without setup.</p>
          </div>
          <div className="card">
            <h3>Share with your teacher</h3>
            <p className="small">Existing share flows stay one click away so feedback loops remain quick.</p>
          </div>
        </div>
      </Section>

      <Section title="Forward-thinking roadmap" subtitle="Thoughtful expansion that keeps writing first">
        <div className="card-grid">
          <div className="card">
            <h3>Adaptive difficulty</h3>
            <p className="small">Prompt rigor steps up naturally after a student completes a few easy quests.</p>
          </div>
          <div className="card">
            <h3>Peer boosts</h3>
            <p className="small">Teacher-moderated sharing lets students post a favorite line to encourage each other.</p>
          </div>
          <div className="card">
            <h3>School workflow ready</h3>
            <p className="small">Exports to LMS/SIS keep assignments and completion data flowing to existing systems.</p>
          </div>
          <div className="card">
            <h3>Mobile and offline friendly</h3>
            <p className="small">Optimized for tablets with low-latency controls and optional offline quest downloads.</p>
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
