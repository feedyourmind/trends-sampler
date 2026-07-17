import postgres from 'postgres';
import type { SampledPost } from './reddit';

// Single lazily-created connection. `prepare: false` is required for the
// Supabase transaction pooler.
let sql: ReturnType<typeof postgres> | null = null;

export function db() {
  if (!sql) {
    // Strip surrounding quotes: some env sources (a quoted value in a .env, or
    // a dashboard paste) keep the quotes literally, which breaks URL parsing.
    const url = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, '');
    if (!url) throw new Error('DATABASE_URL is not set');
    sql = postgres(url, { prepare: false, idle_timeout: 20, max: 3 });
  }
  return sql;
}

// The tool keeps everything in its own `trends_sampler` schema — one table,
// bootstrapped on first write, so a fresh database works out of the box.
let ensured = false;
export async function ensureTable(): Promise<void> {
  if (ensured) return;
  await db()`CREATE SCHEMA IF NOT EXISTS trends_sampler`;
  await db()`
    CREATE TABLE IF NOT EXISTS trends_sampler.posts (
      id           text PRIMARY KEY,
      title        text NOT NULL,
      body         text,
      author       text,
      subreddit    text,
      kind         text,
      url          text,
      created_utc  timestamptz,
      comments     integer,
      upvote_ratio numeric,
      source       text,
      fetched_at   timestamptz NOT NULL DEFAULT now()
    )`;
  await db()`
    CREATE INDEX IF NOT EXISTS posts_created_idx
    ON trends_sampler.posts (created_utc DESC)`;
  ensured = true;
}

/** Insert new posts; refresh the moving metrics on ones we already have. */
export async function upsertPosts(
  posts: SampledPost[],
  source: string,
): Promise<number> {
  if (posts.length === 0) return 0;
  await ensureTable();
  let n = 0;
  for (const p of posts) {
    const rows = await db()`
      INSERT INTO trends_sampler.posts
        (id, title, body, author, subreddit, kind, url, created_utc, comments, upvote_ratio, source)
      VALUES
        (${p.id}, ${p.title}, ${p.body}, ${p.author}, ${p.subreddit}, ${p.kind},
         ${p.url}, ${p.createdUtc}, ${p.comments}, ${p.upvoteRatio}, ${source})
      ON CONFLICT (id) DO UPDATE SET
        comments = EXCLUDED.comments,
        upvote_ratio = EXCLUDED.upvote_ratio,
        fetched_at = now()
      RETURNING (xmax = 0) AS inserted`;
    if (rows[0]?.inserted) n++;
  }
  return n;
}

export type Post = {
  id: string;
  title: string;
  body: string | null;
  author: string | null;
  subreddit: string | null;
  kind: string | null;
  url: string | null;
  created_utc: string | null;
  comments: number | null;
  upvote_ratio: string | null;
};

const PAGE_SIZE = 25;

export async function getPosts(page: number): Promise<{ posts: Post[]; hasMore: boolean }> {
  const offset = Math.max(0, page - 1) * PAGE_SIZE;
  const rows = await db()<Post[]>`
    SELECT id, title, body, author, subreddit, kind, url,
           created_utc, comments, upvote_ratio
    FROM trends_sampler.posts
    ORDER BY created_utc DESC NULLS LAST
    LIMIT ${PAGE_SIZE + 1} OFFSET ${offset}
  `;
  const hasMore = rows.length > PAGE_SIZE;
  return { posts: rows.slice(0, PAGE_SIZE), hasMore };
}
