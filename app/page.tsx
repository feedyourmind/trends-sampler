import { getPosts } from '@/lib/db';

export const dynamic = 'force-dynamic';

function fmtDate(d: string | null): string {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const { posts, hasMore } = await getPosts(page);

  return (
    <div className="wrap">
      <header className="site">
        <div>
          <h1>trends-viewer</h1>
          <p>Qualitative observations about AI-related discourse.</p>
        </div>
        <form method="post" action="/api/logout">
          <button className="logout" type="submit">
            sign out
          </button>
        </form>
      </header>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No posts.</p>
      ) : (
        posts.map((p) => (
          <div className="post" key={p.id}>
            <div className="title">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.title}
                </a>
              ) : (
                p.title
              )}
              {p.post_type && p.post_type !== 'text' ? (
                <span className="tag">{p.post_type}</span>
              ) : null}
            </div>
            <div className="meta">
              {p.subreddit ? <span>r/{p.subreddit}</span> : null}
              {p.username ? <span>u/{p.username}</span> : null}
              <span>{fmtDate(p.sent_date)}</span>
              {typeof p.comments === 'number' ? (
                <span>{p.comments} comments</span>
              ) : null}
            </div>
            {p.body ? <div className="body">{p.body}</div> : null}
          </div>
        ))
      )}

      <div className="pager">
        {page > 1 ? (
          <a href={`/?page=${page - 1}`}>← newer</a>
        ) : (
          <span className="spacer" />
        )}
        {hasMore ? <a href={`/?page=${page + 1}`}>older →</a> : null}
      </div>
    </div>
  );
}
