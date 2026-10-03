import Image from "next/image";
import Link from "next/link";

const launches = [
  {
    name: "The Sunday Shirt",
    description: "An easy, airy layer for slow mornings and long lunches.",
    price: "$88",
    image: "photo-1598554747436-c9293d6a588f",
    tone: "sand",
    label: "Just landed",
  },
  {
    name: "Everywhere Trouser",
    description: "A relaxed shape with a little more room to roam.",
    price: "$120",
    image: "photo-1506629905607-d9c297d21b08",
    tone: "olive",
    label: "Bestseller",
  },
  {
    name: "Soft Form Knit",
    description: "The kind of knit you reach for, again and again.",
    price: "$96",
    image: "photo-1576566588028-4147f3842f27",
    tone: "blue",
    label: "New colour",
  },
  {
    name: "Daylight Dress",
    description: "One-and-done dressing, with a little room to play.",
    price: "$148",
    image: "photo-1496747611176-843222e1e57c",
    tone: "rose",
    label: "Limited run",
  },
  {
    name: "The Good Layer",
    description: "A light jacket that makes the in-between feel easy.",
    price: "$168",
    image: "photo-1548126032-079a0fb0099d",
    tone: "clay",
    label: "Made to keep",
  },
];

const styles = [
  {
    name: "Soft Structure",
    description: "Clean lines, gentle shapes. Put-together without trying too hard.",
    image: "photo-1483985988355-763728e1935b",
    className: "style-card-large",
    number: "01",
  },
  {
    name: "Off-Duty Ease",
    description: "The comfort pieces you’ll want to live in.",
    image: "photo-1529139574466-a303027c1d8b",
    className: "",
    number: "02",
  },
  {
    name: "Modern Romantic",
    description: "A softer side, with a point of view.",
    image: "photo-1539109136881-3be0616acf4b",
    className: "",
    number: "03",
  },
  {
    name: "Everyday Original",
    description: "Familiar favourites, just a little less expected.",
    image: "photo-1524504388940-b1c1722653e1",
    className: "",
    number: "04",
  },
  {
    name: "The Artful Minimalist",
    description: "A quieter palette. Details that do the talking.",
    image: "photo-1534528741775-53994a69daeb",
    className: "style-card-wide",
    number: "05",
  },
];

const testimonials = [
  { name: "Maya R.", location: "Brooklyn, NY", quote: "It feels like someone finally made the wardrobe I’ve been looking for. The fit, the fabric, all of it just works.", initials: "MR" },
  { name: "Clara T.", location: "Austin, TX", quote: "I wore the Daylight Dress three times in one week. It’s the kind of piece that makes an ordinary day feel special.", initials: "CT" },
  { name: "Jules A.", location: "Portland, OR", quote: "Beautifully made without feeling precious. These are the pieces I reach for when I want to feel like myself.", initials: "JA" },
  { name: "Sana K.", location: "Chicago, IL", quote: "The details are so thoughtful. I love that everything feels considered but still completely effortless.", initials: "SK" },
  { name: "Ellie W.", location: "London, UK", quote: "My new favourite place to find forever pieces. The whole experience feels warm, honest and very Invizz.", initials: "EW" },
];

function SectionTitle({ kicker, title, note }: { kicker: string; title: string; note?: string }) {
  return (
    <div className="section-title-row">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {note ? <p className="section-note">{note}</p> : null}
    </div>
  );
}

export default function YourStylesPage() {
  return (
    <main>
      <section className="page-hero page-wrap">
        <div>
          <p className="eyebrow">The Invizz collection / 2025</p>
          <h1>Find your<br /><em>own kind of style.</em></h1>
        </div>
        <p className="page-hero-note">A considered collection for all the ways you show up. Take a look around, try something on, make it yours.</p>
      </section>

      <section className="launches-section page-wrap">
        <SectionTitle kicker="Fresh from the studio" title="Our Top Launches" note="Small runs. Big favourites. Meet the pieces we can't stop thinking about." />
        <div className="launch-grid">
          {launches.map((item, index) => (
            <article className={`launch-card launch-${index + 1}`} key={item.name}>
              <Link className={`launch-image ${item.tone}`} href="/our-promises" aria-label={`Discover ${item.name}`}>
                <Image
                  src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=85`}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 24vw"
                />
                <span className="product-label">{item.label}</span>
                <span className="quick-view" aria-hidden="true">↗</span>
              </Link>
              <div className="launch-info">
                <div><h3>{item.name}</h3><p>{item.description}</p></div>
                <span className="product-price">{item.price}</span>
              </div>
              <Link className="card-cta" href="/our-promises">Discover the piece <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="style-section">
        <div className="page-wrap">
          <SectionTitle kicker="A little inspiration" title="Style That Suits You Best" note="No rules, no one-size-fits-all. Just a few starting points for finding what feels right." />
          <div className="style-grid">
            {styles.map((style) => (
              <Link className={`style-card ${style.className}`} href="/about-us" key={style.name}>
                <Image
                  src={`https://images.unsplash.com/${style.image}?auto=format&fit=crop&w=1300&q=85`}
                  alt={`${style.name} fashion inspiration`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 40vw"
                />
                <span className="style-card-number">{style.number} / 05</span>
                <span className="style-card-copy"><strong>{style.name}</strong><span>{style.description}</span></span>
                <span className="style-card-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="makings-section page-wrap">
        <SectionTitle kicker="Behind every detail" title="Our Makings" note="Good things take a little time. Take a look at the hands, heart and thought behind what we make." />
        <div className="making-video">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=85"
            alt="The hands and tools behind considered garment making"
            fill
            sizes="100vw"
          />
          <div className="video-overlay" />
          <div className="video-caption"><span className="eyebrow eyebrow-light">From the first sketch to the final stitch</span><h3>Made with care.<br /><em>Made to be lived in.</em></h3></div>
          <button className="video-play" type="button" aria-label="Our Makings video coming soon"><span aria-hidden="true">▶</span></button>
          <span className="video-duration">A closer look / 02:14</span>
        </div>
        <p className="video-note">A little film about the people, process and purpose behind each piece. <span>Video coming soon.</span></p>
      </section>

      <section className="testimonials-section">
        <div className="page-wrap">
          <SectionTitle kicker="Kind words, real people" title="What Users Say About Us" note="A few notes from the Invizz community. We think they say it better than we could." />
          <div className="testimonial-grid">
            {testimonials.map((person) => (
              <article className="testimonial-card" key={person.name}>
                <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                <p className="testimonial-quote">“{person.quote}”</p>
                <div className="testimonial-person"><span className="testimonial-avatar">{person.initials}</span><span><strong>{person.name}</strong><small>{person.location}</small></span></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
