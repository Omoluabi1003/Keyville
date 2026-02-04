export const teacherStorageKey = 'kv-teacher-plan';

export const classSections = ['Period 1 · ELA', 'Period 2 · ELA', 'Period 3 · ELA', 'Period 4 · SS'];
export const difficultyLabels: Record<DifficultyTier, string> = {
  foundational: 'Foundational',
  standard: 'Standard',
  challenge: 'Challenge'
};
export const scheduleLabels: Record<SchedulePreset, string> = {
  default: 'Default',
  'mixed-mode': 'Mixed Mode',
  'free-write-day': 'Free Write Day'
};
export const tierPromptAdds: Record<DifficultyTier, string> = {
  foundational: 'Focus on clear, simple sentences.',
  standard: 'Add one sensory detail.',
  challenge: 'Use a metaphor or simile.'
};
export const schedulePromptAdds: Record<SchedulePreset, string> = {
  default: '',
  'mixed-mode': 'Include one sentence of choice at the end.',
  'free-write-day': 'Write freely on this topic for 5 minutes.'
};

export type DifficultyTier = 'foundational' | 'standard' | 'challenge';
export type SchedulePreset = 'default' | 'mixed-mode' | 'free-write-day';
export type TeacherClassSetting = {
  kidModeEnabled: boolean;
  selectedThemeId: string;
  promptIndex: number;
  difficultyTier: DifficultyTier;
  schedulePreset: SchedulePreset;
};

export const defaultTeacherClassSetting = (): TeacherClassSetting => ({
  kidModeEnabled: false,
  selectedThemeId: 'fantasy',
  promptIndex: 0,
  difficultyTier: 'standard',
  schedulePreset: 'default'
});
