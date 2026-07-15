// Minimal single-user gate. On successful login we set a cookie to a fixed
// secret token (SESSION_TOKEN); the middleware just checks the cookie matches.
// Good enough for a personal, single-viewer tool.

export const COOKIE_NAME = 'tv_session';

export function expectedToken(): string {
  return process.env.SESSION_TOKEN || '';
}

export function checkCredentials(user: string, pass: string): boolean {
  const u = process.env.AUTH_USER || '';
  const p = process.env.AUTH_PASS || '';
  return !!u && !!p && user === u && pass === p;
}
