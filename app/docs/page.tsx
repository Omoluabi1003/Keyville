import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Docs',
  description: 'Product documentation hub with setup, classroom tips, and observability instrumentation.'
};

export default function DocsPage() {
  const priorityLegend = [
    {
      level: 'P1 — Critical',
      description: 'Must-have for student engagement, teacher adoption, or platform stability.'
    },
    {
      level: 'P2 — High Value',
      description: 'Enhancements that deepen learning, personalization, and retention.'
    },
    {
      level: 'P3 — Enrichment',
      description: 'Polish, seasonal content, and long-term differentiation.'
    }
  ];

  const upgradeTimeline = [
    {
      label: 'August · Sprint 0: Stabilization',
      goals: 'Prep the platform for back-to-school usage and ensure smooth adoption.',
      upgrades: [
        {
          title: 'UI Refresh for 6th Graders',
          priority: 'P1',
          description: 'Improve font sizes, simplify layout, and add child-friendly icons and color accents.'
        },
        {
          title: 'Mobile and Tablet Optimization',
          priority: 'P1',
          description: 'Ensure Keyville performs flawlessly on iPads and Chromebooks used in classrooms.'
        },
        {
          title: 'Basic Analytics Foundation',
          priority: 'P1',
          description: 'Track quest starts, quest completions, and hint usage with anonymous student IDs.'
        }
      ]
    },
    {
      label: 'September · Unit 1: Engagement',
      goals: 'Boost classroom engagement and motivate early adoption.',
      upgrades: [
        {
          title: 'Gamified Progress Dashboard',
          priority: 'P1',
          description: 'Streaks, badges, and completion meters to build habit-forming usage.'
        },
        {
          title: 'Quest Packs Starter Set',
          priority: 'P1',
          description: "Include packs like 'Describe a Character', 'Use Your Five Senses', and 'Fix the Sentence'."
        },
        {
          title: 'Teacher Classroom Creation',
          priority: 'P2',
          description: 'Allow teachers to create classes and invite students with simple class codes.'
        }
      ]
    },
    {
      label: 'October · Unit 2: Personalization',
      goals: 'Deliver differentiated instruction and smarter feedback.',
      upgrades: [
        {
          title: 'Hint Level Settings',
          priority: 'P1',
          description: 'Students choose Mild, Medium, or Spicy hint levels depending on confidence.'
        },
        {
          title: 'Adaptive Challenge System',
          priority: 'P2',
          description: 'Difficulty auto-adjusts based on performance, revision count, and mastery.'
        },
        {
          title: 'Accessibility Mode',
          priority: 'P2',
          description: 'Read-aloud, font scaling, and high-contrast mode to support diverse learners.'
        }
      ]
    },
    {
      label: 'November · Unit 3: Teacher Workflow',
      goals: 'Empower teachers with real classroom tools before the holiday season.',
      upgrades: [
        {
          title: 'Teacher Dashboard',
          priority: 'P1',
          description: 'Show sessions completed, average revision attempts, and skill-area breakdowns.'
        },
        {
          title: 'Assignment Mode',
          priority: 'P1',
          description: 'Teachers assign specific quests or quest packs with deadlines.'
        },
        {
          title: 'CSV Export',
          priority: 'P2',
          description: 'One-click export for grades or PLC collaboration.'
        }
      ]
    },
    {
      label: 'December · Winter Upgrade',
      goals: 'Ship light improvements in a short month.',
      upgrades: [
        {
          title: 'Holiday Quest Pack',
          priority: 'P3',
          description: "Fun themed writing prompts like 'Elf Lost His Map'."
        },
        {
          title: 'Performance Optimization',
          priority: 'P1',
          description: 'Caching improvements, faster loading, and offline-first enhancements.'
        }
      ]
    },
    {
      label: 'January · Unit 4: Story Mode',
      goals: 'Launch multi-quest narratives to deepen writing practice.',
      upgrades: [
        {
          title: 'Story Mode Chapter System',
          priority: 'P1',
          description: 'Students build a 3–6 chapter story with checkpoint saves.'
        },
        {
          title: 'Character Creation Mini Tool',
          priority: 'P2',
          description: 'Pick or design a character whose story grows across quests.'
        },
        {
          title: 'Your Story So Far View',
          priority: 'P2',
          description: 'Show draft progression to reinforce improvement.'
        }
      ]
    },
    {
      label: 'February · Unit 5: Peer Review',
      goals: 'Introduce safe, structured collaboration.',
      upgrades: [
        {
          title: 'Classroom Peer Review Queue',
          priority: 'P1',
          description: 'Students anonymously review one peer submission using guided prompts.'
        },
        {
          title: 'Friendly Hints System',
          priority: 'P2',
          description: 'Students select from teacher-approved hint templates.'
        }
      ]
    },
    {
      label: 'March · Unit 6: Curriculum Alignment',
      goals: 'Integrate with ELA standards for instructional value.',
      upgrades: [
        {
          title: 'Standards Tagging',
          priority: 'P1',
          description: 'Tag quests to state ELA standards for teacher lesson alignment.'
        },
        {
          title: 'Teacher Assigned Skill Packs',
          priority: 'P2',
          description: 'Teachers choose packs based on skill gaps like dialogue or figurative language.'
        }
      ]
    },
    {
      label: 'April · Unit 7: Growth Analytics',
      goals: 'Show measurable growth for students and teachers.',
      upgrades: [
        {
          title: 'Revision Tracking',
          priority: 'P1',
          description: 'Graph how writing improves from Draft 1 to Final.'
        },
        {
          title: 'Skill Growth Report',
          priority: 'P2',
          description: 'Quarter-by-quarter comparison of writing strengths.'
        }
      ]
    },
    {
      label: 'May · End-of-Year Showcase',
      goals: 'Celebrate achievements and prepare for the next cohort.',
      upgrades: [
        {
          title: 'Student Portfolio Export',
          priority: 'P1',
          description: 'Export all work into a simple PDF or slideshow for family night.'
        },
        {
          title: 'Year-End Badge Ceremony',
          priority: 'P3',
          description: "Badges like 'Creative Champion', 'Dialogue Master', or 'Plot Builder'."
        },
        {
          title: 'Teacher Feedback Survey',
          priority: 'P1',
          description: 'Collect actionable insights for next year’s roadmap.'
        }
      ]
    }
  ];

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

      <Section title="School-year upgrade plan" subtitle="August–May roadmap tailored for 6th-grade classrooms">
        <div className="card-grid">
          {priorityLegend.map(({ level, description }) => (
            <div className="card" key={level}>
              <h4>{level}</h4>
              <p className="small">{description}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.25rem' }} className="card-grid">
          {upgradeTimeline.map(({ label, goals, upgrades }) => (
            <div className="card" key={label}>
              <h3>{label}</h3>
              <p className="small">
                <strong>Goal:</strong> {goals}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upgrades.map(({ title, priority, description }) => (
                  <div key={title}>
                    <p className="small" style={{ marginBottom: '0.25rem' }}>
                      <strong>
                        {priority} · {title}
                      </strong>
                    </p>
                    <p className="small" style={{ margin: 0 }}>{description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTAButton href="/about" variant="secondary">
        Learn about the team
      </CTAButton>
    </div>
  );
}
