import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/your-styles", label: "Your Styles" },
  { href: "/our-promises", label: "Our Promises" },
  { href: "/about-us", label: "About Us" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-wrap">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link className="brand footer-brand" href="/" aria-label="Invizz home">
              <span className="brand-mark" aria-hidden="true">i</span>
              <span>invizz<span className="brand-period">.</span></span>
            </Link>
            <p>Considered clothes for wherever life takes you. Made with care, worn your way.</p>
          </div>
          <div className="footer-nav-block">
            <p className="footer-label">Find your way</p>
            <nav aria-label="Footer navigation">
              {footerLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
            </nav>
          </div>
          <div className="footer-social-block">
            <p className="footer-label">Stay in the know</p>
            <p>Good things, occasionally. Follow along for a little more Invizz.</p>
            <div className="social-links">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">IG <span aria-hidden="true">↗</span></a>
              <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer" aria-label="Pinterest">PIN <span aria-hidden="true">↗</span></a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">TK <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Invizz. Made with intention.</span>
          <span>Wear what feels like you.</span>
        </div>
      </div>
    </footer>
  );
}
