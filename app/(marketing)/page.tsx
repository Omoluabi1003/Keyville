import CTAButton from '../../components/CTAButton';
import Section from '../../components/Section';
import { brand, caseStudies, heroStats } from '../../lib/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${brand.appName} — project by ${brand.organization} | Landing`,
  description: 'Room-rotation writing practice that feels like a game, with simple steps for middle schoolers.'
};

export default function LandingPage() {
  return (
    <div>
      <section className="hero">
        <div>
          <div className="badge">Made for middle schoolers</div>
          <p className="small" aria-label="Product owner">
            {brand.appName} · project by {brand.organization}
          </p>
          <h1>Study with quick quests, not endless tabs</h1>
          <p>
            {brand.appName} turns writing practice into bite-sized challenges. You pick a quest, write for a few minutes, and
            get friendly hints that help you try again. It stays simple so you can focus on your story.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <CTAButton href="/experience" ariaLabel="Start a practice quest">
              Start a quest
            </CTAButton>
            <CTAButton href="/students" variant="secondary">
              See study tips
            </CTAButton>
          </div>
        </div>
          <div className="card" aria-label="Highlights">
          <h3>Why students like {brand.appName}</h3>
          <ul role="list" style={{ paddingLeft: '1rem' }}>
            <li>Short, playful prompts feel like levels</li>
            <li>Helpful hints arrive right away</li>
            <li>No extra tabs or confusing menus</li>
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

      <Section title="Pick your next move" subtitle="Three simple paths to start learning">
        <div className="card-grid">
          <div className="card">
            <h3>Jump into a quest</h3>
            <p className="small">Choose a prompt, set a short timer, and collect a badge for finishing.</p>
            <CTAButton href="/experience" ariaLabel="Play a writing quest" variant="secondary">
              Play now
            </CTAButton>
          </div>
          <div className="card">
            <h3>Collect easy tips</h3>
            <p className="small">Grab quick reminders on how to brainstorm, draft, and revise without stress.</p>
            <CTAButton href="/students" ariaLabel="See study tips" variant="secondary">
              Study tips
            </CTAButton>
          </div>
          <div className="card">
            <h3>Share with your teacher</h3>
            <p className="small">Show your teacher the Storycraft room so you can get gentle feedback together.</p>
            <CTAButton href="/storycraft" ariaLabel="Open Storycraft" variant="secondary">
              Open Storycraft
            </CTAButton>
          </div>
        </div>
      </Section>

      <Section title="How it works" subtitle="Keep it light, keep it fun">
        <div className="card-grid">
          <div className="card">
            <h3>1. Pick a quest</h3>
            <p className="small">Select a prompt that sounds fun. You’ll only write for a few minutes at a time.</p>
          </div>
          <div className="card">
            <h3>2. Write and tweak</h3>
            <p className="small">Type your first try, then use the quick hints to add a detail or fix a sentence.</p>
          </div>
          <div className="card">
            <h3>3. Celebrate small wins</h3>
            <p className="small">Collect badges for finishing rounds and share your favorite lines with a friend.</p>
          </div>
        </div>
      </Section>

      <Section
        title="Student wins"
        subtitle="Real stories from kids who kept it simple"
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
