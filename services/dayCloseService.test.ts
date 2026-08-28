import { addDaysToDateString, todayLocalDate } from '@/utils/dateUtils';

const mockGetLogForDate = jest.fn();
const mockCreateMissedLog = jest.fn().mockResolvedValue({});
const mockGetStreakState = jest.fn();
const mockRecordMissedDay = jest.fn().mockResolvedValue({});

jest.mock('@/services/dailyLogService', () => ({
  getLogForDate: (...args: unknown[]) => mockGetLogForDate(...args),
  createMissedLog: (...args: unknown[]) => mockCreateMissedLog(...args),
}));

jest.mock('@/services/streakService', () => ({
  getStreakState: (...args: unknown[]) => mockGetStreakState(...args),
  recordMissedDay: (...args: unknown[]) => mockRecordMissedDay(...args),
}));

import { runDayCloseCheck } from './dayCloseService';

const today = todayLocalDate();

beforeEach(() => {
  jest.clearAllMocks();
  mockGetLogForDate.mockResolvedValue(null);
});

describe('runDayCloseCheck', () => {
  it('does nothing on a fresh install (no lastLoggedDate)', async () => {
    mockGetStreakState.mockResolvedValue({
      currentStreak: 0,
      longestStreak: 0,
      lastLoggedDate: null,
      streakBrokenPendingAck: false,
    });
    const result = await runDayCloseCheck();
    expect(result.daysMissed).toBe(0);
    expect(mockRecordMissedDay).not.toHaveBeenCalled();
  });

  it('does nothing when already logged today', async () => {
    mockGetStreakState.mockResolvedValue({
      currentStreak: 3,
      longestStreak: 3,
      lastLoggedDate: today,
      streakBrokenPendingAck: false,
    });
    const result = await runDayCloseCheck();
    expect(result.daysMissed).toBe(0);
    expect(mockRecordMissedDay).not.toHaveBeenCalled();
  });

  it("does not mark a miss when yesterday was logged — today's window is still open", async () => {
    mockGetStreakState.mockResolvedValue({
      currentStreak: 3,
      longestStreak: 3,
      lastLoggedDate: addDaysToDateString(today, -1),
      streakBrokenPendingAck: false,
    });
    const result = await runDayCloseCheck();
    expect(result.daysMissed).toBe(0);
    expect(mockRecordMissedDay).not.toHaveBeenCalled();
  });

  it('marks each unlogged day in the gap as missed and resets the streak once', async () => {
    mockGetStreakState.mockResolvedValue({
      currentStreak: 5,
      longestStreak: 12,
      lastLoggedDate: addDaysToDateString(today, -3),
      streakBrokenPendingAck: false,
    });
    const result = await runDayCloseCheck();
    expect(result.daysMissed).toBe(2);
    expect(mockCreateMissedLog).toHaveBeenCalledTimes(2);
    expect(mockCreateMissedLog).toHaveBeenCalledWith(addDaysToDateString(today, -2));
    expect(mockCreateMissedLog).toHaveBeenCalledWith(addDaysToDateString(today, -1));
    expect(mockRecordMissedDay).toHaveBeenCalledTimes(1);
  });

  it('skips creating a missed log for a gap day that already has one', async () => {
    mockGetStreakState.mockResolvedValue({
      currentStreak: 5,
      longestStreak: 12,
      lastLoggedDate: addDaysToDateString(today, -2),
      streakBrokenPendingAck: false,
    });
    mockGetLogForDate.mockResolvedValueOnce({
      date: addDaysToDateString(today, -1),
      type: 'missed',
    });

    const result = await runDayCloseCheck();
    expect(result.daysMissed).toBe(1);
    expect(mockCreateMissedLog).not.toHaveBeenCalled();
    expect(mockRecordMissedDay).toHaveBeenCalledTimes(1);
  });
});
