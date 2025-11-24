'use client';

import { useMemo, useState } from 'react';
import CTAButton from '../../components/CTAButton';
import Section from '../../components/Section';
import { sandboxChallenge } from '../../lib/navigation';

const badges = ['Rookie Detective', 'Clue Collector', 'Signal Scout', 'Puzzle Pilot'];

const rooms = [
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

export default function ExperienceSandbox() {
  const [codename, setCodename] = useState('Skyline Fox');
  const [badge, setBadge] = useState('Rookie Detective');
  const [response, setResponse] = useState('');
  const [progressLevel, setProgressLevel] = useState(0);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [vocabAnswers, setVocabAnswers] = useState<Record<string, string>>({});

  const randomPrompt = useMemo(() => sandboxChallenge, []);

  const systemCompletedRooms = useMemo(
    () => rooms.slice(0, progressLevel).map((room) => room.id),
    [progressLevel]
  );

  const completeCurrentRoom = () => {
    const nextProgress = Math.max(progressLevel, currentRoomIndex + 1);
    setProgressLevel(Math.min(nextProgress, rooms.length));
    setCurrentRoomIndex((prev) => Math.min(prev + 1, rooms.length - 1));
  };

  const goToRoom = (roomIndex: number) => {
    setCurrentRoomIndex(roomIndex);
  };

  const redoRoom = (roomIndex: number) => {
    setProgressLevel(roomIndex);
    setCurrentRoomIndex(roomIndex);
  };

  const progress = Math.round((progressLevel / rooms.length) * 100);

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

          <Section title="Set your detective badge" subtitle="Stay focused with a simple identity">
            <div className="card">
              <div className="badge-grid">
                {badges.map((name) => (
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
                <p>“{randomPrompt.aiFeedback.highlights[0]}”</p>
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
