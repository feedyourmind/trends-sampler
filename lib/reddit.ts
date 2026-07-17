// Minimal read-only client for the Reddit Data API.
//
// Auth: script-type app, password grant, token fetched per run (runs are
// serverless and ~6/day, so there's nothing worth caching). Every request
// sends the descriptive User-Agent required by Reddit's API rules, and we
// stop early if the rate-limit headers say we're anywhere near the ceiling —
// which at this volume should never happen.

const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const API = 'https://oauth.reddit.com';

export const USER_AGENT =
  process.env.REDDIT_USER_AGENT ||
  'nodejs:trends-sampler:v1.0 (by /u/Just-Grocery-2229)';

// Single page, default listing size. The whole tool fetches a handful of
// pages per day — see lib/sources.ts for the schedule.
export const PAGE_LIMIT = 25;

export type SampledPost = {
  id: string; // reddit fullname, e.g. t3_1abc2d
  title: string;
  body: string | null;
  author: string | null;
  subreddit: string | null;
  kind: string | null; // text | link | image | video
  url: string | null; // permalink
  createdUtc: Date | null;
  comments: number | null;
  upvoteRatio: number | null;
};

export function hasCredentials(): boolean {
  return !!(
    process.env.REDDIT_CLIENT_ID &&
    process.env.REDDIT_CLIENT_SECRET &&
    process.env.REDDIT_USERNAME &&
    process.env.REDDIT_PASSWORD
  );
}

async function getToken(): Promise<string> {
  const basic = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`,
  ).toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: process.env.REDDIT_USERNAME!,
      password: process.env.REDDIT_PASSWORD!,
    }),
  });
  if (!res.ok) throw new Error(`token request failed: ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error('token response missing access_token');
  return json.access_token;
}

async function apiGet(path: string): Promise<unknown> {
  const token = await getToken();
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT },
  });
  const remaining = parseFloat(res.headers.get('x-ratelimit-remaining') ?? '');
  if (!Number.isNaN(remaining) && remaining < 10) {
    throw new Error(`rate limit nearly exhausted (${remaining} left) — backing off`);
  }
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapChild(child: any): SampledPost | null {
  const d = child?.data;
  if (!d?.name || !d?.title) return null;
  const kind = d.is_self
    ? 'text'
    : d.post_hint === 'image'
      ? 'image'
      : d.is_video || d.post_hint === 'hosted:video' || d.post_hint === 'rich:video'
        ? 'video'
        : 'link';
  return {
    id: d.name,
    title: d.title,
    body: d.selftext ? String(d.selftext) : null,
    author: d.author ?? null,
    subreddit: d.subreddit ?? null,
    kind,
    url: d.permalink ? `https://www.reddit.com${d.permalink}` : null,
    createdUtc: d.created_utc ? new Date(d.created_utc * 1000) : null,
    comments: typeof d.num_comments === 'number' ? d.num_comments : null,
    upvoteRatio: typeof d.upvote_ratio === 'number' ? d.upvote_ratio : null,
  };
}

function mapListing(json: any): SampledPost[] {
  const children = json?.data?.children ?? [];
  return children.map(mapChild).filter(Boolean) as SampledPost[];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * New submissions in a subreddit. Fetches one page; if the page comes back
 * full (an active subreddit), fetches more so a daily poll doesn't miss
 * posts — never more than MAX_PAGES pages, with a pause between requests.
 */
const MAX_PAGES = 5;
const PACE_MS = 3000;

export async function fetchSubredditNew(subreddit: string): Promise<SampledPost[]> {
  const all: SampledPost[] = [];
  let after: string | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    if (page > 0) await sleep(PACE_MS);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const json: any = await apiGet(
      `/r/${subreddit}/new?limit=${PAGE_LIMIT}&raw_json=1${after ? `&after=${after}` : ''}`,
    );
    const posts = mapListing(json);
    all.push(...posts);
    after = json?.data?.after ?? null;
    if (posts.length < PAGE_LIMIT || !after) break;
  }
  return all;
}

/** A user's public submission history (single page). */
export async function fetchUserSubmitted(username: string): Promise<SampledPost[]> {
  return mapListing(
    await apiGet(`/user/${username}/submitted?limit=${PAGE_LIMIT}&sort=new&raw_json=1`),
  );
}

/** A single post, saved by pasting its URL. */
export async function fetchPostByUrl(url: string): Promise<SampledPost | null> {
  const m = url.match(/reddit\.com\/r\/([^/]+)\/comments\/([a-z0-9]+)/i);
  if (!m) return null;
  const json = (await apiGet(`/r/${m[1]}/comments/${m[2]}.json?limit=1&raw_json=1`)) as any[];
  return mapChild(json?.[0]?.data?.children?.[0]) ?? null;
}
