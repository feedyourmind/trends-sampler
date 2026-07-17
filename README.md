# trends-sampler

A small personal tool for qualitative observations about AI-related discourse,
based on a small sample of curated Reddit posts. It polls a handful of
subreddits and public user profiles once a day each via the official Reddit
Data API (read-only), stores the posts in Postgres, and shows them in a simple
paginated list behind a single-user login.

## How it samples

One source is polled per scheduled hour (UTC), so the day's work is spread out
instead of bursting — 6 listing requests per day in total, one page
(`limit=25`) each. The schedule lives in [lib/sources.ts](lib/sources.ts) and
must match the cron hours in [vercel.json](vercel.json):

| UTC hour | Source          | Request                            |
| -------- | --------------- | ---------------------------------- |
| 02:00    | r/ChatGPT       | `GET /r/ChatGPT/new`               |
| 05:00    | r/singularity   | `GET /r/singularity/new`           |
| 08:00    | r/agi           | `GET /r/agi/new`                   |
| 11:00    | u/katxwoods     | `GET /user/katxwoods/submitted`    |
| 14:00    | u/tombibbs      | `GET /user/tombibbs/submitted`     |
| 17:00    | u/Logical_Welder3467 | `GET /user/Logical_Welder3467/submitted` |

There is also a save-by-URL endpoint (`POST /api/sample-url`, behind the
login) that fetches a single post when one is worth keeping.

The client ([lib/reddit.ts](lib/reddit.ts)) is strictly read-only — it never
posts, comments, votes, or messages. It authenticates as a script-type OAuth
app, sends a descriptive User-Agent on every request, and backs off if the
`X-Ratelimit-Remaining` header runs low (which at ~6 requests/day it never
should). Without Reddit credentials configured, the sampler is a no-op.

Data lands in a self-bootstrapping `trends_sampler.posts` table (see
[lib/db.ts](lib/db.ts)); re-seeing a post just refreshes its comment count and
upvote ratio.

## Run locally

```bash
cp .env.example .env.local   # fill in the variables
npm install
npm run dev                  # http://localhost:3000
```

Trigger a sample run manually (needs Reddit credentials + CRON_SECRET):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "http://localhost:3000/api/cron/sample?source=AIDangers"
```

## Environment

| Variable                | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `DATABASE_URL`          | Postgres connection                              |
| `AUTH_USER` / `AUTH_PASS` | Login credentials                              |
| `SESSION_TOKEN`         | Random secret used as the session cookie value   |
| `CRON_SECRET`           | Bearer token required by `/api/cron/sample`      |
| `REDDIT_CLIENT_ID`      | Reddit script-app client id                      |
| `REDDIT_CLIENT_SECRET`  | Reddit script-app secret                         |
| `REDDIT_USERNAME` / `REDDIT_PASSWORD` | Account the script app runs under  |
| `REDDIT_USER_AGENT`     | Optional User-Agent override                     |

## Privacy

See the [privacy policy](https://trends-sampler.litupbits.com/privacy):
public content only, private storage, never redistributed or used to train
models, removal requests honored.
