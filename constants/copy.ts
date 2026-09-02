/**
 * Fixed notification/weekly-review copy (PRD §5/§7/§10) — a well-written fixed set, not
 * AI-generated at runtime. Tone: direct, invested, no corporate cheeriness, no guilt.
 */

export interface NotificationCopy {
  title: string;
  body: string;
}

export const DAILY_COPY: Record<'open' | 'nudge' | 'softClose' | 'hardDeadline', NotificationCopy> =
  {
    open: {
      title: "Study window's open",
      body: '30 min, same as always.',
    },
    nudge: {
      title: 'Still time tonight',
      body: "10 minutes counts if that's what tonight has.",
    },
    softClose: {
      title: "Didn't get to it yet?",
      body: 'Still time before 10.',
    },
    hardDeadline: {
      title: "Today's not logged",
      body: 'Streak breaks at midnight if this stays empty.',
    },
  };

export const WEEKLY_REVIEW_COPY: NotificationCopy = {
  title: 'Weekly review',
  body: "Days logged, hours, what's next — take a look.",
};

export const JOB_READY_COPY: NotificationCopy = {
  title: "You're ready to apply.",
  body: 'You could start sending applications now. Everything left on the roadmap makes you stronger, not more hireable-vs-not.',
};

export function streakBreakLine(longestStreak: number): string {
  return `Streak's back to 0. Longest was ${longestStreak}.`;
}
