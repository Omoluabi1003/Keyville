'use client';

import { useEffect, useMemo, useState } from 'react';
import { kidThemes } from '../lib/kidThemes';
import { sandboxChallenge } from '../lib/navigation';
import {
  classSections,
  defaultTeacherClassSetting,
  difficultyLabels,
  scheduleLabels,
  schedulePromptAdds,
  teacherStorageKey,
  tierPromptAdds,
  type DifficultyTier,
  type SchedulePreset,
  type TeacherClassSetting
} from '../lib/classSettings';

type StoredClassSettings = Record<string, TeacherClassSetting>;

const getDefaultMap = (): StoredClassSettings =>
  classSections.reduce<StoredClassSettings>((map, section) => {
    map[section] = defaultTeacherClassSetting();
    return map;
  }, {});

export default function KidModePlanner() {
  const [selectedClass, setSelectedClass] = useState(classSections[1]);
  const [classSettings, setClassSettings] = useState<StoredClassSettings>(getDefaultMap);

  const updateClassSettings = (partial: Partial<TeacherClassSetting>) => {
    setClassSettings((prev) => {
      const existing = prev[selectedClass] ?? defaultTeacherClassSetting();
      const updated = { ...existing, ...partial };
      return { ...prev, [selectedClass]: updated };
    });
  };

  const selectedClassSettings = classSettings[selectedClass] ?? defaultTeacherClassSetting();
  const { kidModeEnabled, selectedThemeId, promptIndex, difficultyTier, schedulePreset } = selectedClassSettings;

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

    const complexityAdd = tierPromptAdds[difficultyTier];
    const scheduleAdd = schedulePromptAdds[schedulePreset];

    return {
      label: `${selectedTheme.name} prompt`,
      body: `${selectedTheme.starterPrompts[promptIndex % themePromptCount]} ${complexityAdd} ${scheduleAdd}`,
      note: `${selectedTheme.guardrail} · Scaffold depth: ${difficultyTier === 'foundational' ? 'Full steps' : difficultyTier === 'standard' ? 'Balanced steps' : 'Condensed steps'}`
    };
  }, [kidModeEnabled, promptIndex, selectedTheme, themePromptCount, difficultyTier, schedulePreset]);

  const cyclePrompt = () => {
    if (!kidModeEnabled || !themePromptCount) return;
    updateClassSettings({ promptIndex: (promptIndex + 1) % themePromptCount });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedValue = window.localStorage.getItem(teacherStorageKey);
      if (storedValue) {
        const parsed = JSON.parse(storedValue) as StoredClassSettings;
        setClassSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Unable to read teacher dashboard settings', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(teacherStorageKey, JSON.stringify(classSettings));
  }, [classSettings]);

  return (
    <div className="card" aria-live="polite">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p className="small">Class</p>
          <select
            value={selectedClass}
            onChange={(event) => {
              const nextClass = event.target.value;
              setClassSettings((prev) => ({
                ...prev,
                [nextClass]: prev[nextClass] ?? defaultTeacherClassSetting()
              }));
              setSelectedClass(nextClass);
            }}
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
            onChange={(event) => updateClassSettings({ kidModeEnabled: event.target.checked })}
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
        <div>
          <p className="small">Difficulty tier</p>
          <p>{difficultyLabels[difficultyTier]}</p>
        </div>
        <div>
          <p className="small">Schedule preset</p>
          <p>{scheduleLabels[schedulePreset]}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
          <div>
            <p className="small">Difficulty tier</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(Object.keys(difficultyLabels) as DifficultyTier[]).map((tier) => (
                <button
                  key={tier}
                  className={`pill ${difficultyTier === tier ? 'pill-active' : ''}`}
                  onClick={() => updateClassSettings({ difficultyTier: tier })}
                  aria-pressed={difficultyTier === tier}
                >
                  {difficultyLabels[tier]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="small">Schedule preset</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(Object.keys(scheduleLabels) as SchedulePreset[]).map((preset) => (
                <button
                  key={preset}
                  className={`pill ${schedulePreset === preset ? 'pill-active' : ''}`}
                  onClick={() => updateClassSettings({ schedulePreset: preset })}
                  aria-pressed={schedulePreset === preset}
                >
                  {scheduleLabels[preset]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="small" style={{ marginTop: '0.75rem' }}>
          Tiers change prompt complexity and scaffold depth. Presets save automatically per class so student sessions load the
          right plan.
        </p>
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
                    updateClassSettings({ selectedThemeId: theme.id, promptIndex: 0 });
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
