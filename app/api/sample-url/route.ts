import { NextRequest, NextResponse } from 'next/server';
import { fetchPostByUrl, hasCredentials } from '@/lib/reddit';
import { upsertPosts } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Save a single post by pasting its URL. This route sits behind the login
// (middleware), so only the operator can use it — and it costs one API
// request per save.
export async function POST(req: NextRequest) {
  if (!hasCredentials()) {
    return NextResponse.json(
      { error: 'reddit credentials not configured' },
      { status: 503 },
    );
  }
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 });

  try {
    const post = await fetchPostByUrl(url);
    if (!post) return NextResponse.json({ error: 'not a recognizable reddit post url' }, { status: 400 });
    await upsertPosts([post], 'url');
    return NextResponse.json({ ok: true, id: post.id, title: post.title });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
