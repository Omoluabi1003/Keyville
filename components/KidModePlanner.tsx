'use client';

import { useMemo, useState } from 'react';
import { kidThemes } from '../lib/kidThemes';
import { sandboxChallenge } from '../lib/navigation';

const classSections = ['Period 1 · Advisory', 'Period 2 · ELA', 'After-school writing club'];

export default function KidModePlanner() {
  const [selectedClass, setSelectedClass] = useState(classSections[1]);
  const [kidModeEnabled, setKidModeEnabled] = useState(true);
  const [selectedThemeId, setSelectedThemeId] = useState(kidThemes[0]?.id ?? '');
  const [promptIndex, setPromptIndex] = useState(0);

  const selectedTheme = kidThemes.find((theme) => theme.id === selectedThemeId);
  const themePromptCount = selectedTheme?.starterPrompts.length ?? 0;

  const activePrompt = useMemo(() => {
    if (!kidModeEnabled || !selectedTheme) {
      return {
        label: 'Standard prompt',
        body: sandboxChallenge.prompt,
        note: 'Uses rubric-aligned language for older students.'
      };
    }

    return {
      label: `${selectedTheme.name} prompt`,
      body: selectedTheme.starterPrompts[promptIndex % themePromptCount],
      note: selectedTheme.guardrail
    };
  }, [kidModeEnabled, promptIndex, selectedTheme, themePromptCount]);

  const cyclePrompt = () => {
    if (!kidModeEnabled || !themePromptCount) return;
    setPromptIndex((prev) => (prev + 1) % themePromptCount);
  };

  return (
    <div className="card" aria-live="polite">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p className="small">Class</p>
          <select
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
            aria-label="Choose class section"
          >
            {classSections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        <label className="small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={kidModeEnabled}
            onChange={(event) => setKidModeEnabled(event.target.checked)}
            aria-label="Toggle Kid Mode for this class"
          />
          Kid Mode is {kidModeEnabled ? 'on' : 'off'}
        </label>
      </div>

      <div className="status-list" style={{ marginTop: '1rem' }}>
        <div>
          <p className="small">Kid Mode status</p>
          <p>
            {kidModeEnabled
              ? `${selectedClass} is using 6th-grade safe themes.`
              : `${selectedClass} sees standard prompts.`}
          </p>
        </div>
        <div>
          <p className="small">Active prompt source</p>
          <p>{activePrompt.label}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p className="small">Theme</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {kidThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`pill ${selectedThemeId === theme.id ? 'pill-active' : ''}`}
                  onClick={() => {
                    setSelectedThemeId(theme.id);
                    setPromptIndex(0);
                  }}
                  aria-pressed={selectedThemeId === theme.id}
                  disabled={!kidModeEnabled}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
          <button className="button" onClick={cyclePrompt} disabled={!kidModeEnabled || themePromptCount === 0}>
            Show next prompt
          </button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <p className="small">Prompt</p>
          <p>{activePrompt.body}</p>
          <p className="small" style={{ marginTop: '0.5rem' }}>
            {activePrompt.note}
          </p>
        </div>

        {kidModeEnabled && selectedTheme && (
          <div style={{ marginTop: '1rem' }}>
            <p className="small">Theme guidance</p>
            <p>{selectedTheme.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
