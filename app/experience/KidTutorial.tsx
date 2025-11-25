'use client';

import { useMemo, useState } from 'react';
import Section from '../../components/Section';

const tutorialSteps = [
  {
    id: 'quest',
    title: 'Pick a quest',
    icon: '🧭',
    color: 'var(--accent)',
    actions: ['Tap the badge you like.', 'Say your codename out loud.'],
    vibe: 'Choose a room that feels fun—no wrong pick.'
  },
  {
    id: 'write',
    title: 'Write for a minute',
    icon: '✍️',
    color: '#7dd3ff',
    actions: ['Set a 60s timer.', 'Type without stopping.'],
    vibe: 'Speed write. Messy is okay—keep the words flowing.'
  },
  {
    id: 'hint',
    title: 'Get a hint',
    icon: '💡',
    color: '#ffb347',
    actions: ['Click “Hint” once.', 'Copy one idea you like.'],
    vibe: 'Use one nudge, then return to your words.'
  },
  {
    id: 'finish',
    title: 'High-five the room',
    icon: '🎉',
    color: '#8ef0c0',
    actions: ['Check one fix.', 'Press submit.'],
    vibe: 'Celebrate the small win and jump to the next quest.'
  }
];

export default function KidTutorial() {
  const [activeStepId, setActiveStepId] = useState(tutorialSteps[0].id);

  const activeStep = useMemo(
    () => tutorialSteps.find((step) => step.id === activeStepId) ?? tutorialSteps[0],
    [activeStepId]
  );

  const activeIndex = tutorialSteps.findIndex((step) => step.id === activeStep.id);
  const progress = Math.round(((activeIndex + 1) / tutorialSteps.length) * 100);

  return (
    <Section
      title="Kid quickstart"
      subtitle="A friendly loop for 6th graders: quest → write → hint → celebrate"
      id="kid-tutorial"
    >
      <div className="card kid-card">
        <div className="kid-card__intro" aria-live="polite">
          <div className="kid-card__badge" style={{ background: activeStep.color }} aria-hidden>
            <span>{activeStep.icon}</span>
          </div>
          <div>
            <p className="small" style={{ marginBottom: '0.25rem' }}>
              Tap a step below and follow the simple moves.
            </p>
            <h3 style={{ margin: 0 }}>{activeStep.title}</h3>
            <p className="small" style={{ marginTop: '0.25rem', color: 'var(--muted)' }}>
              {activeStep.vibe}
            </p>
          </div>
        </div>

        <div className="kid-card__steps" role="tablist" aria-label="Kid tutorial steps">
          {tutorialSteps.map((step, index) => {
            const isActive = step.id === activeStepId;

            return (
              <button
                key={step.id}
                role="tab"
                aria-selected={isActive}
                className={`kid-step ${isActive ? 'kid-step--active' : ''}`}
                onClick={() => setActiveStepId(step.id)}
              >
                <span className="kid-step__icon" aria-hidden>
                  {step.icon}
                </span>
                <div>
                  <div className="kid-step__label">
                    <span className="kid-step__index">{index + 1}</span>
                    <span>{step.title}</span>
                  </div>
                  <p className="tiny" style={{ margin: '0.25rem 0 0 0' }}>
                    {step.actions[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="kid-card__actions" aria-live="polite">
          {activeStep.actions.map((action) => (
            <div key={action} className="kid-action">
              <span className="kid-action__icon" aria-hidden>
                {activeStep.icon}
              </span>
              <span className="kid-action__text">{action}</span>
            </div>
          ))}
        </div>

        <div className="kid-progress" aria-label={`Step ${activeIndex + 1} of ${tutorialSteps.length}`}>
          <div className="kid-progress__bar" style={{ width: `${progress}%` }} />
          <div className="tiny" style={{ textAlign: 'center', marginTop: '0.35rem' }}>
            {progress}% ready for your first quest
          </div>
        </div>
      </div>
    </Section>
  );
}
