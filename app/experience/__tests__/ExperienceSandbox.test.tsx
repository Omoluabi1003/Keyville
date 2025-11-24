import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import ExperienceSandbox from '../ExperienceSandbox';
import { defaultTeacherClassSetting, teacherStorageKey } from '../../../lib/classSettings';

describe('ExperienceSandbox teacher settings', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('applies stored teacher plan to lesson plan and guardrails', async () => {
    const storedPlan = {
      'Period 2 · ELA': {
        ...defaultTeacherClassSetting(),
        difficultyTier: 'challenge',
        schedulePreset: 'free-write-day',
        selectedThemeId: 'fantasy',
        promptIndex: 1
      }
    };

    window.localStorage.setItem(teacherStorageKey, JSON.stringify(storedPlan));

    render(<ExperienceSandbox />);

    const difficulty = await screen.findByText('Challenge (richer prompts, tighter scaffolds)');
    expect(difficulty).toBeTruthy();

    expect(screen.getByText('Free write day')).toBeTruthy();

    const guardrail = await screen.findByText(/Scaffold depth:/);
    expect(guardrail.textContent).toContain('Scaffold depth:');
    expect(guardrail.textContent).toContain('age-appropriate');

    const prompt = await screen.findByText(/Free write day:/);
    expect(prompt.textContent).toContain('Free write day:');
  });
});
