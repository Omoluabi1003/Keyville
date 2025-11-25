"use client";

import { useMemo, useState } from 'react';
import Section from '../../components/Section';

const heroSteps = [
  'Pick a quest that looks fun.',
  'Write for one minute.',
  'Get a hint and celebrate your next move.'
];

const quickstartTiles = [
  {
    title: 'Pick a quest',
    description: 'Tap the room that looks fun. There is no wrong choice.',
    icon: '🧭'
  },
  {
    title: 'Write for a minute',
    description: 'Set a 60 second timer. Type or write your idea.',
    icon: '✍️'
  },
  {
    title: 'Get a hint',
    description: 'Tap Hint one time. Use one word or starter to improve your work.',
    icon: '💡'
  },
  {
    title: 'Celebrate your move',
    description: 'Check one fix, grab a badge, and enjoy your progress.',
    icon: '🎉'
  }
];

const singleStepCards = [
  {
    title: 'Think in steps',
    description: 'First you pick, then you write, then you fix one thing at a time.',
    icon: '🪜'
  },
  {
    title: 'Tap to listen',
    description: 'Every main instruction has a speaker icon. Tap it to hear the words.',
    icon: '🔊'
  },
  {
    title: 'Badges in play',
    description: 'As you try quests, you unlock badges that show your effort and growth.',
    icon: '🏅'
  }
];

const badges = [
  {
    name: 'Quest Starter',
    description: 'You pressed play and picked a quest.',
    icon: '🌟'
  },
  {
    name: 'Word Friend',
    description: 'You opened the word bank to help your writing.',
    icon: '📚'
  },
  {
    name: 'Steady Steps',
    description: 'You followed the one screen instructions from start to finish.',
    icon: '🚶'
  }
];

const questCards = [
  {
    title: 'Mystery message',
    description: 'Write a short note that has a clue hidden in the words.',
    icon: '🕵️'
  },
  {
    title: 'Comic hero',
    description: 'Write a quick scene where a hero solves a small problem.',
    icon: '🦸'
  },
  {
    title: 'Kind note',
    description: 'Write a kind message that could make someone smile today.',
    icon: '💌'
  }
];

const wordBank = ['spark', 'whisper', 'curious', 'brave', 'glow', 'clue'];
const sentenceStarters = [
  'I noticed that...',
  'The best part is...',
  'One detail I added was...',
  'This will help because...'
];

const streakDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ExperienceContent() {
  const [selectedQuest, setSelectedQuest] = useState<string | null>(questCards[0]?.title ?? null);
  const [isQuestLocked, setIsQuestLocked] = useState(false);
  const [scaffoldsVisible, setScaffoldsVisible] = useState(true);
  const [answerText, setAnswerText] = useState(
    'The radio hummed while I sent a brave whisper about the hidden clue, and I felt proud of my calm move.'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const progressWidth = useMemo(() => (selectedQuest ? (isQuestLocked ? '60%' : '40%') : '20%'), [selectedQuest, isQuestLocked]);

  const handleQuestClick = (questTitle: string) => {
    setSelectedQuest(questTitle);
    setIsQuestLocked(false);
    setToastMessage(`Selected “${questTitle}”. Press Lock to move to writing.`);
  };

  const handleLockQuest = () => {
    if (!selectedQuest) return;
    setIsQuestLocked(true);
    setToastMessage(`Locked “${selectedQuest}”. Time to write for one minute.`);
  };

  const handleAddWord = (addition: string) => {
    setAnswerText((text) => `${text} ${addition}`.trim());
    setToastMessage(`Added “${addition}” to your answer.`);
  };

  const handleToggleScaffolds = (visible: boolean) => {
    setScaffoldsVisible(visible);
    setToastMessage(visible ? 'Scaffolds are on.' : 'Scaffolds are hidden.');
  };

  return (
    <div className="experience-page">
      <section className="experience-hero">
        <div className="hero-copy">
          <p className="badge">Experience KEYVILLE</p>
          <h1>Experience KEYVILLE in 3 simple moves</h1>
          <p className="lead">
            You can try a quest without making an account. Use your keyboard or tap the buttons. Every control works with screen
            readers.
          </p>
          <div className="summary-strip" aria-label="Three step summary">
            {heroSteps.map((step) => (
              <div className="summary-card" key={step}>
                <span className="summary-icon" aria-hidden>
                  •
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <p className="tiny">Fully keyboard friendly. Read aloud icons appear beside every instruction.</p>
        </div>
        <div className="hero-pane" aria-hidden>
          <div className="hero-pane__card">
            <p className="small">Quest flow snapshot</p>
            <ol className="hero-steps">
              <li>Choose a quest</li>
              <li>Write for one minute</li>
              <li>Grab a hint</li>
              <li>Save and celebrate</li>
            </ol>
            <div className="hero-progress" aria-hidden>
              <div className="hero-progress__bar">
                <span style={{ width: progressWidth }} />
              </div>
              <div className="tiny" style={{ marginTop: '0.25rem' }}>
                {isQuestLocked ? 'Step 3 of 5 • Writing in progress' : selectedQuest ? 'Step 2 of 5 • Quest picked' : 'Step 1 of 5 • Calm pacing'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title="Kid quickstart" subtitle="For 6th graders: quest, write, hint, celebrate." id="kid-quickstart">
        <p className="small">One loop, four moves. Follow the tiles to get started without any help.</p>
        <div className="tile-grid" role="list">
          {quickstartTiles.map((tile) => (
            <div className="tile" role="listitem" key={tile.title}>
              <span className="tile__icon" aria-hidden>
                {tile.icon}
              </span>
              <div>
                <h3>{tile.title}</h3>
                <p className="small" style={{ margin: 0 }}>
                  {tile.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="One clear move per screen" subtitle="One main choice at a time with read aloud built in." id="single-step">
        <div className="single-step">
          <div className="single-step__copy">
            <p>
              You see one main choice at a time. Read aloud icons and scaffold tools stay on so you never feel stuck. Buttons and
              cards sit in the same spot on every screen for quick muscle memory.
            </p>
            <div className="callout">Calm pacing and accessibility stay visible without clutter.</div>
          </div>
          <div className="info-cards" role="list">
            {singleStepCards.map((card) => (
              <div className="info-card" role="listitem" key={card.title}>
                <div className="info-card__header">
                  <span className="info-card__icon" aria-hidden>
                    {card.icon}
                  </span>
                  <h3>{card.title}</h3>
                </div>
                <p className="small" style={{ margin: 0 }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Badge tray" subtitle="Effort turns into badges you can see." id="badge-tray">
        <p className="small">You can always see three recent badges. They remind you that every small step counts.</p>
        <div className="badge-grid" role="list">
          {badges.map((badge) => (
            <div className="badge-card" role="listitem" key={badge.name}>
              <div className="badge-card__icon" aria-hidden>
                {badge.icon}
              </div>
              <div>
                <h3>{badge.name}</h3>
                <p className="small" style={{ margin: 0 }}>
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Quest progress" subtitle="See Step 1 with a steady progress bar." id="quest-progress">
        <div className="quest-card" aria-label="Quest selection step">
          <div className="quest-progress">
            <div className="quest-progress__label">Step 1 of 5</div>
            <div className="quest-progress__bar" aria-hidden>
              <span style={{ width: progressWidth }} />
            </div>
          </div>
          <div className="quest-card__body">
            <div>
              <p className="small" style={{ marginBottom: '0.35rem', color: 'var(--muted)' }}>
                Choose your quest
              </p>
              <p className="small" style={{ margin: 0 }}>
                You only need one pick to begin. Choose one topic that sounds fun and friendly.
              </p>
            </div>
            <div className="quest-grid" role="list">
              {questCards.map((quest) => (
                <div
                  className={`quest ${selectedQuest === quest.title ? 'quest--selected' : ''}`}
                  role="button"
                  key={quest.title}
                  tabIndex={0}
                  onClick={() => handleQuestClick(quest.title)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleQuestClick(quest.title);
                    }
                  }}
                  aria-pressed={selectedQuest === quest.title}
                >
                  <div className="quest__icon" aria-hidden>
                    {quest.icon}
                  </div>
                  <div>
                    <h3>{quest.title}</h3>
                    <p className="small" style={{ margin: 0 }}>
                      {quest.description}
                    </p>
                  </div>
                  <button className="speaker" aria-label={`Read ${quest.title} description aloud`}>
                    🔈
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="quest-card__actions">
            <button className="button button--secondary" type="button">
              Back
            </button>
            <button className="button" type="button" onClick={handleLockQuest} disabled={!selectedQuest}>
              {isQuestLocked ? 'Quest locked' : 'Lock this quest'}
            </button>
          </div>
        </div>
      </Section>

      <Section title="Scaffolds" subtitle="Support tools start on; hide them when you are ready." id="scaffolds">
        <div className="scaffold-row">
          <button
            className={`chip ${scaffoldsVisible ? 'chip--active' : ''}`}
            type="button"
            aria-pressed={scaffoldsVisible}
            onClick={() => handleToggleScaffolds(true)}
          >
            Show scaffolds
          </button>
          <button
            className={`chip ${!scaffoldsVisible ? 'chip--active' : ''}`}
            type="button"
            aria-pressed={!scaffoldsVisible}
            onClick={() => handleToggleScaffolds(false)}
          >
            Hide scaffolds
          </button>
        </div>
        <div className={`scaffold-grid ${scaffoldsVisible ? '' : 'scaffold-grid--hidden'}`}>
          <div className="card scaffold-card">
            <div className="scaffold-card__header">
              <h3>Word bank</h3>
              <button className="speaker" aria-label="Read word bank aloud">
                🔈
              </button>
            </div>
            <div className="pill-row" role="list">
              {wordBank.map((word) => (
                <button key={word} className="pill" role="listitem" type="button" onClick={() => handleAddWord(word)}>
                  {word}
                </button>
              ))}
            </div>
          </div>
          <div className="card scaffold-card">
            <div className="scaffold-card__header">
              <h3>Sentence starters</h3>
              <button className="speaker" aria-label="Read sentence starters aloud">
                🔈
              </button>
            </div>
            <div className="pill-column" role="list">
              {sentenceStarters.map((starter) => (
                <button
                  key={starter}
                  className="pill pill--wide"
                  role="listitem"
                  type="button"
                  onClick={() => handleAddWord(starter)}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
          <div className="card scaffold-card">
            <div className="scaffold-card__header">
              <h3>Example answer</h3>
              <button className="speaker" aria-label="Read example answer aloud">
                🔈
              </button>
            </div>
            <p className="small" style={{ margin: 0 }}>
              {answerText}
            </p>
            <div className="toast" role="status" aria-live="polite">
              {toastMessage ?? 'Starter added to your answer.'}
            </div>
          </div>
        </div>
        <p className="tiny" style={{ marginTop: '0.35rem' }}>
          Tap a pill to insert a word or starter. A tiny toast confirms what you added.
        </p>
      </Section>

      <Section title="Days practiced this week" subtitle="Practice streak with gentle glow." id="streak">
        <p className="small">
          Each time you finish a quest, a day on your streak bar will glow. If you miss a day, the bar resets and you get a fresh
          start tomorrow.
        </p>
        <div className="streak" role="list" aria-label="Weekly streak">
          {streakDays.map((day, index) => (
            <div className="streak__day" role="listitem" key={day}>
              <div className={`streak__bar ${index === 2 ? 'streak__bar--glow' : ''}`} aria-hidden />
              <span className="tiny">{day}</span>
            </div>
          ))}
        </div>
        <p className="tiny" style={{ marginTop: '0.5rem' }}>
          Glow appears when a quest finishes that day. Reset happens quietly so kids feel safe to try again.
        </p>
      </Section>

      <Section title="Read aloud everywhere" subtitle="Speaker icons stay near the text you need." id="read-aloud">
        <p className="small">
          Every main instruction and scaffold has a small speaker icon. Tap the icon on a computer or mobile PWA to hear the text
          read out loud.
        </p>
        <button className="button button--ghost" type="button">
          🔈 Tap to hear a sample line
        </button>
      </Section>

      <Section title="Why this flow feels calm" subtitle="A structured path for adults and kids." id="calm-flow">
        <ul className="calm-list">
          <li>You see one key step at a time: pick, write, revise, reflect.</li>
          <li>Instruction text stays short and clear so kids do not feel overwhelmed.</li>
          <li>Badges and progress are always visible, without extra clicks or menus.</li>
        </ul>
      </Section>

      <footer className="experience-footer" aria-label="Footer">
        <div>
          <strong>ETL GIS Consulting LLC</strong>
          <p className="small" style={{ margin: '0.35rem 0 0 0' }}>
            Writing growth through playful practice.
          </p>
        </div>
        <div>
          <p className="small" style={{ marginBottom: '0.35rem' }}>Sitemap</p>
          <div className="footer-links">
            {['Home', 'Play a Quest', 'For Teachers & Parents', 'Study Tips', 'Storycraft', 'Platform'].map((link) => (
              <a key={link} href="#" className="footer-link">
                {link}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="small" style={{ marginBottom: '0.35rem' }}>Trust</p>
          <p className="small" style={{ margin: 0 }}>
            SIS friendly exports, privacy first analytics, SOC2 inspired controls, and clear service level agreements.
          </p>
          <p className="tiny" style={{ marginTop: '0.5rem' }}>(c) 2025 ETL GIS Consulting LLC</p>
        </div>
      </footer>
    </div>
  );
}
