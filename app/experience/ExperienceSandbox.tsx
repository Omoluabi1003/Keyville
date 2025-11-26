'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import Section from '../../components/Section';
import { defaultTeacherClassSetting, teacherStorageKey } from '../../lib/classSettings';

export const calculateScaffoldDepth = (settings: any) => {
  return {};
};

export const buildLessonPlan = (settings: any, theme: any, slices: any) => {
  return {};
};

export const completeRoomProgress = (state: any, rooms: any) => {
  return {
    completedRooms: [],
    earnedBadges: []
  };
};

export const ensureBadge = (badges: any, badge: any) => {
  return [];
};

export const rooms = [];
export const scaffoldSteps = [];

type BrowserSpeechRecognitionEvent = {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  abort: () => void;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

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

const questPacks = [
  {
    id: 'space-signals',
    title: 'Space Signals',
    theme: 'Space',
    quests: ['Meteor Mail', 'Moon Base Mystery', 'Calm Comet', 'Star Whisper', 'Lost Satellite'],
    skills: ['Sensory detail', 'Sequence', 'Word choice']
  },
  {
    id: 'fantasy-friends',
    title: 'Fantasy Friends',
    theme: 'Fantasy',
    quests: ['Dragon Postcard', 'Kind Wizard', 'Brave Sprite', 'Mystic Door', 'Potion Shop'],
    skills: ['Dialogue', 'Character feelings', 'Description']
  },
  {
    id: 'sports-day',
    title: 'Sports Day',
    theme: 'Sports',
    quests: ['Final Lap', 'Team Huddle', 'Lucky Cleats', 'Coach Pep Talk', 'Rookie Move'],
    skills: ['Action verbs', 'Sequence words', 'Reflection']
  }
];

const leaderboard = [
  { codename: 'Comet Koala', completions: 12, streak: 4 },
  { codename: 'Bold Llama', completions: 10, streak: 3 },
  { codename: 'Neon Owl', completions: 8, streak: 2 }
];

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
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listeningField, setListeningField] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPack, setCurrentPack] = useState(questPacks[0]);
  const [cachedQuests, setCachedQuests] = useState<string[]>(questPacks[0].quests);
  const [isOffline, setIsOffline] = useState(false);
  const [progressStats, setProgressStats] = useState({
    questsCompleted: 0,
    badgesEarned: initialBadges.length,
    streak: 1,
    lastCompleted: '',
    wordsWritten: 0
  });
  const [analytics, setAnalytics] = useState({
    completions: 0,
    hintOpens: 0,
    voiceNotes: 0
  });
  const [suggestion, setSuggestion] = useState('');
  const [suggestionLog, setSuggestionLog] = useState<string[]>([]);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [difficultyTier, setDifficultyTier] = useState('age-appropriate');
  const [schedulePreset, setSchedulePreset] = useState('default');
  const [prompt, setPrompt] = useState('');
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const progress = Math.round(((activeStepIndex + 1) / questSteps.length) * 100);
  const activeStep = questSteps[activeStepIndex];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const handleVoices = () => setSpeechSupported(synth.getVoices().length > 0);
      handleVoices();
      synth.addEventListener('voiceschanged', handleVoices);
      return () => synth.removeEventListener('voiceschanged', handleVoices);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedProgress = window.localStorage.getItem('kv-progress');
    const savedGallery = window.localStorage.getItem('kv-drawings');
    const savedSuggestions = window.localStorage.getItem('kv-suggestions');
    const savedAnalytics = window.localStorage.getItem('kv-analytics');
    const savedPack = window.localStorage.getItem('kv-cached-pack');
    const storedPlan = JSON.parse(window.localStorage.getItem(teacherStorageKey) ?? '{}');
    const teacherPlan = storedPlan['Period 2 · ELA'] ?? defaultTeacherClassSetting();
    setDifficultyTier(teacherPlan.difficultyTier);
    setSchedulePreset(teacherPlan.schedulePreset);
    setPrompt(teacherPlan.promptIndex);

    if (savedProgress) setProgressStats(JSON.parse(savedProgress));
    if (savedGallery) setGallery(JSON.parse(savedGallery));
    if (savedSuggestions) setSuggestionLog(JSON.parse(savedSuggestions));
    if (savedAnalytics) setAnalytics(JSON.parse(savedAnalytics));
    if (savedPack) {
      const parsedPack = JSON.parse(savedPack);
      setCurrentPack(parsedPack);
      setCachedQuests(parsedPack.quests ?? questPacks[0].quests);
    }

    setIsOffline(!window.navigator.onLine);

    const handleNetwork = () => setIsOffline(!window.navigator.onLine);
    window.addEventListener('online', handleNetwork);
    window.addEventListener('offline', handleNetwork);

    return () => {
      window.removeEventListener('online', handleNetwork);
      window.removeEventListener('offline', handleNetwork);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('kv-progress', JSON.stringify(progressStats));
  }, [progressStats]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('kv-drawings', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('kv-suggestions', JSON.stringify(suggestionLog));
  }, [suggestionLog]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('kv-analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('dyslexic-font', dyslexicFont);

    return () => {
      document.body.classList.remove('high-contrast');
      document.body.classList.remove('dyslexic-font');
    };
  }, [highContrast, dyslexicFont]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    if (!('webkitSpeechRecognition' in speechWindow || 'SpeechRecognition' in speechWindow)) return;

    const SpeechRecognitionClass = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    recognitionRef.current = new SpeechRecognitionClass();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    setVoiceSupported(true);
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

  const startVoiceInput = (field: 'brainstorm' | 'draft' | 'revision' | 'reflection') => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event: BrowserSpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;

      if (field === 'brainstorm') setBrainstorm((prev) => `${prev} ${transcript}`.trim());
      if (field === 'draft') setDraft((prev) => `${prev} ${transcript}`.trim());
      if (field === 'revision') setRevision((prev) => `${prev} ${transcript}`.trim());
      if (field === 'reflection') setReflection((prev) => `${prev} ${transcript}`.trim());

      setAnalytics((current) => ({ ...current, voiceNotes: current.voiceNotes + 1 }));
      setListeningField(null);
    };

    recognitionRef.current.onerror = () => setListeningField(null);
    recognitionRef.current.onend = () => setListeningField(null);
    setListeningField(field);
    recognitionRef.current.start();
  };

  const handleDraw = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!isDrawing) {
      lastPointRef.current = { x, y };
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1c1a33';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const lastPoint = lastPointRef.current ?? { x, y };
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPointRef.current = { x, y };
  };

  const startDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleDraw(event);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const saveDrawing = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setGallery((items) => [dataUrl, ...items].slice(0, 6));
  };

  const changePack = (packId: string) => {
    const chosen = questPacks.find((pack) => pack.id === packId);
    if (!chosen) return;
    setCurrentPack(chosen);
    setCachedQuests(chosen.quests);
    window.localStorage.setItem('kv-cached-pack', JSON.stringify(chosen));
  };

  const buildShareLink = () => {
    if (typeof window === 'undefined') return '';
    const payload = {
      questsCompleted: progressStats.questsCompleted,
      badgesEarned: progressStats.badgesEarned,
      streak: progressStats.streak,
      favoriteQuest: selectedTopic,
      pack: currentPack.title
    };
    return `${window.location.origin}/experience?report=${btoa(JSON.stringify(payload))}`;
  };

  const copyReport = async () => {
    const link = buildShareLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setToast('Shareable report link copied!');
    } catch (error) {
      console.error(error);
      setToast('Copy failed — you can still share this screen.');
    }
  };

  const submitSuggestion = () => {
    if (!suggestion.trim()) return;
    setSuggestionLog((current) => [suggestion.trim(), ...current].slice(0, 5));
    setSuggestion('');
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
      setProgressStats((current) => ({
        ...current,
        badgesEarned: current.badgesEarned + (current.badgesEarned < 50 ? 1 : 0)
      }));
    }

    if (stepId === 'reflect') {
      const today = new Date().toISOString().slice(0, 10);
      setProgressStats((stats) => {
        const streak = stats.lastCompleted === today ? stats.streak : stats.streak + 1;
        const wordsWritten = stats.wordsWritten + draft.split(' ').length + revision.split(' ').length;
        return {
          questsCompleted: stats.questsCompleted + 1,
          badgesEarned: stats.badgesEarned,
          streak,
          lastCompleted: today,
          wordsWritten
        };
      });

      setAnalytics((current) => ({ ...current, completions: current.completions + 1 }));

      setToast('Quest saved! Progress stays on this device.');
      setActiveStepIndex(0);
      setBrainstorm('');
      setDraft('');
      setRevision('');
      setReflection('');
      return;
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

      <div className="card status-card" style={{ marginBottom: '1rem' }}>
        <div className="progress-wrap">
          <div>
            <p className="small">Comfort toggles</p>
            <h3>Accessibility ready</h3>
            <p className="tiny">Switch to dyslexia-friendly font, high contrast, and offline-friendly caching.</p>
          </div>
          <div className="status-actions">
            <button className="button secondary" onClick={() => setDyslexicFont((flag) => !flag)}>
              {dyslexicFont ? 'Dyslexia font on' : 'Dyslexia font off'}
            </button>
            <button className="button secondary" onClick={() => setHighContrast((flag) => !flag)}>
              {highContrast ? 'High contrast on' : 'High contrast off'}
            </button>
          </div>
          <div className="difficulty-tier">
            {
              {
                'age-appropriate': 'Age-appropriate',
                'challenge': 'Challenge (richer prompts, tighter scaffolds)'
              }[difficultyTier]
            }
          </div>
        </div>
        <div className="status-chips" role="status" aria-label="Offline and voice status">
          <span className="chip">{isOffline ? '📦 Offline cache ready' : '☁️ Online and syncing'}</span>
          <span className="chip">{voiceSupported ? '🎙️ Voice-to-text ready' : '🎙️ Voice input unavailable'}</span>
          <span className="chip">{speechSupported ? '🔊 Text-to-speech ready' : '🔊 Speaker unavailable'}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="progress-wrap">
          <div>
            <p className="small">Quest progress</p>
            <h3>{progressLabel}</h3>
            <div className="schedule-preset">
              {
                {
                  'default': 'Default Schedule',
                  'free-write-day': 'Free write day'
                }[schedulePreset]
              }
            </div>
          </div>
          <div className="progress" aria-label={`${progressLabel}, ${progress}% complete`} role="img">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div>Scaffold depth: {difficultyTier}</div>
        <div>
          {schedulePreset === 'free-write-day'
            ? `Free write day: ${questPacks[2].quests[prompt]}`
            : `Prompt: ${questPacks[0].quests[prompt]}`}
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
                  {voiceSupported && (
                    <button
                      className="button secondary"
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                      onClick={() => startVoiceInput('brainstorm')}
                      aria-pressed={listeningField === 'brainstorm'}
                    >
                      {listeningField === 'brainstorm' ? 'Listening… tap to pause' : 'Use voice to add notes'}
                    </button>
                  )}
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
                  {voiceSupported && (
                    <button
                      className="button secondary"
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                      onClick={() => startVoiceInput('draft')}
                      aria-pressed={listeningField === 'draft'}
                    >
                      {listeningField === 'draft' ? 'Listening… tap to pause' : 'Dictate this answer'}
                    </button>
                  )}
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
                  {voiceSupported && (
                    <button
                      className="button secondary"
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                      onClick={() => startVoiceInput('revision')}
                      aria-pressed={listeningField === 'revision'}
                    >
                      {listeningField === 'revision' ? 'Listening… tap to pause' : 'Dictate your revision'}
                    </button>
                  )}
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
                  {voiceSupported && (
                    <button
                      className="button secondary"
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                      onClick={() => startVoiceInput('reflection')}
                      aria-pressed={listeningField === 'reflection'}
                    >
                      {listeningField === 'reflection' ? 'Listening… tap to pause' : 'Speak your reflection'}
                    </button>
                  )}
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
              <button
                className="button secondary"
                onClick={() => {
                  setScaffoldsOpen((open) => !open);
                  setAnalytics((current) => ({ ...current, hintOpens: current.hintOpens + 1 }));
                }}
              >
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

      <Section
        title="Progress tracking dashboard"
        subtitle="Local-first stats, parent-friendly sharing, and anonymous classroom insights"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Progress snapshot</h3>
            <ul role="list" className="task-list">
              <li>Quests finished: {progressStats.questsCompleted}</li>
              <li>Badges earned: {progressStats.badgesEarned}</li>
              <li>Words written: {progressStats.wordsWritten}</li>
              <li>Streak: {progressStats.streak} days</li>
            </ul>
            <p className="tiny">Stored in LocalStorage—no login needed.</p>
          </div>

          <div className="card">
            <h3>Parent/teacher shareable report</h3>
            <p className="small">Generate a one-click link that summarizes this device&apos;s progress.</p>
            <button className="button" onClick={copyReport} style={{ width: '100%', marginBottom: '0.5rem' }}>
              Copy share link
            </button>
            <p className="tiny">Link encodes only badges, streaks, and a favorite quest topic.</p>
          </div>

          <div className="card">
            <h3>Anonymous analytics</h3>
            <ul role="list" className="task-list">
              <li>Micro-quests finished: {analytics.completions}</li>
              <li>Scaffold opens: {analytics.hintOpens}</li>
              <li>Voice notes used: {analytics.voiceNotes}</li>
            </ul>
            <p className="tiny">Designed for class-level trends without student names.</p>
          </div>
        </div>
      </Section>

      <Section
        title="Quest packs, offline mode, and multimedia prompts"
        subtitle="Pick a themed pack, cache it, draw or upload a visual, and keep going even without Wi‑Fi"
      >
        <div className="card-grid">
          <div className="card">
            <h3>Themed quest packs</h3>
            <label className="small" htmlFor="pack-picker">
              Choose a pack to cache for offline play
            </label>
            <select
              id="pack-picker"
              value={currentPack.id}
              onChange={(event) => changePack(event.target.value)}
              className="input"
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              {questPacks.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.title} · {pack.theme}
                </option>
              ))}
            </select>
            <p className="small">Cached quests (offline safe):</p>
            <ul role="list" className="task-list">
              {cachedQuests.map((quest) => (
                <li key={quest}>{quest}</li>
              ))}
            </ul>
            <p className="tiny">Skills covered: {currentPack.skills.join(', ')}.</p>
          </div>

          <div className="card">
            <h3>Multimedia & drawing prompt</h3>
            <p className="small">Sketch an idea before writing, then save it to your gallery.</p>
            <canvas
              ref={canvasRef}
              width={320}
              height={220}
              className="drawing-canvas"
              onPointerDown={startDrawing}
              onPointerMove={handleDraw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              aria-label="Drawing canvas for story idea"
            />
            <div className="status-actions" style={{ marginTop: '0.5rem' }}>
              <button className="button" onClick={saveDrawing}>
                Save to gallery
              </button>
              <button className="button secondary" onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0, 0, 320, 220)}>
                Clear canvas
              </button>
            </div>
            {gallery.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <p className="tiny">Saved sketches (local-only):</p>
                <div className="gallery-grid">
                  {gallery.map((img, index) => (
                    <img key={img} src={img} alt={`Sketch ${index + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Gamification boost</h3>
            <p className="small">Anonymous opt-in leaderboard and weekly challenge.</p>
            <p className="tiny">Weekly challenge: Finish any 2 quests with a drawing attached.</p>
            <ul role="list" className="task-list">
              {leaderboard.map((row) => (
                <li key={row.codename}>
                  {row.codename} — {row.completions} completions · {row.streak}-day streak
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>User-generated quest suggestions</h3>
            <p className="small">Send a new idea. We keep the latest five for teacher review.</p>
            <label className="tiny" htmlFor="suggestion">
              Suggest a quest
            </label>
            <textarea
              id="suggestion"
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              rows={3}
              placeholder="Example: A shy dragon writes a kind note…"
            />
            <button className="button" onClick={submitSuggestion} style={{ width: '100%', marginTop: '0.5rem' }}>
              Submit for moderation
            </button>
            {suggestionLog.length > 0 && (
              <ul role="list" className="task-list" style={{ marginTop: '0.5rem' }}>
                {suggestionLog.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
