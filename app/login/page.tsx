export const metadata = { title: 'Sign in — trends-viewer' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="login">
      <h1>trends-viewer</h1>
      <p className="sub">Qualitative observations about AI-related discourse.</p>
      <form method="post" action="/api/login">
        <input name="user" placeholder="username" autoComplete="username" autoFocus />
        <input
          name="pass"
          type="password"
          placeholder="password"
          autoComplete="current-password"
        />
        {error ? <div className="err">Incorrect username or password.</div> : null}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
