'use client';

import { useEffect, useMemo, useState } from 'react';
import Section from '../../components/Section';

const questSteps = [
  {
    id: 'choose',
    title: 'Choose your quest',
    instruction: 'Pick one topic that sounds fun and friendly.',
    helper: 'You only need one pick to start.',
    actionLabel: 'Lock this quest'
  },
  {
    id: 'brainstorm',
    title: 'Brainstorm fast',
    instruction: 'Jot three quick ideas before the timer buzzes.',
    helper: 'Short notes beat perfect sentences.',
    actionLabel: 'Save brainstorm'
  },
  {
    id: 'write',
    title: 'Write it out',
    instruction: 'Turn your favorite idea into 3 sentences.',
    helper: 'Write like you are telling a friend.',
    actionLabel: 'Mark draft done'
  },
  {
    id: 'revise',
    title: 'Tweak and shine',
    instruction: 'Swap one word and add one feeling detail.',
    helper: 'Small fixes make a big glow.',
    actionLabel: 'Save revision'
  },
  {
    id: 'reflect',
    title: 'Reflect and celebrate',
    instruction: 'Type one thing you improved.',
    helper: 'Notice the win so you can repeat it.',
    actionLabel: 'Finish quest'
  }
];

const wordBank = ['spark', 'whisper', 'curious', 'brave', 'glow', 'clue'];
const sentenceStarters = [
  'I noticed that…',
  'The best part is…',
  'One detail I added was…',
  'This will help because…'
];

const exampleAnswer =
  'The radio hummed as I sent a brave whisper about the hidden clue and felt proud of my calm move.';

const initialBadges = [
  { id: 'starter', label: 'Quest Starter', detail: 'You pressed play and picked a quest.' },
  { id: 'word-friend', label: 'Word Friend', detail: 'You opened the word bank to help.' },
  { id: 'steady-steps', label: 'Steady Steps', detail: 'You followed the one-screen instructions.' }
];

const streakDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ExperienceSandbox() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('Mystery message');
  const [brainstorm, setBrainstorm] = useState('');
  const [draft, setDraft] = useState('');
  const [revision, setRevision] = useState('');
  const [reflection, setReflection] = useState('');
  const [badges, setBadges] = useState(initialBadges);
  const [toast, setToast] = useState('');
  const [scaffoldsOpen, setScaffoldsOpen] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const progress = Math.round(((activeStepIndex + 1) / questSteps.length) * 100);
  const activeStep = questSteps[activeStepIndex];

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const handleVoices = () => setSpeechSupported(synth.getVoices().length > 0);
    handleVoices();
    synth.addEventListener('voiceschanged', handleVoices);
    return () => synth.removeEventListener('voiceschanged', handleVoices);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const addBadge = (badgeToAdd: (typeof badges)[number]) => {
    setBadges((current) => {
      if (current.some((item) => item.id === badgeToAdd.id)) return current;
      setToast(`You earned: ${badgeToAdd.label}`);
      return [badgeToAdd, ...current].slice(0, 6);
    });
  };

  const handleReadAloud = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId((prev) => (prev === id ? null : prev));
    utterance.onerror = () => setSpeakingId((prev) => (prev === id ? null : prev));
    setSpeakingId(id);
    synth.speak(utterance);
  };

  const badgeByStep: Record<string, { id: string; label: string; detail: string }> = {
    brainstorm: { id: 'idea-jumper', label: 'Idea Jumper', detail: 'You brainstormed three fast ideas.' },
    write: { id: 'draft-driver', label: 'Draft Driver', detail: 'You turned ideas into sentences.' },
    revise: { id: 'revision-ranger', label: 'Revision Ranger', detail: 'You made a small, smart change.' },
    reflect: { id: 'reflection-star', label: 'Reflection Star', detail: 'You shared what improved.' }
  };

  const handleNext = () => {
    const stepId = activeStep.id;
    const nextIndex = Math.min(activeStepIndex + 1, questSteps.length - 1);

    if (badgeByStep[stepId]) {
      addBadge(badgeByStep[stepId]);
    }

    setActiveStepIndex(nextIndex);
  };

  const handleBack = () => {
    setActiveStepIndex((index) => Math.max(index - 1, 0));
  };

  const progressLabel = useMemo(
    () => `Step ${activeStepIndex + 1} of ${questSteps.length}`,
    [activeStepIndex]
  );

  const decisionGroup = (
    <div className="status-actions" aria-label="Quest navigation">
      <button className="button secondary" onClick={handleBack} disabled={activeStepIndex === 0}>
        Back
      </button>
      <button className="button" onClick={handleNext}>
        {activeStep.actionLabel}
      </button>
    </div>
  );

  const streakInfo =
    'Days practiced this week. Glow fills when you finish a quest. Miss a day and the streak resets tomorrow.';

  return (
    <div className="escape-shell">
      <header className="escape-hero">
        <div>
          <p className="badge">Single-step kid flow</p>
          <h1>One clear move per screen.</h1>
          <p className="small">Read-aloud icons and scaffolds stay on so you never feel stuck.</p>
          <div className="status-chips" role="status" aria-label="Calm flow">
            <span className="chip">🧠 Think in steps</span>
            <span className="chip">🔊 Tap to listen</span>
            <span className="chip">🏅 Badges in play</span>
          </div>
        </div>
        <div className="card" aria-label="Badge tray">
          <h3>Badge tray</h3>
          <p className="small">You can see three recent badges anytime.</p>
          <ul className="badge-list" role="list">
            {badges.slice(0, 3).map((badge) => (
              <li key={badge.id} className="earned-badge">
                <span aria-hidden>🏅</span>
                <div>
                  <strong>{badge.label}</strong>
                  <p className="small">{badge.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          {toast && <div className="toast" role="status">{toast}</div>}
        </div>
      </header>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="progress-wrap">
          <div>
            <p className="small">Quest progress</p>
            <h3>{progressLabel}</h3>
          </div>
          <div className="progress" aria-label={`${progressLabel}, ${progress}% complete`} role="img">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="escape-grid">
        <div className="column">
          <Section title={activeStep.title} subtitle={activeStep.helper}>
            <div className="card">
              <div className="read-aloud">
                <p className="small" id={`instruction-${activeStep.id}`}>
                  {activeStep.instruction}
                </p>
                <button
                  className="icon-button"
                  aria-label={`Read aloud: ${activeStep.instruction}`}
                  onClick={() => handleReadAloud(activeStep.id, activeStep.instruction)}
                  disabled={!speechSupported && speakingId === null}
                >
                  {speakingId === activeStep.id ? '🔊…' : '🔊'}
                </button>
              </div>

              {activeStep.id === 'choose' && (
                <div className="card-grid" role="radiogroup" aria-label="Pick a quest topic">
                  {['Mystery message', 'Comic hero', 'Kind note'].map((topic) => (
                    <label key={topic} className={`card ${selectedTopic === topic ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="quest-topic"
                        value={topic}
                        checked={selectedTopic === topic}
                        onChange={(event) => setSelectedTopic(event.target.value)}
                      />
                      <strong>{topic}</strong>
                      <p className="tiny">One clear mission to write about.</p>
                    </label>
                  ))}
                </div>
              )}

              {activeStep.id === 'brainstorm' && (
                <div className="field">
                  <label htmlFor="brainstorm">Brainstorm notes (3 ideas)</label>
                  <textarea
                    id="brainstorm"
                    value={brainstorm}
                    onChange={(event) => setBrainstorm(event.target.value)}
                    rows={3}
                    placeholder="Idea 1: …"
                  />
                </div>
              )}

              {activeStep.id === 'write' && (
                <div className="field">
                  <label htmlFor="draft">Write three sentences</label>
                  <textarea
                    id="draft"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={4}
                    placeholder="Tell your friend what happened."
                  />
                </div>
              )}

              {activeStep.id === 'revise' && (
                <div className="field">
                  <label htmlFor="revision">What did you swap?</label>
                  <textarea
                    id="revision"
                    value={revision}
                    onChange={(event) => setRevision(event.target.value)}
                    rows={3}
                    placeholder="I replaced… and added…"
                  />
                </div>
              )}

              {activeStep.id === 'reflect' && (
                <div className="field">
                  <label htmlFor="reflection">One thing you improved</label>
                  <textarea
                    id="reflection"
                    value={reflection}
                    onChange={(event) => setReflection(event.target.value)}
                    rows={3}
                    placeholder="I felt proud of…"
                  />
                  <p className="tiny" aria-live="polite">
                    This quick note appears for your teacher or parent as a badge note.
                  </p>
                </div>
              )}

              {decisionGroup}
            </div>
          </Section>

          <Section title="Scaffolds" subtitle="They start on; hide them if you want">
            <div className="card">
              <div className="read-aloud">
                <p className="small">Word bank, sentence starters, and a sample stay visible.</p>
                <button
                  className="icon-button"
                  aria-label="Read aloud scaffolds"
                  onClick={() => handleReadAloud('scaffolds', 'Word bank, sentence starters, and a sample stay visible.')}
                  disabled={!speechSupported && speakingId === null}
                >
                  {speakingId === 'scaffolds' ? '🔊…' : '🔊'}
                </button>
              </div>
              <button className="button secondary" onClick={() => setScaffoldsOpen((open) => !open)}>
                {scaffoldsOpen ? 'Hide scaffolds' : 'Show scaffolds'}
              </button>
              {scaffoldsOpen && (
                <div className="scaffold-grid">
                  <div>
                    <h4>Word bank</h4>
                    <ul className="tag-list" role="list">
                      {wordBank.map((word) => (
                        <li key={word} className="chip">
                          {word}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Sentence starters</h4>
                    <ul role="list" className="task-list">
                      {sentenceStarters.map((starter) => (
                        <li key={starter}>{starter}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Example answer</h4>
                    <p className="small">{exampleAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>

        <div className="column">
          <div className="card status-card">
            <div className="progress-wrap">
              <div>
                <p className="small">Streak</p>
                <h3>Days practiced this week</h3>
                <p className="tiny">{streakInfo}</p>
              </div>
            </div>
            <div className="streak-row" role="list" aria-label={streakInfo}>
              {streakDays.map((day, index) => (
                <div key={day} role="listitem" className={`streak-dot ${index <= activeStepIndex ? 'filled' : ''}`}>
                  <span className="tiny">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Read aloud everywhere</h3>
            <p className="small">
              Every main instruction and scaffold has a speaker icon. Tap it on desktop or mobile PWA to hear the text.
            </p>
            <div className="read-aloud" style={{ marginTop: '0.5rem' }}>
              <p className="tiny">Tap to try a demo line.</p>
              <button
                className="icon-button"
                aria-label="Read sample text aloud"
                onClick={() => handleReadAloud('demo', 'Kid-friendly instructions stay short and friendly.')}
                disabled={!speechSupported && speakingId === null}
              >
                {speakingId === 'demo' ? '🔊…' : '🔊'}
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Why this flow feels calm</h3>
            <ul role="list" className="task-list">
              <li>One decision per screen: pick, write, revise, reflect.</li>
              <li>Instruction text stays under two short sentences.</li>
              <li>Badges and progress stay visible without extra clicks.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
