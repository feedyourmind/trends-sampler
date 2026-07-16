export const metadata = { title: 'Privacy — trends-sampler' };

const CONTACT = 'contact@lethalintelligence.ai';

export default function PrivacyPage() {
  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <header className="site">
        <div>
          <h1>trends-sampler — privacy</h1>
          <p>Qualitative observations about AI-related discourse, based on a small sample of curated Reddit posts.</p>
        </div>
      </header>

      <div style={{ color: '#374151' }}>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Effective July 2026 · Contact: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>

        <p>
          trends-sampler is a personal, non-commercial tool operated by an
          individual developer. It reads publicly available Reddit content (post
          titles, bodies, authors, subreddits, and public metadata) from a small
          list of subreddits and public user profiles via the Reddit Data API,
          strictly read-only.
        </p>

        <h3>What is collected</h3>
        <p>
          Only public Reddit content and metadata returned by the Data API. No
          private messages, no non-public data, and no data about visitors to
          this page.
        </p>

        <h3>How it is used</h3>
        <p>
          Stored in a private database for the operator&apos;s personal research
          into AI-related discussion trends.
        </p>

        <h3>What is never done with it</h3>
        <p>
          It is never sold, licensed, shared with third parties, republished,
          used for advertising or ad targeting, or used to train AI or
          machine-learning models.
        </p>

        <h3>Retention and removal</h3>
        <p>
          Data is kept only as long as it is useful for the research purpose.
          Reddit users may request removal of their content from the database
          via the contact address above. Deleted Reddit content is not knowingly
          retained.
        </p>

        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 24 }}>
          This tool complies with Reddit&apos;s Developer Terms, Data API Terms,
          and Responsible Builder Policy.
        </p>
      </div>
    </div>
  );
}
