'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import CTAButton from './CTAButton';

const badgeDetails = [
  {
    title: 'Quest Starter',
    description: 'Pressed play and began.',
    tone: '#7dd3ff'
  },
  {
    title: 'Word Builder',
    description: 'Used the word bank.',
    tone: '#ffb347'
  },
  {
    title: 'Calm Finisher',
    description: 'Wrapped a quest calmly.',
    tone: '#ff8bd1'
  }
];

const wordBank = ['wonder', 'teamwork', 'calm', 'adventure', 'reason', 'finish strong', 'celebrate'];

type QuickNote = {
  icon: string;
  text: string;
};

type LandingInteractiveProps = {
  quickNotes: QuickNote[];
};

function BadgeIcon({ tone }: { tone: string }) {
  return (
    <svg aria-hidden focusable="false" width="44" height="44" viewBox="0 0 64 64" className="badge-icon">
      <defs>
        <linearGradient id={`grad-${tone}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={tone} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1c1a33" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill={`url(#grad-${tone})`} opacity="0.9" />
      <path
        d="M20 34.5 28.5 43 46 23"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="46" cy="23" r="4" fill="#fff" opacity="0.95" />
    </svg>
  );
}

export default function LandingInteractive({ quickNotes }: LandingInteractiveProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [startMessage, setStartMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = window.localStorage.getItem('keyvilleNickname');
    if (saved) setNickname(saved);
  }, []);

  const badgeItems = useMemo(() => badgeDetails, []);

  const handleStart = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      setStartMessage('Add a nickname to jump in.');
      return;
    }
    setStartMessage('');
    window.localStorage.setItem('keyvilleNickname', trimmed);
    router.push('/play');
  };

  return (
    <div className="hero hero--simple">
      <div>
        <p className="badge">Made for middle schoolers</p>
        <h1>Quick quests feel like a game.</h1>
        <p className="tagline">Calm writing quests that build skills—and badges.</p>
        <p className="small">Use a nickname; no student email needed.</p>
        <p className="small">Earn a badge after each short step.</p>
        <div className="cta-stack">
          <button className="start-button" onClick={() => setIsModalOpen(true)} aria-label="Start playing now">
            Start Playing Now
          </button>
          <CTAButton href="/experience" ariaLabel="Play a quest now">
            Play a Quest
          </CTAButton>
          <div className="cta-inline">
            <Link className="tiny" href="#badges" aria-label="See my badges">
              See my badges
            </Link>
            <CTAButton href="/adults" variant="secondary" ariaLabel="For teachers and parents">
              For Teachers & Parents
            </CTAButton>
          </div>
        </div>
        <div className="quick-list" aria-label="Three fast facts about Keyville">
          {quickNotes.map((item) => (
            <div key={item.text} className="quick-list__item">
              <span aria-hidden>{item.icon}</span>
              <span className="small">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card" id="badges" aria-label="Recent badges">
        <h3>Recent badges</h3>
        <ul role="list" className="badge-list" style={{ marginTop: '0.5rem' }}>
          {badgeItems.map((badge) => (
            <li className="earned-badge" key={badge.title}>
              <BadgeIcon tone={badge.tone} />
              <div>
                <strong>{badge.title}</strong>
                <p className="small">{badge.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Start playing">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Pick a nickname</h3>
              <button className="icon-button" aria-label="Close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <p className="small">We only need a nickname to start your first quest.</p>
            <form className="modal-form" onSubmit={handleStart}>
              <label htmlFor="nickname">Nickname</label>
              <input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="SkyWriter, CalmFox, or your own"
              />
              {startMessage && (
                <p className="small" role="status" aria-live="polite">
                  {startMessage}
                </p>
              )}
              <button type="submit" className="button" style={{ width: '100%' }}>
                Go to the first quest
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export function DemoQuest() {
  const [demoResponse, setDemoResponse] = useState('');
  const [demoResult, setDemoResult] = useState('');

  const handleWordClick = (word: string) => {
    setDemoResponse((current) => `${current}${current ? ' ' : ''}${word}`.trim());
  };

  const submitDemoQuest = () => {
    if (!demoResponse.trim()) {
      setDemoResult('Try adding a word or two from the bank.');
      return;
    }
    setDemoResult('Nice! Imagine the quest saved and a badge popping up.');
  };

  return (
    <div className="card demo-card" aria-label="Try a sample quest">
      <div className="badge">Demo quest</div>
      <h3>Try it right here</h3>
      <p className="small">A non-saving practice quest with a word bank.</p>
      <div className="demo-quest">
        <div>
          <p className="small">Prompt</p>
          <p>
            In 60 words, describe what makes your classroom feel like a calm village where everyone helps each other.
          </p>
        </div>
        <div>
          <p className="small">Word bank (tap to add)</p>
          <div className="word-bank">
            {wordBank.map((word) => (
              <button key={word} type="button" className="chip" onClick={() => handleWordClick(word)}>
                {word}
              </button>
            ))}
          </div>
        </div>
        <textarea
          rows={4}
          value={demoResponse}
          onChange={(e) => setDemoResponse(e.target.value)}
          placeholder="Start typing your calm quest answer..."
        />
        <div className="demo-actions">
          <button type="button" className="button" onClick={submitDemoQuest}>
            Submit sample
          </button>
          {demoResult && <p className="small" role="status">{demoResult}</p>}
        </div>
      </div>
    </div>
  );
}
