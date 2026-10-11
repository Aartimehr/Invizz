import Link from "next/link";

// The notice over a page that is not open yet. The page's own sections go in a
// <div className="locked-content" inert aria-hidden="true"> next to it, inside <main className="locked-page">.
// To unlock a page, remove this notice and that wrapper (keep what is inside it).
export function LockedNotice({ text }: { text: string }) {
  return (
    <div className="locked-notice">
      <div className="locked-card">
        <svg className="locked-icon" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <rect x="4.5" y="10.5" width="15" height="10" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          <path d="M12 14.5v2.5" />
        </svg>
        <p className="hm-eyebrow">Locked for now</p>
        <h1>Still under <em>wraps.</em></h1>
        <p className="locked-text">{text}</p>
        <Link className="hm-button" href="/#early-access">Get Early Access</Link>
        <Link className="hm-link" href="/">Back to home</Link>
      </div>
    </div>
  );
}
