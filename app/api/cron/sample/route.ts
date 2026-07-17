import { NextRequest, NextResponse } from 'next/server';
import { fetchSubredditNew, fetchUserSubmitted, hasCredentials } from '@/lib/reddit';
import { sourceForHour, findSource } from '@/lib/sources';
import { upsertPosts } from '@/lib/db';

export const dynamic = 'force-dynamic';

// One run = one listing request for the single source scheduled for this hour
// (see lib/sources.ts). Vercel Cron invokes this at the scheduled hours with
// the CRON_SECRET bearer token; ?source=<name> allows a manual re-run.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const override = req.nextUrl.searchParams.get('source');
  const source = override
    ? findSource(override)
    : sourceForHour(new Date().getUTCHours());
  if (!source) {
    return NextResponse.json({ ok: true, skipped: 'no source scheduled for this hour' });
  }

  if (!hasCredentials()) {
    // Pre-approval state: the Reddit API credentials are not configured yet,
    // so do nothing. The schedule starts working the day a key exists.
    return NextResponse.json({ ok: true, skipped: 'reddit credentials not configured' });
  }

  try {
    const posts =
      source.type === 'subreddit'
        ? await fetchSubredditNew(source.name)
        : await fetchUserSubmitted(source.name);
    const inserted = await upsertPosts(posts, source.type);
    return NextResponse.json({
      ok: true,
      source: `${source.type}:${source.name}`,
      fetched: posts.length,
      inserted,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, source: `${source.type}:${source.name}`, error: String(err) },
      { status: 500 },
    );
  }
}
