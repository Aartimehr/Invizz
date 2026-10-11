"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

const links = [
  {
    href: "/your-styles",
    label: "Your Styles",
    children: [
      { href: "/your-styles/men", label: "Men" },
      { href: "/your-styles/women", label: "Women" },
    ],
  },
  { href: "/about-us", label: "Our Story" },
  { href: "/try-customise", label: "Try Customise" },
];

// The sign-up section on the homepage.
const earlyAccess = "/#early-access";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner page-wrap">
        <Link className="brand" href="/" aria-label="Invidzz home" onClick={() => setMenuOpen(false)}>
          <Image className="brand-logo" src="/invidzz-logo-2026.png" alt="" width={773} height={440} priority />
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
          {links.map((link) => {
            const active = link.children ? pathname.startsWith(link.href) : pathname === link.href;
            const item = (
              <Link
                className={`nav-link${active ? " active" : ""}`}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
            if (!link.children) return item;
            return (
              <div className="nav-group" key={link.href}>
                {item}
                <div className="nav-submenu">
                  {link.children.map((child) => (
                    <Link
                      className={`nav-sublink${pathname === child.href ? " active" : ""}`}
                      href={child.href}
                      aria-current={pathname === child.href ? "page" : undefined}
                      key={child.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          {/* On phones the button in the header bar is hidden, so the menu carries the link instead. */}
          <Link className="nav-link nav-link-phone" href={earlyAccess} onClick={() => setMenuOpen(false)}>Early Access</Link>
        </nav>
        <div className="header-actions">
          <button className="cart-button" type="button" aria-label={`Open your bag, ${count} ${count === 1 ? "piece" : "pieces"}`} onClick={openCart}>
            Bag <span>{count}</span>
          </button>
          <Link className="header-cta" href={earlyAccess}>Early Access</Link>
        </div>
      </div>
    </header>
  );
}
