import Image from "next/image";
import Link from "next/link";
// A pencil-sketch version of a temporary Unsplash photograph. The original is in photo-originals/pages.
import heroSketch from "@/public/pages/promises.jpg";

const promises = [
  {
    number: "01",
    title: "Thoughtfully made",
    description: "We choose considered fabrics and work with skilled makers who care about the details as much as we do. Fewer, better things, made with intention.",
    detail: "Quality over quantity",
  },
  {
    number: "02",
    title: "Made to stay",
    description: "We design beyond the moment: pieces with the kind of fit, feel and versatility that earn their place in your wardrobe, season after season.",
    detail: "Wear on repeat",
  },
  {
    number: "03",
    title: "More you, always",
    description: "We believe style belongs to the person wearing it. Our collections are an invitation, not a rulebook—make them your own.",
    detail: "No rules, just you",
  },
  {
    number: "04",
    title: "Here when you need us",
    description: "From your first question to finding the right fit, we’re a real team who loves helping you feel good about what you wear.",
    detail: "People, not scripts",
  },
];

export default function PromisesPage() {
  return (
    <main>
      <section className="promise-hero page-wrap">
        <div className="promise-hero-copy">
          <p className="eyebrow">The Invidzz point of view</p>
          <h1>Good style.<br /><em>Good intentions.</em></h1>
          <p>What we make matters. How we make it matters more. These are the things we’ll always stand by.</p>
        </div>
        <div className="promise-hero-image">
          <Image src={heroSketch} alt="Thoughtful everyday fashion with timeless details" fill sizes="(max-width: 760px) 100vw, 50vw" />
          <span>Wear well, feel good / Invidzz</span>
        </div>
      </section>

      <section className="promise-list-section">
        <div className="page-wrap">
          <div className="section-title-row"><div><p className="eyebrow">What you can count on</p><h2>Our Promises</h2></div><p className="section-note">Not just words on a page. The principles behind every choice we make.</p></div>
          <div className="promise-list">
            {promises.map((promise) => (
              <article className="promise-item" key={promise.number}>
                <span className="promise-number">{promise.number}</span>
                <div><h3>{promise.title}</h3><p>{promise.description}</p></div>
                <span className="promise-detail">{promise.detail}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="promise-end">
        <p className="eyebrow eyebrow-light">A promise to your wardrobe</p>
        <h2>Buy less.<br /><em>Love every piece.</em></h2>
        <Link className="button button-light" href="/your-styles">Explore the collection <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}
