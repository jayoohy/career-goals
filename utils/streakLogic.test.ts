import { applyDayLogged, applyMissedDay } from './streakLogic';

import type { StreakState } from '@/types/models';

function makeState(overrides: Partial<StreakState> = {}): StreakState {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastLoggedDate: null,
    streakBrokenPendingAck: false,
    ...overrides,
  };
}

describe('applyDayLogged', () => {
  it('starts a new streak at 1 on the first-ever log', () => {
    const result = applyDayLogged(makeState(), '2026-08-21');
    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastLoggedDate: '2026-08-21',
    });
  });

  it('increments on a consecutive day', () => {
    const state = makeState({
      currentStreak: 5,
      longestStreak: 10,
      lastLoggedDate: '2026-08-20',
    });
    const result = applyDayLogged(state, '2026-08-21');
    expect(result.currentStreak).toBe(6);
    expect(result.longestStreak).toBe(10);
    expect(result.lastLoggedDate).toBe('2026-08-21');
  });

  it('raises longestStreak once currentStreak overtakes it', () => {
    const state = makeState({
      currentStreak: 9,
      longestStreak: 9,
      lastLoggedDate: '2026-08-20',
    });
    const result = applyDayLogged(state, '2026-08-21');
    expect(result.currentStreak).toBe(10);
    expect(result.longestStreak).toBe(10);
  });

  it('restarts at 1 after a gap of more than one day', () => {
    const state = makeState({
      currentStreak: 5,
      longestStreak: 20,
      lastLoggedDate: '2026-08-15',
    });
    const result = applyDayLogged(state, '2026-08-21');
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(20);
    expect(result.lastLoggedDate).toBe('2026-08-21');
  });

  it('is idempotent when the same day is logged twice', () => {
    const state = makeState({
      currentStreak: 3,
      longestStreak: 3,
      lastLoggedDate: '2026-08-21',
    });
    const result = applyDayLogged(state, '2026-08-21');
    expect(result).toEqual({
      currentStreak: 3,
      longestStreak: 3,
      lastLoggedDate: '2026-08-21',
    });
  });
});

describe('applyMissedDay', () => {
  it('resets a positive streak to 0 and flags the break', () => {
    const state = makeState({ currentStreak: 7, longestStreak: 23 });
    const result = applyMissedDay(state);
    expect(result).toEqual({ currentStreak: 0, streakBrokenPendingAck: true });
  });

  it('does not flag a break when the streak was already 0', () => {
    const state = makeState({ currentStreak: 0, longestStreak: 23 });
    const result = applyMissedDay(state);
    expect(result).toEqual({ currentStreak: 0, streakBrokenPendingAck: false });
  });
});
