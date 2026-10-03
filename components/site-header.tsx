"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/your-styles", label: "Your Styles" },
  { href: "/our-promises", label: "Our Promises" },
  { href: "/about-us", label: "About Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner page-wrap">
        <Link className="brand" href="/" aria-label="Invizz home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">i</span>
          <span>invizz<span className="brand-period">.</span></span>
        </Link>
        <button
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
        <nav id="main-navigation" className={`main-navigation${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <Link
              className={`nav-link${pathname === link.href ? " active" : ""}`}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              key={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/your-styles">Explore the edit <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
