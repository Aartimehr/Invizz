import Image from "next/image";
import Link from "next/link";
import { store, whatsappLink } from "@/lib/store";

const footerLinks = [
  { href: "/your-styles", label: "Your Styles" },
  { href: "/about-us", label: "Our Story" },
  { href: "/try-customise", label: "Try Customise" },
  { href: "/our-promises", label: "Our Promises" },
  { href: "/#early-access", label: "Early Access" },
];

// Only the accounts that have a real address in lib/store.ts are shown.
const socialLinks = Object.entries(store.social).filter(([, url]) => url);

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-wrap">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link className="brand footer-brand" href="/" aria-label="Invidzz home">
              <Image className="brand-logo" src="/invidzz-logo.png" alt="" width={663} height={231} />
            </Link>
            <p className="footer-tagline">Wear what feels like you.</p>
          </div>
          <div className="footer-nav-block">
            <p className="footer-label">Explore</p>
            <nav aria-label="Footer navigation">
              {footerLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
            </nav>
          </div>
          <div className="footer-social-block">
            <p className="footer-label">Talk to us</p>
            <p>
              WhatsApp{" "}
              <a className="footer-contact" href={whatsappLink(`Hi ${store.name}!`)} target="_blank" rel="noopener noreferrer">{store.whatsappDisplay}</a>
            </p>
            {socialLinks.length > 0 && (
              <div className="social-links">
                {socialLinks.map(([name, url]) => (
                  <a href={url} target="_blank" rel="noopener noreferrer" key={name}>{name} <span aria-hidden="true">↗</span></a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Invidzz. All rights reserved.</span>
          <span>Original designs, made your own.</span>
        </div>
      </div>
    </footer>
  );
}
