import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Math & Science',
  description: 'STEM quest ideas for math problem-solving, science labs, and cross-curricular writing practice inside KEYVILLE.'
};

export default function MathSciencePage() {
  return (
    <div>
      <h1>Math &amp; Science quests</h1>
      <p className="small">
        STEM-friendly rooms combine quick writing reps with problem-solving, observation, and claim-evidence reasoning so
        students build literacy while they practice math and science.
      </p>

      <Section title="STEM worlds" subtitle="Quest lines that keep curiosity and rigor balanced">
        <div className="card-grid">
          <div className="card">
            <h3>Math puzzle runs</h3>
            <p className="small">Timer-free prompts for mental math, estimation, and multi-step problems.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Number talks with sentence frames (“I notice…”, “I wonder…”, “My strategy…”) </li>
              <li>Visual models: area, fraction bars, and ratio tables to describe</li>
            </ul>
          </div>
          <div className="card">
            <h3>Science investigations</h3>
            <p className="small">Micro-labs that reinforce observation, variables, and claims.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>“What changed?” prompts after a quick demo video or image set</li>
              <li>Claim-Evidence-Reasoning cards with a built-in sentence bank</li>
            </ul>
          </div>
          <div className="card">
            <h3>Data storytelling</h3>
            <p className="small">Short writing turns students’ charts and tables into plain-language summaries.</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              <li>Caption a graph in 40-60 words with one comparison</li>
              <li>Translate ratios or probabilities into everyday scenarios</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        title="Math practice flows"
        subtitle="Tiny steps lower the barrier for students who get stuck on calculations or vocabulary"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Problem setup helpers</h3>
            <p className="small">Guided read-aloud, keyword highlights, and rephrase buttons keep focus on comprehension.</p>
          </div>
          <div className="card">
            <h3>Strategy journaling</h3>
            <p className="small">Students log one approach (draw, model, count back, estimate) before solving.</p>
          </div>
          <div className="card">
            <h3>Error analysis</h3>
            <p className="small">Compare two student solutions, choose the stronger reasoning, and rewrite it concisely.</p>
          </div>
        </div>
      </Section>

      <Section title="Science literacy" subtitle="Observation-first prompts build confidence before formal labs">
        <div className="card-grid">
          <div className="card">
            <h3>Phenomena journals</h3>
            <p className="small">Students describe what they see, hear, or predict in 3 quick sentences.</p>
          </div>
          <div className="card">
            <h3>Variables and models</h3>
            <p className="small">Identify variables, then choose a model (diagram, table, or flow) to explain cause and effect.</p>
          </div>
          <div className="card">
            <h3>Lab-lite reflections</h3>
            <p className="small">“Before / After / Why” prompts coach students to refine hypotheses without heavy grading.</p>
          </div>
        </div>
      </Section>

      <Section title="Teacher controls for STEM" subtitle="Differentiation without heavy setup">
        <div className="card-grid">
          <div className="card">
            <h3>Problem banks</h3>
            <p className="small">Swap in district-aligned items or exit-ticket questions with one click.</p>
          </div>
          <div className="card">
            <h3>Representation toggles</h3>
            <p className="small">Enable fraction bars, grids, or interactive diagrams based on student preference.</p>
          </div>
          <div className="card">
            <h3>Rubric-aligned feedback</h3>
            <p className="small">Glow/Grow/Go bands map to reasoning, accuracy, and communication checkpoints.</p>
          </div>
        </div>
      </Section>

      <Section title="Cross-curricular boosts" subtitle="Blend literacy with core math and science moves">
        <div className="card-grid">
          <div className="card">
            <h3>Vocabulary swaps</h3>
            <p className="small">Students rewrite jargon-heavy sentences into friendly language, then restore key terms.</p>
          </div>
          <div className="card">
            <h3>Quantities to words</h3>
            <p className="small">Turn calculations into short explanations that justify each step.</p>
          </div>
          <div className="card">
            <h3>Scenario remix</h3>
            <p className="small">Apply the same concept to a new context (e.g., ratios in recipes vs. robotics) to check transfer.</p>
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/experience">Play a quest</CTAButton>
        <CTAButton href="/teacher" variant="secondary">
          See teacher controls
        </CTAButton>
      </div>
    </div>
  );
}
