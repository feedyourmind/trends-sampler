import postgres from 'postgres';

// Single lazily-created connection. `prepare: false` is required for the
// Supabase transaction pooler.
let sql: ReturnType<typeof postgres> | null = null;

export function db() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    sql = postgres(url, { prepare: false, idle_timeout: 20, max: 3 });
  }
  return sql;
}

export type Post = {
  id: string;
  title: string | null;
  body: string | null;
  subreddit: string | null;
  username: string | null;
  sent_date: string | null;
  post_type: string | null;
  comments: number | null;
  upvote_ratio: string | null;
  url: string | null;
};

const PAGE_SIZE = 25;

export async function getPosts(page: number): Promise<{ posts: Post[]; hasMore: boolean }> {
  const offset = Math.max(0, page - 1) * PAGE_SIZE;
  const rows = await db()<Post[]>`
    SELECT
      id,
      title,
      body,
      subreddit,
      username,
      sent_date,
      post_type,
      m_comments   AS comments,
      m_upvote_ratio AS upvote_ratio,
      live_url     AS url
    FROM posts
    WHERE platform = 'Reddit'
      AND title IS NOT NULL
    ORDER BY sent_date DESC NULLS LAST
    LIMIT ${PAGE_SIZE + 1} OFFSET ${offset}
  `;
  const hasMore = rows.length > PAGE_SIZE;
  return { posts: rows.slice(0, PAGE_SIZE), hasMore };
}
