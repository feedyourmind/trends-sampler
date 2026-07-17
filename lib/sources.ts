// The curated sample. Each source is polled ONCE per day, and the runs are
// spread across the day (one source per scheduled hour, UTC) so the tool
// never bursts: 6 listing requests per day in total, plus the occasional
// save-by-URL. That is deliberately a small fraction of what the free tier
// allows.

export type Source =
  | { type: 'subreddit'; name: string }
  | { type: 'user'; name: string };

// Hour (UTC) -> source. Keep in sync with the cron schedule in vercel.json.
export const SCHEDULE: Record<number, Source> = {
  2: { type: 'subreddit', name: 'AIDangers' },
  5: { type: 'subreddit', name: 'ControlProblem' },
  8: { type: 'subreddit', name: 'antiai' },
  11: { type: 'user', name: 'katxwoods' },
  14: { type: 'user', name: 'MetaKnowing' },
  17: { type: 'user', name: 'EchoOfOppenheimer' },
};

export function sourceForHour(hourUtc: number): Source | null {
  return SCHEDULE[hourUtc] ?? null;
}

export function findSource(name: string): Source | null {
  for (const s of Object.values(SCHEDULE)) {
    if (s.name.toLowerCase() === name.toLowerCase()) return s;
  }
  return null;
}
