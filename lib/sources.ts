// The curated sample. Each source is polled once per day at a fixed hour
// (UTC), so requests are spread across the day instead of bursting: currently
// 12 subreddits and 3 public profiles → a few dozen listing requests per day
// (a subreddit poll pages deeper — up to 5 pages — only while listings come
// back full), plus the occasional save-by-URL. The list rotates over time but
// stays under ~20 subreddits and ~15 profiles, and busy sources may be
// polled up to a few times per day.

export type Source =
  | { type: 'subreddit'; name: string }
  | { type: 'user'; name: string };

// Hour (UTC) -> source. The cron in vercel.json fires hourly; hours without
// an entry are no-ops.
export const SCHEDULE: Record<number, Source> = {
  1: { type: 'subreddit', name: 'ChatGPT' },
  2: { type: 'subreddit', name: 'technology' },
  4: { type: 'subreddit', name: 'singularity' },
  5: { type: 'subreddit', name: 'OpenAI' },
  7: { type: 'subreddit', name: 'agi' },
  8: { type: 'subreddit', name: 'artificial' },
  10: { type: 'subreddit', name: 'technews' },
  11: { type: 'subreddit', name: 'Futurology' },
  13: { type: 'subreddit', name: 'ArtificialInteligence' },
  14: { type: 'subreddit', name: 'ClaudeAI' },
  16: { type: 'subreddit', name: 'Anthropic' },
  17: { type: 'subreddit', name: 'GeminiAI' },
  19: { type: 'user', name: 'katxwoods' },
  20: { type: 'user', name: 'tombibbs' },
  22: { type: 'user', name: 'Logical_Welder3467' },
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
