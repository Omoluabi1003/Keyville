'use client';

import { useEffect, useMemo, useState } from 'react';
import CTAButton from '../../components/CTAButton';
import Section from '../../components/Section';
import { sandboxChallenge } from '../../lib/navigation';
import { kidThemes, type KidTheme } from '../../lib/kidThemes';
import {
  classSections,
  defaultTeacherClassSetting,
  difficultyLabels,
  scheduleLabels,
  schedulePromptAdds,
  teacherStorageKey,
  tierPromptAdds,
  type TeacherClassSetting
} from '../../lib/classSettings';

const identityBadges = ['Rookie Detective', 'Clue Collector', 'Signal Scout', 'Puzzle Pilot'];

export const rooms = [
  {
    id: 'files',
    title: 'Class files',
    focus: 'Context clues',
    tasks: [
      'Find words that hint at the time of day.',
      'Spot a phrase that reveals the tone.',
      'Highlight a clue that tells you who is speaking.'
    ],
    action: 'Solve clue'
  },
  {
    id: 'radio',
    title: 'Radio room',
    focus: 'Sequencing',
    tasks: ['Put the steps in order.', 'Circle the transition words.', 'Check the final signal.'],
    action: 'Tune in'
  },
  {
    id: 'press',
    title: 'Press release room',
    focus: 'Inference',
    tasks: ['Match the quote to the speaker.', 'Underline the main claim.', 'Swap one vague word for a vivid one.'],
    action: 'Create release'
  },
  {
    id: 'mail',
    title: 'Email room',
    focus: 'Audience',
    tasks: ['Check the greeting and closing.', 'Replace a bossy sentence.', 'Add one friendly detail.'],
    action: 'Send email'
  }
];

const vocabulary = [
  {
    word: 'Inference',
    prompt: 'Using clues to figure out what is not said directly.',
    choices: ['Prediction', 'Guess with evidence', 'Random idea'],
    correct: 'Guess with evidence'
  },
  {
    word: 'Sequence',
    prompt: 'Putting events or steps in the right order.',
    choices: ['Mixing everything', 'Exact timing', 'Story steps'],
    correct: 'Story steps'
  },
  {
    word: 'Context',
    prompt: 'Words around a clue that help you understand it.',
    choices: ['Random detail', 'Helpful surroundings', 'Unrelated fact'],
    correct: 'Helpful surroundings'
  },
  {
    word: 'Audience',
    prompt: 'The person you are writing for.',
    choices: ['A crowd of strangers', 'Who reads or hears it', 'The loudest voice'],
    correct: 'Who reads or hears it'
  }
];

export const scaffoldSteps = [
  {
    id: 'brainstorm',
    title: 'Brainstorm',
    prompt: 'Jot three fast clue angles in 45 seconds.',
    tooltip: 'Speed-list ideas with sensory words so your brain keeps moving.',
    sample: 'Gate screech warns the villain, flashlights sweep, partner waits to text a warning.'
  },
  {
    id: 'outline',
    title: 'Outline',
    prompt: 'Pick the best idea and sketch a beginning, middle, end.',
    tooltip: 'Use quick bullet points: problem, action, reveal.',
    sample: 'Start: villain hears creak; Middle: hides blueprint; End: sends coded email.'
  },
  {
    id: 'draft',
    title: 'Draft',
    prompt: 'Write 2-3 sentences in the antagonist’s voice.',
    tooltip: 'Keep sentences short; add one detail that shows emotion.',
    sample: 'I froze as the iron gate groaned—my blueprint still on the desk. Their armor clanged like a dare.'
  },
  {
    id: 'revise',
    title: 'Revise',
    prompt: 'Swap one vague word, add a sensory cue, and check sequence.',
    tooltip: 'Look for “thing,” “stuff,” or missing transitions to clean up.',
    sample: 'Replace “loud” with “metallic” and add “before they reached the porch.”'
  },
  {
    id: 'reflect',
    title: 'Reflect',
    prompt: 'Write one sentence on what changed and why it works better.',
    tooltip: 'Name the fix (detail, order, tone) so you remember it next time.',
    sample: 'Adding the metallic creak made the danger obvious without saying “scary.”'
  }
];

