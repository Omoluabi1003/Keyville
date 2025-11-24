import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Writing Practice Platform',
  description:
    'Platform blueprint for middle school writing practice with scaffolds, feedback loops, motivation, accessibility, and teacher controls.'
};

export default function PlatformPage() {
  return (
    <div>
      <h1>Keyville Writing Practice Platform</h1>
      <p className="small">
        Purpose-built for 6th grade writers and the ELA teachers who coach them through quick quests, reflection, and steady growth.
      </p>

      <Section title="Audience and objectives">
        <div className="card-grid">
          <div className="card">
            <h3>Who it serves</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Middle school students who need quick, confident writing reps</li>
              <li>ELA teachers who want oversight, differentiation, and safe sharing</li>
            </ul>
          </div>
          <div className="card">
            <h3>What we aim for</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Higher engagement and motivation with quests and badges</li>
              <li>Clear feedback loops and revision cycles</li>
              <li>Accessible, aligned practice that fits district governance</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        title="Scaffolding and support"
        subtitle="Quick-start writing steps that adapt to different levels"
        id="scaffolding"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Tiered hints</h3>
            <ol role="list" style={{ paddingLeft: '1rem' }}>
              <li>Brainstorming guidance: ideas, feelings, and senses to pull from</li>
              <li>Idea selection and expansion: choose one and stretch details</li>
              <li>Detailed development tips: pacing, clarity, and cohesion nudges</li>
            </ol>
          </div>
          <div className="card">
            <h3>Graphic and sentence starters</h3>
            <p className="small">Toggleable supports for reluctant writers.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Organizer tiles for sequence, compare/contrast, and claim/evidence</li>
              <li>Sentence starters that echo classroom wording</li>
              <li>Challenge mode with harder prompts for advanced students</li>
            </ul>
          </div>
          <div className="card">
            <h3>Teacher controls</h3>
            <p className="small">Differentiated release of scaffolds and accommodations.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Assign hint levels by student group</li>
              <li>Lock or unlock graphic organizer types per quest</li>
              <li>Preload sentence stems that match the lesson objective</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Feedback and reflection" subtitle="Kind, specific loops that keep students writing" id="feedback">
        <div className="card-grid">
          <div className="card">
            <h3>Reflection prompt</h3>
            <p className="small">After each quest, students answer:</p>
            <p className="small">“What did you do well? What can you improve?”</p>
          </div>
          <div className="card">
            <h3>Revision cycle</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Enable quick edits with highlighted next steps</li>
              <li>Badge for improvement after a second pass</li>
            </ul>
          </div>
          <div className="card">
            <h3>Peer sharing</h3>
            <p className="small">Positive, safe exchanges with controlled scope.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Sample size of two peers per round</li>
              <li>Safety rules pinned above the exchange box</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Progress and motivation" subtitle="Signals for students, insights for teachers" id="progress">
        <div className="card-grid">
          <div className="card">
            <h3>Badges and streaks</h3>
            <p className="small">Novice → Story Crafter → Pro Writer</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Growth streaks tied to daily practice</li>
              <li>Friendly nudges to maintain momentum</li>
            </ul>
          </div>
          <div className="card">
            <h3>Student dashboard</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Quests completed, growth streaks, and time spent</li>
              <li>Mini-celebrations when revision improves clarity</li>
            </ul>
          </div>
          <div className="card">
            <h3>Teacher dashboard</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Class summaries with low-engagement alerts</li>
              <li>Filter by scaffold level, prompt type, or badge progress</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Accessibility and devices" subtitle="Built for real classrooms and varied needs" id="accessibility">
        <div className="card-grid">
          <div className="card">
            <h3>Responsive and offline ready</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Optimized layouts for tablets and Chromebooks</li>
              <li>Enhanced PWA caching for low-bandwidth environments</li>
            </ul>
          </div>
          <div className="card">
            <h3>Audio and multimodal</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Read-aloud for prompts, hints, and instructions</li>
              <li>Audio-first lines for multimodal prompts</li>
            </ul>
          </div>
          <div className="card">
            <h3>Inclusive controls</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>High-contrast focus states and keyboard-friendly flows</li>
              <li>Teacher-selected accommodations per student</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Data, privacy, and analytics" subtitle="Actionable exports without exposing PII" id="data">
        <div className="card-grid">
          <div className="card">
            <h3>SIS exports</h3>
            <p className="small">CSV format with quest counts, streaks, and revision gains.</p>
          </div>
          <div className="card">
            <h3>Anonymized analytics</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Completion rates and time on task</li>
              <li>Prompt engagement by theme</li>
            </ul>
          </div>
          <div className="card">
            <h3>Educator oversight</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Approval steps for peer sharing and badges</li>
              <li>Privacy-first defaults with clear audit trails</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Content and curriculum" subtitle="ELA-aligned prompts that flex across subjects" id="curriculum">
        <div className="card-grid">
          <div className="card">
            <h3>ELA alignment</h3>
            <p className="small">Maps to 6th grade narrative, descriptive, and persuasive standards.</p>
          </div>
          <div className="card">
            <h3>Cross-curricular prompts</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Science-themed quests for cause-and-effect writing</li>
              <li>Social Studies prompts for perspective and evidence</li>
            </ul>
          </div>
          <div className="card">
            <h3>Quest library</h3>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Multimodal prompts with audio first-line options</li>
              <li>Challenge prompts for students ready to go deeper</li>
            </ul>
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/experience">Play a sample quest</CTAButton>
        <CTAButton href="/teacher" variant="secondary">
          View teacher controls
        </CTAButton>
      </div>
    </div>
  );
}
