export const metadata = { title: 'Privacy — trends-sampler' };

const CONTACT = 'contact@lethalintelligence.ai';

export default function PrivacyPage() {
  return (
    <div className="wrap" style={{ maxWidth: 660 }}>
      <header className="site">
        <div>
          <h1>trends-sampler — privacy policy</h1>
          <p>
            Qualitative observations about AI-related discourse, based on a small
            sample of curated Reddit posts.
          </p>
        </div>
      </header>

      <div className="policy" style={{ color: '#374151' }}>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Last updated 17 July 2026 · Contact:{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>

        <p>
          trends-sampler (&quot;the tool&quot;) is a personal, non-commercial
          project operated by an individual developer. This policy explains what
          data the tool handles, why, and the choices available to you. It is
          written to be read in full — it is short because the tool does very
          little with data.
        </p>

        <h3>1. Who operates trends-sampler</h3>
        <p>
          The tool is run by a single individual for their own research. It is
          not a company, does not have users other than its operator, and does
          not offer a service to the public. Access to the tool itself is
          restricted by a single-user login.
        </p>

        <h3>2. Information the tool handles</h3>
        <p>
          <strong>Public Reddit content.</strong> The tool reads publicly
          available content via the official Reddit Data API — post titles,
          bodies, links, authors, subreddit names, timestamps, and public
          engagement metadata (such as comment counts) — from a small, curated
          list of subreddits and public user profiles. It only ever reads; it
          never posts, comments, votes, messages, or otherwise writes to Reddit.
        </p>
        <p>
          <strong>Access data.</strong> To gate the tool, a single essential
          session cookie is set after login. It is used only to keep the
          operator signed in. The tool sets no advertising, analytics, or
          third-party tracking cookies, and collects no data about people who
          view this page.
        </p>
        <p>
          The tool does <strong>not</strong> collect private messages, deleted
          content, non-public data, email addresses, or any special-category
          personal data.
        </p>

        <h3>3. How and why data is used</h3>
        <p>
          Collected public content is stored in a private database and used
          solely to observe and analyse trends in AI-related discussion over
          time. The lawful basis for this limited processing of public
          information is the operator&apos;s legitimate interest in
          non-commercial research, balanced against the fact that only already-
          public content is involved.
        </p>

        <h3>4. What the tool never does</h3>
        <p>
          Collected data is never sold, licensed, rented, published,
          redistributed, or shared with third parties for their own purposes. It
          is never used for advertising or ad targeting, and it is never used to
          train, fine-tune, or evaluate artificial-intelligence or
          machine-learning models.
        </p>

        <h3>5. Third-party services</h3>
        <p>
          The tool relies on a small number of infrastructure providers acting
          on the operator&apos;s behalf: the Reddit Data API (as the source of
          content), a cloud application-hosting provider, and a managed database
          provider for storage. These providers process data only to deliver
          their infrastructure and are not permitted to use it for their own
          purposes. No data is shared with any other third party.
        </p>

        <h3>6. Data retention</h3>
        <p>
          Content is kept only as long as it remains useful for the research
          purpose and is deleted or refreshed periodically. Content that a
          Reddit user deletes or removes on Reddit is not knowingly retained.
        </p>

        <h3>7. Your rights and removal requests</h3>
        <p>
          Reddit users may ask for their content to be removed from the
          database, and — subject to applicable law — you may request access to,
          correction of, or deletion of information relating to you. Requests can
          be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and will be
          actioned promptly. Because the tool stores only public Reddit content,
          removal is typically a simple matter of deleting the relevant records.
        </p>

        <h3>8. Security</h3>
        <p>
          The database is private and access-controlled, connections are
          encrypted in transit, and the tool&apos;s interface is protected by a
          login. As with any system, no method of storage or transmission can be
          guaranteed perfectly secure, but the tool is deliberately minimal to
          keep its data footprint small.
        </p>

        <h3>9. Children&apos;s privacy</h3>
        <p>
          The tool is not directed at children, has no public sign-ups, and does
          not knowingly collect personal data relating to children.
        </p>

        <h3>10. Changes to this policy</h3>
        <p>
          This policy may be updated if the tool changes. Any material change
          will be reflected here along with a revised &quot;last updated&quot;
          date above.
        </p>

        <h3>11. Compliance with Reddit&apos;s terms</h3>
        <p>
          The tool is designed to operate within, and complies with,
          Reddit&apos;s Developer Terms, Data API Terms, and Responsible Builder
          Policy, including their restrictions on read-only access,
          redistribution, and use of Reddit data for model training.
        </p>

        <h3>Contact</h3>
        <p>
          Questions or requests about this policy or your data can be sent to{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </div>
    </div>
  );
}