const writerLevels = [
  { id: 'novice', label: 'Novice Writer', detail: 'You started the mission and showed up ready to think.' },
  {
    id: 'rising',
    label: 'Rising Storyteller',
    detail: 'Two rooms down and your clue-finding muscles are growing.'
  },
  { id: 'master', label: 'Master Scribe', detail: 'All rooms cleared with calm moves and solid reasoning.' }
];

type EarnedBadge = { id: string; label: string; detail: string };

export type RoomProgressState = {
  progressLevel: number;
  currentRoomIndex: number;
  earnedBadges: EarnedBadge[];
  completedRooms: string[];
};

type StoredProgress = {
  progressLevel: number;
  currentRoomIndex: number;
  earnedBadges: EarnedBadge[];
  completedRooms: string[];
  revisionCompleted: boolean;
  reflectionCompleted: boolean;
};

const defaultProgressState: StoredProgress = {
  progressLevel: 0,
  currentRoomIndex: 0,
  earnedBadges: [],
  completedRooms: [],
  revisionCompleted: false,
  reflectionCompleted: false
};

const getStorageKey = (codename: string) =>
  `keyville-storycraft-${codename.trim().toLowerCase().replace(/\s+/g, '-') || 'student'}`;

export const ensureBadge = (earnedBadges: EarnedBadge[], badgeToAdd: EarnedBadge) => {
  if (earnedBadges.some((item) => item.id === badgeToAdd.id)) return earnedBadges;
  return [...earnedBadges, badgeToAdd];
};

export const calculateScaffoldDepth = (plan: TeacherClassSetting) => {
  let depth = scaffoldSteps.length;

  if (plan.difficultyTier === 'standard') {
    depth = Math.max(scaffoldSteps.length - 1, 4);
  } else if (plan.difficultyTier === 'challenge') {
    depth = Math.max(scaffoldSteps.length - 2, 3);
  }

  if (plan.schedulePreset === 'free-write-day') {
    depth = Math.max(depth - 1, 2);
  }

  return depth;
};

export const buildLessonPlan = (plan: TeacherClassSetting, selectedTheme?: KidTheme) => {
  const themePromptCount = selectedTheme?.starterPrompts.length ?? 0;

  const basePrompt =
    plan.kidModeEnabled && selectedTheme && themePromptCount
      ? selectedTheme.starterPrompts[plan.promptIndex % themePromptCount]
      : sandboxChallenge.prompt;

  const prompt = `${basePrompt} ${tierPromptAdds[plan.difficultyTier]} ${schedulePromptAdds[plan.schedulePreset]}`;

  const depth = calculateScaffoldDepth(plan);
  const scaffolds = scaffoldSteps.slice(0, depth);

  return {
    prompt,
    guardrail:
      plan.kidModeEnabled && selectedTheme
        ? `${selectedTheme.guardrail} · Scaffold depth: ${scaffolds.length} steps`
        : 'Uses rubric-aligned language for older students.',
    scaffolds
  };
};

export const completeRoomProgress = (state: RoomProgressState, roomsList = rooms): RoomProgressState => {
  const room = roomsList[state.currentRoomIndex];
  const isNewCompletion = !state.completedRooms.includes(room.id);
  const nextProgress = Math.max(state.progressLevel, state.currentRoomIndex + 1);

  const updatedBadges = isNewCompletion
    ? ensureBadge(state.earnedBadges, {
        id: `room-${room.id}`,
        label: `${room.title} Badge`,
        detail: 'You cleared the room and kept the mission moving.'
      })
    : state.earnedBadges;

  const completedRooms = isNewCompletion ? [...state.completedRooms, room.id] : state.completedRooms;

  return {
    earnedBadges: updatedBadges,
    completedRooms,
    progressLevel: Math.min(nextProgress, roomsList.length),
    currentRoomIndex: Math.min(state.currentRoomIndex + 1, roomsList.length - 1)
  };
};

