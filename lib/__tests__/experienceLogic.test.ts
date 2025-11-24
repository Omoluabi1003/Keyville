import { describe, expect, it } from 'vitest';
import {
  buildLessonPlan,
  calculateScaffoldDepth,
  completeRoomProgress,
  ensureBadge,
  rooms,
  scaffoldSteps,
  type RoomProgressState
} from '../../app/experience/ExperienceSandbox';
import { defaultTeacherClassSetting } from '../classSettings';
import { kidThemes } from '../kidThemes';

describe('lesson plan scaffolds', () => {
  it('adjusts scaffold depth based on difficulty and schedule', () => {
    const foundationalDepth = calculateScaffoldDepth({
      ...defaultTeacherClassSetting(),
      difficultyTier: 'foundational',
      schedulePreset: 'mixed-mode'
    });
    expect(foundationalDepth).toBe(scaffoldSteps.length);

    const standardDepth = calculateScaffoldDepth({
      ...defaultTeacherClassSetting(),
      difficultyTier: 'standard',
      schedulePreset: 'mixed-mode'
    });
    expect(standardDepth).toBe(Math.max(scaffoldSteps.length - 1, 4));

    const challengeDepth = calculateScaffoldDepth({
      ...defaultTeacherClassSetting(),
      difficultyTier: 'challenge',
      schedulePreset: 'free-write-day'
    });
    expect(challengeDepth).toBe(Math.max(scaffoldSteps.length - 3, 2));
  });

  it('builds a lesson plan using kid themes and scaffold slices', () => {
    const fantasyTheme = kidThemes.find((theme) => theme.id === 'fantasy');
    const plan = buildLessonPlan(
      {
        ...defaultTeacherClassSetting(),
        kidModeEnabled: true,
        selectedThemeId: fantasyTheme?.id ?? '',
        difficultyTier: 'standard',
        schedulePreset: 'mixed-mode',
        promptIndex: 2
      },
      fantasyTheme
    );

    expect(plan.prompt).toContain('Mixed mode: include one sentence of choice at the end.');
    expect(plan.guardrail).toContain('Scaffold depth:');
    expect(plan.scaffolds).toEqual(scaffoldSteps.slice(0, plan.scaffolds.length));
  });
});

describe('badge awarding logic', () => {
  const baseState: RoomProgressState = {
    currentRoomIndex: 0,
    progressLevel: 0,
    completedRooms: [],
    earnedBadges: []
  };

  it('adds a room completion badge only once', () => {
    const firstCompletion = completeRoomProgress(baseState, rooms);
    expect(firstCompletion.completedRooms).toContain(rooms[0].id);
    expect(firstCompletion.earnedBadges).toHaveLength(1);

    const repeatCompletion = completeRoomProgress({
      ...baseState,
      completedRooms: firstCompletion.completedRooms,
      earnedBadges: firstCompletion.earnedBadges
    }, rooms);

    expect(repeatCompletion.earnedBadges).toHaveLength(1);
    expect(repeatCompletion.completedRooms).toHaveLength(1);
  });

  it('ignores duplicate badges added directly', () => {
    const badgeList = ensureBadge([], { id: 'test', label: 'Test', detail: 'Only once' });
    const duplicateList = ensureBadge(badgeList, { id: 'test', label: 'Test', detail: 'Only once' });

    expect(duplicateList).toHaveLength(1);
  });
});
