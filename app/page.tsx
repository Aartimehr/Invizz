import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    number: "01",
    title: "Made to move with you",
    copy: "Thoughtful fits and considered fabrics, made for wherever the day takes you.",
  },
  {
    number: "02",
    title: "Less, but better",
    copy: "Timeless pieces designed to stay in your wardrobe well beyond a season.",
  },
  {
    number: "03",
    title: "A little more personal",
    copy: "Find the silhouettes, details and colours that feel unmistakably like you.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <Image
          className="home-hero-image"
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=90"
          alt="A model wearing an effortless neutral look"
          fill
          priority
          sizes="100vw"
        />
        <div className="home-hero-shade" />
        <div className="home-hero-content page-wrap">
          <p className="eyebrow eyebrow-light">A new point of view</p>
          <h1>Wear what<br />feels like you.</h1>
          <p className="hero-copy">
            Thoughtful essentials. Unexpected details. A wardrobe that makes
            getting dressed feel like the best part of your day.
          </p>
          <Link className="button button-light" href="/your-styles">
            Find your style <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="hero-index"><span>01</span> / 04</div>
      </section>

      <section className="intro-section page-wrap">
        <div className="intro-mark" aria-hidden="true">I.</div>
        <div>
          <p className="eyebrow">A wardrobe with intention</p>
          <h2>Good style isn&apos;t found.<br /><em>It&apos;s felt.</em></h2>
        </div>
        <p className="intro-copy">
          Invidzz is a little reminder to dress for yourself. We bring together
          considered pieces, honest craft and the freedom to make every look
          your own.
        </p>
      </section>

      <section className="home-feature">
        <div className="feature-image">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85"
            alt="Friends sharing a moment in their favourite outfits"
            fill
            sizes="(max-width: 760px) 100vw, 52vw"
          />
        </div>
        <div className="feature-copy">
          <p className="eyebrow">The Invidzz edit / 01</p>
          <h2>Style is personal.<br /><em>Let&apos;s keep it that way.</em></h2>
          <p>
            From everyday layers to the pieces you save for a reason, discover
            a collection that leaves room for you in every detail.
          </p>
          <Link className="text-link" href="/your-styles">Explore your styles <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="values-section page-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The things we believe</p>
            <h2>Considered in<br /><em>every way.</em></h2>
          </div>
          <Link className="text-link" href="/our-promises">Our promises <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="value-list">
          {highlights.map((item) => (
            <article className="value-item" key={item.number}>
              <span className="value-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="value-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-quote">
        <p className="eyebrow eyebrow-light">A thought to take with you</p>
        <blockquote>“The best outfit is the one that lets you be entirely yourself.”</blockquote>
        <Link className="button button-light" href="/about-us">Get to know us <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}