export default function ExperienceSandbox() {
  const [codename, setCodename] = useState('Skyline Fox');
  const [badge, setBadge] = useState('Rookie Detective');
  const [response, setResponse] = useState('');
  const [progressLevel, setProgressLevel] = useState(defaultProgressState.progressLevel);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(defaultProgressState.currentRoomIndex);
  const [completedRooms, setCompletedRooms] = useState<string[]>(defaultProgressState.completedRooms);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>(defaultProgressState.earnedBadges);
  const [revisionCompleted, setRevisionCompleted] = useState(defaultProgressState.revisionCompleted);
  const [reflectionCompleted, setReflectionCompleted] = useState(defaultProgressState.reflectionCompleted);
  const [vocabAnswers, setVocabAnswers] = useState<Record<string, string>>({});
  const [scaffoldingEnabled, setScaffoldingEnabled] = useState(true);
  const [skipForAdvanced, setSkipForAdvanced] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [selectedClass, setSelectedClass] = useState(classSections[1]);
  const [teacherPlans, setTeacherPlans] = useState<Record<string, TeacherClassSetting>>({});
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeVoice, setActiveVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const activeTeacherPlan = useMemo(
    () => teacherPlans[selectedClass] ?? defaultTeacherClassSetting(),
    [selectedClass, teacherPlans]
  );

  const systemCompletedRooms = useMemo(() => completedRooms, [completedRooms]);

  const currentWriterLevel = useMemo(() => {
    if (progressLevel >= rooms.length) return writerLevels[2];
    if (progressLevel >= 2) return writerLevels[1];
    return writerLevels[0];
  }, [progressLevel]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedPlans = window.localStorage.getItem(teacherStorageKey);
    if (storedPlans) {
      try {
        setTeacherPlans(JSON.parse(storedPlans) as Record<string, TeacherClassSetting>);
      } catch (error) {
        console.error('Unable to read teacher plan settings', error);
      }
    }
  }, []);

  const selectedTheme = useMemo(
    () => kidThemes.find((theme) => theme.id === activeTeacherPlan.selectedThemeId),
    [activeTeacherPlan.selectedThemeId]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    const chooseVoice = () => {
      const voices = synth.getVoices();
      const englishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));
      setActiveVoice(englishVoice ?? voices[0] ?? null);
      setSpeechSupported(true);
    };

    chooseVoice();
    synth.addEventListener('voiceschanged', chooseVoice);
    synth.onvoiceschanged = chooseVoice;

    return () => {
      synth.removeEventListener('voiceschanged', chooseVoice);
      synth.onvoiceschanged = null;
    };
  }, []);

  const lessonPlan = useMemo(
    () => buildLessonPlan(activeTeacherPlan, selectedTheme),
    [activeTeacherPlan, selectedTheme]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedValue = window.localStorage.getItem(getStorageKey(codename));

    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue) as StoredProgress;
        setProgressLevel(parsed.progressLevel ?? defaultProgressState.progressLevel);
        setCurrentRoomIndex(parsed.currentRoomIndex ?? defaultProgressState.currentRoomIndex);
        setCompletedRooms(parsed.completedRooms ?? defaultProgressState.completedRooms);
        setEarnedBadges(parsed.earnedBadges ?? defaultProgressState.earnedBadges);
        setRevisionCompleted(parsed.revisionCompleted ?? defaultProgressState.revisionCompleted);
        setReflectionCompleted(parsed.reflectionCompleted ?? defaultProgressState.reflectionCompleted);
      } catch (error) {
        console.error('Unable to read saved progress', error);
        setProgressLevel(defaultProgressState.progressLevel);
        setCurrentRoomIndex(defaultProgressState.currentRoomIndex);
        setCompletedRooms(defaultProgressState.completedRooms);
        setEarnedBadges(defaultProgressState.earnedBadges);
        setRevisionCompleted(defaultProgressState.revisionCompleted);
        setReflectionCompleted(defaultProgressState.reflectionCompleted);
      }
    } else {
      setProgressLevel(defaultProgressState.progressLevel);
      setCurrentRoomIndex(defaultProgressState.currentRoomIndex);
      setCompletedRooms(defaultProgressState.completedRooms);
      setEarnedBadges(defaultProgressState.earnedBadges);
      setRevisionCompleted(defaultProgressState.revisionCompleted);
      setReflectionCompleted(defaultProgressState.reflectionCompleted);
    }

    setHasHydrated(true);
  }, [codename]);

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') return;

    const storedProgress: StoredProgress = {
      progressLevel,
      currentRoomIndex,
      earnedBadges,
      completedRooms,
      revisionCompleted,
      reflectionCompleted
    };

    window.localStorage.setItem(getStorageKey(codename), JSON.stringify(storedProgress));
  }, [codename, progressLevel, currentRoomIndex, earnedBadges, completedRooms, revisionCompleted, reflectionCompleted, hasHydrated]);

  useEffect(() => {
    setScaffoldingEnabled(activeTeacherPlan.schedulePreset !== 'free-write-day');
    setSkipForAdvanced(
      activeTeacherPlan.difficultyTier === 'challenge' || activeTeacherPlan.schedulePreset === 'challenge-day'
    );
  }, [activeTeacherPlan.schedulePreset, activeTeacherPlan.difficultyTier]);

  const addBadge = (badgeToAdd: EarnedBadge) => {
    setEarnedBadges((prev) => ensureBadge(prev, badgeToAdd));
  };

  const completeCurrentRoom = () => {
    const nextState = completeRoomProgress({
      currentRoomIndex,
      progressLevel,
      completedRooms,
      earnedBadges
    });

    setEarnedBadges(nextState.earnedBadges);
    setCompletedRooms(nextState.completedRooms);
    setProgressLevel(nextState.progressLevel);
    setCurrentRoomIndex(nextState.currentRoomIndex);
  };

  const goToRoom = (roomIndex: number) => {
    setCurrentRoomIndex(roomIndex);
  };

  const redoRoom = (roomIndex: number) => {
    setProgressLevel(roomIndex);
    setCurrentRoomIndex(roomIndex);

    const reopenedRooms = new Set(rooms.slice(roomIndex).map((room) => room.id));
    setCompletedRooms((prev) => prev.filter((roomId) => !reopenedRooms.has(roomId)));
  };

  const progress = Math.round((progressLevel / rooms.length) * 100);
  const progressMapNodes = rooms.map((room, index) => {
    const isComplete = completedRooms.includes(room.id);
    const isActive = currentRoomIndex === index && !isComplete;

    return {
      ...room,
      status: isComplete ? 'done' : isActive ? 'active' : 'locked'
    };
  });

  const handleRevision = () => {
    if (revisionCompleted) return;
    setRevisionCompleted(true);
    addBadge({ id: 'revision-ready', label: 'Revise Ranger', detail: 'You tried a swap and made the writing clearer.' });
  };

  const handleReflection = () => {
    if (reflectionCompleted) return;
    setReflectionCompleted(true);
    addBadge({
      id: 'reflection-hero',
      label: 'Reflective Thinker',
      detail: 'You noticed what changed and why it mattered.'
    });
  };

  const speakStep = (stepId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeVoice?.lang ?? 'en-US';
    utterance.voice = activeVoice ?? null;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingId((current) => (current === stepId ? null : current));
    utterance.onerror = () => setSpeakingId((current) => (current === stepId ? null : current));

    setSpeakingId(stepId);
    synth.speak(utterance);
  };

  const correctVocabulary = vocabulary.filter((item) => vocabAnswers[item.word] === item.correct).length;

  return (
    <div className="escape-shell">
      <header className="escape-hero">
        <div>
          <p className="badge">The Lexicon Detective Escape Room</p>
          <h1>Untangle the story and unlock the final door</h1>
          <p className="small">Short missions, bright clues, and calm pacing so a 6th grader stays curious—not overwhelmed.</p>
          <div className="status-chips" role="status" aria-label="Room pace and mood">
            <span className="chip">⭐ Fun levels are safe</span>
            <span className="chip">🪴 Calm pacing</span>
            <span className="chip">🧠 Thinking in steps</span>
          </div>
        </div>
        <div className="callout">
          <p className="small">Action</p>
          <h3>Invite a friend to help</h3>
          <p className="small">Two brains, one puzzle. Share your codename and split the rooms.</p>
          <CTAButton href="#rooms" ariaLabel="Jump to investigation list">
            Start the investigation
          </CTAButton>
        </div>
      </header>

      <div className="escape-grid" id="rooms">
        <div className="column">
          <Section
            title="Teacher plan in effect"
            subtitle="Difficulty tier and schedule presets from the dashboard apply to this class"
          >
            <div className="card" aria-live="polite">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
                <div>
                  <p className="small">Class</p>
                  <select
                    value={selectedClass}
                    onChange={(event) => setSelectedClass(event.target.value)}
                    aria-label="Select class plan"
                  >
                    {classSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="small">Difficulty tier</p>
                  <p>{difficultyLabels[activeTeacherPlan.difficultyTier]}</p>
                </div>
                <div>
                  <p className="small">Schedule preset</p>
                  <p>{scheduleLabels[activeTeacherPlan.schedulePreset]}</p>
                </div>
              </div>
              <div className="status-list" style={{ marginTop: '1rem' }}>
                <div>
                  <p className="small">Prompt students see</p>
                  <p>{lessonPlan.prompt}</p>
                </div>
                <div>
                  <p className="small">Guardrail + scaffolds</p>
                  <p>{lessonPlan.guardrail}</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Navigate the investigation" subtitle="Follow the four rooms in order">
            <p className="small">
              The system tracks completion. Finish the active room to move the progress bar, and
              choose &ldquo;Redo room&rdquo; if you want the system to reopen a finished step.
            </p>
            <div className="card-list">
              {rooms.map((room, index) => {
                const isComplete = systemCompletedRooms.includes(room.id);
                const isActive = currentRoomIndex === index;

                return (
                <div className="card room-card" key={room.id}>
                  <div className="room-header">
                    <div>
                      <p className="small">Room focus: {room.focus}</p>
                      <h3>{room.title}</h3>
                      <p className="small">
                        System status:{' '}
                        {isComplete ? 'Done' : isActive ? 'In progress—system watching' : 'Waiting in order'}
                      </p>
                    </div>
                    <div className="room-actions">
                      {isActive ? (
                        <button
                          className="button"
                          onClick={completeCurrentRoom}
                          aria-label={`System complete ${room.title} and move forward`}
                          disabled={isComplete}
                        >
                          System: complete room
                        </button>
                      ) : (
                        <button
                          className="button secondary"
                          onClick={() => goToRoom(index)}
                          aria-label={`Open ${room.title} to work on it next`}
                        >
                          Go to this room
                        </button>
                      )}
                      {isComplete && (
                        <button
                          className="button secondary"
                          onClick={() => redoRoom(index)}
                          aria-label={`Redo ${room.title}`}
                        >
                          Redo room
                        </button>
                      )}
                    </div>
                  </div>
                  <ul role="list" className="task-list">
                    {room.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                  <p className="small">Action: {room.action}</p>
                </div>
                );
              })}
            </div>
          </Section>

          <Section
            title="Scaffolded challenge flow"
            subtitle="Short micro-steps before you submit the room"
          >
            <div className="card">
              <div className="scaffold-controls" role="group" aria-label="Scaffolding controls">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={scaffoldingEnabled}
                    onChange={(event) => setScaffoldingEnabled(event.target.checked)}
                  />
                  <span>Show steps for students</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={skipForAdvanced}
                    onChange={(event) => setSkipForAdvanced(event.target.checked)}
                    disabled={!scaffoldingEnabled}
                  />
                  <span>Skip scaffolding for advanced class</span>
                </label>
              </div>
              <p className="small" aria-live="polite">
                Teacher dashboard plan: {scheduleLabels[activeTeacherPlan.schedulePreset]} with{' '}
                {difficultyLabels[activeTeacherPlan.difficultyTier].toLowerCase()}. Scaffolds auto-trim to match.
              </p>

              {scaffoldingEnabled && !skipForAdvanced ? (
                <>
                  <ol className="micro-steps">
                    {lessonPlan.scaffolds.map((step, index) => (
                      <li key={step.id} className="micro-step">
                        <div className="micro-step-header">
                          <div className="micro-step-number" aria-label={`Step ${index + 1}`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="micro-step-title">
                              <span>{step.title}</span>
                              <span
                                className="tooltip-trigger"
                                role="img"
                                aria-label={step.tooltip}
                                title={step.tooltip}
                              >
                                ℹ️
                              </span>
                            </div>
                            <p className="small">{step.prompt}</p>
                          </div>
                        </div>
                        <p className="small">Sample: {step.sample}</p>
                        <div className="micro-step-actions">
                          <button
                            className="read-button"
                            type="button"
                            onClick={() =>
                              speakStep(
                                step.id,
                                `${step.title}. ${step.prompt} Tip: ${step.tooltip}. Sample: ${step.sample}`
                              )
                            }
                            disabled={!speechSupported}
                            aria-label={`Read ${step.title} instructions aloud`}
                          >
                            <span aria-hidden>{speakingId === step.id ? '🔊' : '🗣️'}</span>
                            Read to me
                          </button>
                          {!speechSupported && <span className="small">Audio not available in this browser.</span>}
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="micro-actions">
                    <div className="micro-action-card">
                      <div>
                        <p className="small">Revise checkpoint</p>
                        <p className="small">Swap one word and tell the system you revised.</p>
                      </div>
                      <button className="button" onClick={handleRevision} disabled={revisionCompleted}>
                        {revisionCompleted ? 'Marked' : 'Mark revise complete'}
                      </button>
                    </div>
                    <div className="micro-action-card">
                      <div>
                        <p className="small">Reflect checkpoint</p>
                        <p className="small">Write why the change helps and log it.</p>
                      </div>
                      <button className="button secondary" onClick={handleReflection} disabled={reflectionCompleted}>
                        {reflectionCompleted ? 'Marked' : 'Mark reflect complete'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="small" aria-live="polite">
                  Scaffolding is off. Students can jump straight to the room submission while teachers monitor pacing.
                </p>
              )}
            </div>
          </Section>

          <Section title="Set your detective badge" subtitle="Stay focused with a simple identity and saved progress">
            <div className="card">
              <div className="badge-grid">
                {identityBadges.map((name) => (
                  <button
                    key={name}
                    className={`pill ${badge === name ? 'pill-active' : ''}`}
                    onClick={() => setBadge(name)}
                    aria-pressed={badge === name}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div className="codename-inputs">
                <label htmlFor="codename">Codename</label>
                <input
                  id="codename"
                  value={codename}
                  onChange={(e) => setCodename(e.target.value)}
                  aria-label="Enter your codename"
                />
                <p className="small" aria-live="polite">
                  Progress and badges save on this device for the codename above.
                </p>
                <label htmlFor="response">Quick rewrite practice</label>
                <textarea
                  id="response"
                  rows={3}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type a one-sentence rewrite of the clue."
                />
              </div>
            </div>
          </Section>

          <Section title="Vocabulary vault" subtitle="Match each word to the right idea">
            <div className="card">
              <div className="vault-grid">
                {vocabulary.map((item) => (
                  <div key={item.word} className="vault-row">
                    <div>
                      <p className="small">{item.word}</p>
                      <p>{item.prompt}</p>
                    </div>
                    <label className="small" htmlFor={`select-${item.word}`}>
                      Choose a match
                    </label>
                    <select
                      id={`select-${item.word}`}
                      value={vocabAnswers[item.word] ?? ''}
                      onChange={(e) =>
                        setVocabAnswers((prev) => ({ ...prev, [item.word]: e.target.value }))
                      }
                    >
                      <option value="">Select</option>
                      {item.choices.map((choice) => (
                        <option key={choice} value={choice}>
                          {choice}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <p className="small" aria-live="polite">
                {correctVocabulary === vocabulary.length
                  ? 'Vault unlocked! Every word is matched.'
                  : `${correctVocabulary} of ${vocabulary.length} matches feel solid.`}
              </p>
            </div>
          </Section>
        </div>

        <div className="column">
          <div className="card map-card">
            <div className="map-header">
              <div>
                <p className="small">Writer map</p>
                <h3>{currentWriterLevel.label}</h3>
                <p className="small">{currentWriterLevel.detail}</p>
              </div>
              <div className="level-chip">Level up by finishing rooms, revising, and reflecting.</div>
            </div>
            <div className="progress-map" role="img" aria-label={`Progress map: ${progressLevel} of ${rooms.length} rooms done`}>
              {progressMapNodes.map((room, index) => (
                <div className="map-segment" key={room.id}>
                  <div className={`map-node ${room.status}`}>
                    <span className="map-step">Room {index + 1}</span>
                    <strong>{room.title}</strong>
                    <p className="small">
                      {room.status === 'done'
                        ? 'Finished—badge locked in'
                        : room.status === 'active'
                          ? 'Working now'
                          : 'Waiting its turn'}
                    </p>
                  </div>
                  {index < progressMapNodes.length - 1 && <div className="map-connector" aria-hidden />}
                </div>
              ))}
            </div>
            <div className="checkpoint-row">
              <div className={`checkpoint ${revisionCompleted ? 'checkpoint-done' : ''}`}>
                <p className="small">Revise badge</p>
                <p className="small">{revisionCompleted ? 'Logged' : 'Mark revise complete to earn it.'}</p>
              </div>
              <div className={`checkpoint ${reflectionCompleted ? 'checkpoint-done' : ''}`}>
                <p className="small">Reflect badge</p>
                <p className="small">{reflectionCompleted ? 'Logged' : 'Mark reflect complete to earn it.'}</p>
              </div>
            </div>
            <div className="earned-badges">
              <p className="small">Badges earned</p>
              {earnedBadges.length ? (
                <ul className="badge-list" role="list">
                  {earnedBadges.map((earned) => (
                    <li key={earned.id} className="earned-badge">
                      <span aria-hidden>🏅</span>
                      <div>
                        <strong>{earned.label}</strong>
                        <p className="small">{earned.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="small">Badges will appear as you finish rooms, revise, and reflect.</p>
              )}
            </div>
          </div>

          <div className="card status-card">
            <div className="progress-wrap">
              <div>
                <p className="small">Room progress</p>
                <h3>{progress}% steady</h3>
              </div>
              <div className="progress" aria-label={`Progress ${progress}%`} role="img">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
              <div className="status-list">
                <div>
                  <p className="small">Most recent feedback</p>
                  <p>“{sandboxChallenge.aiFeedback.highlights[0]}”</p>
                </div>
                <div>
                  <p className="small">Pace</p>
                  <p>Slow is smooth. Try one clue at a time.</p>
                </div>
            </div>
            <div className="status-actions">
              <button className="button">Ask for a hint</button>
              <button className="button secondary">Pause for a stretch</button>
            </div>
          </div>

          <div className="card">
            <h3>Escape room rules</h3>
            <ul role="list" className="task-list">
              <li>Use inside voices; teammates need calm to think.</li>
              <li>Write your own ideas—no copy/paste.</li>
              <li>Check in with your partner before finishing a room.</li>
            </ul>
            <p className="small">Need to step out? Leave your codename so we can save your spot.</p>
          </div>

          <div className="card">
            <h3>Expect a friend to ask…</h3>
            <ul role="list" className="task-list">
              <li>How do you know the order is correct?</li>
              <li>Which clue told you who was speaking?</li>
              <li>What change would make the email sound kinder?</li>
            </ul>
            <CTAButton href="/pricing" variant="secondary">
              Share this demo
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}
