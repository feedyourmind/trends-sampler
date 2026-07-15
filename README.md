# trends-viewer

A small personal tool for keeping qualitative observations about AI-related
discourse on Reddit. It reads recent posts (title, body, author, subreddit,
date) from a Postgres database and shows them in a simple paginated list behind
a single-user login.

## Run locally

```bash
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_USER, AUTH_PASS, SESSION_TOKEN
npm install
npm run dev                  # http://localhost:3000
```

## Environment

| Variable        | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `DATABASE_URL`  | Postgres connection (read-only use)            |
| `AUTH_USER`     | Login username                                 |
| `AUTH_PASS`     | Login password                                 |
| `SESSION_TOKEN` | Random secret used as the session cookie value |

## Notes

Read-only: the app only issues `SELECT` queries and never writes to Reddit or
the database.
