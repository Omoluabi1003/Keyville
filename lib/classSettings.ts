import { kidThemes } from './kidThemes';

export const classSections = ['Period 1 · Advisory', 'Period 2 · ELA', 'After-school writing club'];

export type DifficultyTier = 'foundational' | 'standard' | 'challenge';
export type SchedulePreset = 'challenge-day' | 'free-write-day' | 'mixed-mode';

export const difficultyLabels: Record<DifficultyTier, string> = {
  foundational: 'Foundational (short prompts, extra scaffolds)',
  standard: 'On-level (balanced prompts + scaffolds)',
  challenge: 'Challenge (richer prompts, tighter scaffolds)'
};

export const scheduleLabels: Record<SchedulePreset, string> = {
  'challenge-day': 'Challenge day',
  'free-write-day': 'Free write day',
  'mixed-mode': 'Mixed mode'
};

export const tierPromptAdds: Record<DifficultyTier, string> = {
  foundational: 'Keep it short and add one feeling word.',
  standard: 'Include one vivid detail and a transition word.',
  challenge: 'Add a counter-move the antagonist plans and foreshadow one consequence.'
};

export const schedulePromptAdds: Record<SchedulePreset, string> = {
  'challenge-day': 'This is a timed “challenge day,” so add a new twist in two sentences.',
  'free-write-day': 'Free write day: let them choose the format but keep the antagonist voice.',
  'mixed-mode': 'Mixed mode: include one sentence of choice at the end.'
};

export type TeacherClassSetting = {
  kidModeEnabled: boolean;
  selectedThemeId: string;
  promptIndex: number;
  difficultyTier: DifficultyTier;
  schedulePreset: SchedulePreset;
};

export const defaultTeacherClassSetting = (): TeacherClassSetting => ({
  kidModeEnabled: true,
  selectedThemeId: kidThemes[0]?.id ?? '',
  promptIndex: 0,
  difficultyTier: 'standard',
  schedulePreset: 'mixed-mode'
});

export const teacherStorageKey = 'keyville-teacher-class-settings';
