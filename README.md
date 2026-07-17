# trends-sampler

A small personal tool for qualitative observations about AI-related discourse,
based on a small sample of curated Reddit posts. It polls a curated list of
subreddits and public user profiles once a day each via the official Reddit
Data API (read-only), stores the posts in Postgres, and shows them in a simple
paginated list behind a single-user login.

## How it samples

The cron fires hourly, and each hour maps to at most ONE source (see
[lib/sources.ts](lib/sources.ts)), so the day's work is spread out instead of
bursting. Currently 12 subreddits and 3 public profiles are scheduled — one
`limit=25` page each, paging deeper (up to 5 pages) only while a subreddit's
listing comes back full — typically a few dozen listing requests per day in
total. The list rotates over time but stays under ~20 subreddits and ~15
profiles, and busy sources may be polled up to a few times per day.

Scheduled sources (UTC hour → source):

- **Subreddits** (`GET /r/{name}/new`): 01 ChatGPT · 02 technology ·
  04 singularity · 05 OpenAI · 07 agi · 08 artificial · 10 technews ·
  11 Futurology · 13 ArtificialInteligence · 14 ClaudeAI · 16 Anthropic ·
  17 GeminiAI
- **Profiles** (`GET /user/{name}/submitted`): 19 katxwoods · 20 tombibbs ·
  22 Logical_Welder3467

There is also a save-by-URL endpoint (`POST /api/sample-url`, behind the
login) that fetches a single post when one is worth keeping.

The client ([lib/reddit.ts](lib/reddit.ts)) is strictly read-only — it never
posts, comments, votes, or messages. It authenticates as a script-type OAuth
app, sends a descriptive User-Agent on every request, paces multi-page fetches
a few seconds apart, and backs off if the `X-Ratelimit-Remaining` header runs
low (which at a few dozen requests/day it never should). Without Reddit credentials
configured, the sampler is a no-op.

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
  "http://localhost:3000/api/cron/sample?source=ChatGPT"
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
