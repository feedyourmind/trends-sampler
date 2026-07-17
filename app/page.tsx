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
          <h1>trends-sampler</h1>
          <p>Qualitative observations about AI-related discourse, based on a small sample of curated Reddit posts.</p>
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
              {p.kind && p.kind !== 'text' ? (
                <span className="tag">{p.kind}</span>
              ) : null}
            </div>
            <div className="meta">
              {p.subreddit ? <span>r/{p.subreddit}</span> : null}
              {p.author ? <span>u/{p.author}</span> : null}
              <span>{fmtDate(p.created_utc)}</span>
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
