import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import KidModePlanner from '../KidModePlanner';
import { defaultTeacherClassSetting, teacherStorageKey } from '../../lib/classSettings';

describe('KidModePlanner', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads stored kid mode state and persists updates', async () => {
    const storedSettings = {
      'Period 2 · ELA': { ...defaultTeacherClassSetting(), kidModeEnabled: false }
    };
    window.localStorage.setItem(teacherStorageKey, JSON.stringify(storedSettings));

    render(<KidModePlanner />);

    const toggle = (await screen.findByLabelText('Toggle Kid Mode for this class')) as HTMLInputElement;
    expect(toggle.checked).toBe(false);
    expect(screen.getByText(/Kid Mode is off/)).toBeTruthy();

    fireEvent.click(toggle);

    await waitFor(() => expect(toggle.checked).toBe(true));
    expect(screen.getByText(/Kid Mode is on/)).toBeTruthy();

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(teacherStorageKey) ?? '{}');
      expect(saved['Period 2 · ELA'].kidModeEnabled).toBe(true);
    });
  });
});
