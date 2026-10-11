import type { Metadata } from "next";
import { La_Belle_Aurore } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { EarlyAccessForm } from "@/components/early-access-form";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { DetailsStudio, InspirationTeaser, StoryTimeline, StylePicker } from "@/components/story-interactive";
// Temporary pictures: pencil-sketch versions of Unsplash photographs, and one photograph of hands sketching.
import linenSketch from "@/public/home/collection-2.jpg";
import handsPhoto from "@/public/home/customise.jpg";
import heroSketch from "@/public/pages/about-1.jpg";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Why Invidzz exists: original designs, and a more personal kind of fashion where your own inspiration can become part of how a piece is made.",
};

// The handwritten notes on this page.
const script = La_Belle_Aurore({ variable: "--font-script", weight: "400", subsets: ["latin"] });

const create = [
  {
    number: "01",
    title: "Found an inspiration? Bring it.",
    icon: "M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17.2 9 4.5 4.5 0 0 1 17 18M12 12v8m0-8-3 3m3-3 3 3",
    text: [
      "That saved Instagram post. The Pinterest board you keep coming back to. A sketch in your notebook. Or even a picture you've been imagining for months.",
      "Soon you'll be able to upload your inspiration and tell us what you love about it.",
    ],
  },
  {
    number: "02",
    title: "Want to change something? Make it yours.",
    icon: "M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.6-1.2-1.7-1.2-3 0-1 .8-1.7 1.9-1.7H17a4 4 0 0 0 4-4c0-4.2-4-7.5-9-7.5ZM7.5 12h.01M9.5 8h.01M14 7h.01",
    text: [
      "Explore our planned design experience, where you can experiment with styles, colours, details, and other available customization options.",
      "Think of it as your creative space, where your ideas get room to evolve.",
    ],
  },
  {
    number: "03",
    title: "Ready to make it real? Let's create.",
    icon: "M8 4 3 7l2 4 2-1v10h10V10l2 1 2-4-5-3c-.8 1.6-2.2 2.4-4 2.4S8.800 5.6 8 4Z",
    text: [
      "Once your design is reviewed and your requirements are confirmed, we aim to bring it to life through thoughtful garment development, suitable materials, and careful craftsmanship.",
      "The goal? Clothing that feels closer to what you actually imagined.",
    ],
  },
];

const aims = [
  { title: "One connected place", text: "Inspiration, design and making, together.", icon: "M12 3v18M3 12h18M5.6 5.6l12.8 12.800M18.400 5.6 5.6 18.400" },
  { title: "Less back-and-forth", text: "Fewer trips, fewer explanations.", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
  { title: "Closer to your idea", text: "Reviewed with you before it is made.", icon: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" },
];

function Icon({ path }: { path: string }) {
  return <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>;
}

export default function AboutUsPage() {
  return (
    <main className={`story ${script.variable}`}>
      <RevealOnScroll />

      <section className="st-hero st-dark" aria-labelledby="story-title">
        <div className="page-wrap st-hero-inner">
          <div className="st-hero-copy">
            <p className="hm-eyebrow">Our story</p>
            <h1 id="story-title">Not just a brand. <em>It&apos;s a vision.</em></h1>
            <p className="st-hero-lead">Your imagination was never meant to stay on a Pinterest board.</p>
            <div className="hm-prose">
              <p>Have you ever seen an outfit and thought, &ldquo;I love this, but what if it looked a little different?&rdquo;</p>
              <p>Maybe a different neckline. A fabric that feels more like you. A colour you&apos;ve been imagining. Or a design that exists only in your head.</p>
              <p>You look for it online. You visit stores. You save references. You search for the right fabric, find a tailor, explain your idea, and hope the final result matches what you imagined.</p>
              <p>Sometimes it does. Sometimes it doesn&apos;t. We thought there should be a better way.</p>
            </div>
            <p className="st-script">And that&apos;s where Invidzz begins.</p>
          </div>
          <div className="st-hero-art">
            <Image src={heroSketch} alt="A chalk-style sketch of a woman in sunglasses and an open jacket, looking up" priority placeholder="blur" sizes="(max-width: 900px) 100vw, 46vw" />
            <p className="st-script st-hero-note" aria-hidden="true">Your ideas.<br />Our craft.</p>
          </div>
        </div>
      </section>

      <section className="st-create" aria-labelledby="create-title">
        <div className="page-wrap st-create-inner">
          <div className="reveal">
            <p className="hm-eyebrow">Your mind has a design studio. Let&apos;s bring it to life.</p>
            <h2 id="create-title">Your imagination. <em>Our creation.</em></h2>
            <div className="hm-prose">
              <p>At Invidzz, we believe fashion should give you the freedom to express yourself, not limit you to what&apos;s already available.</p>
              <p>We&apos;re building a fashion experience where you can discover original designs, explore your creativity, and bring your own ideas into the world of clothing.</p>
              <p>Because sometimes, the outfit you want doesn&apos;t exist yet. And why should that stop you from wearing it?</p>
            </div>
            <p className="hm-eyebrow st-sub">You imagine it. We help you create it.</p>
            <ol className="st-list">
              {create.map((item) => (
                <li key={item.number}>
                  <Icon path={item.icon} />
                  <div>
                    <h3><span>{item.number}</span>{item.title}</h3>
                    {item.text.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </li>
              ))}
            </ol>
            <Link className="hm-button" href="/try-customise">Explore Customisation</Link>
          </div>
          <div className="st-create-side reveal">
            <p className="st-script st-flow" aria-hidden="true"><span>Your inspo</span><span>Our design</span><span>Your outfit</span></p>
            <DetailsStudio />
            <p className="st-small">A small preview of the idea. The full design experience is still being built.</p>
            <InspirationTeaser />
          </div>
        </div>
      </section>

      <section className="st-steps st-dark" aria-labelledby="steps-title">
        <div className="page-wrap">
          <p className="hm-eyebrow">How it will work</p>
          <h2 id="steps-title">From idea to outfit. <em>Simplified.</em></h2>
          <StoryTimeline />
        </div>
      </section>

      <section className="st-why page-wrap" aria-labelledby="why-title">
        <div className="st-collage reveal">
          <figure className="st-collage-1"><Image src={handsPhoto} alt="A designer's hands sketching a garment in pencil on white paper" placeholder="blur" sizes="(max-width: 900px) 70vw, 30vw" /></figure>
          <figure className="st-collage-2"><Image src={linenSketch} alt="A pencil sketch of soft folds of linen" placeholder="blur" sizes="(max-width: 900px) 50vw, 22vw" /></figure>
          <span className="st-collage-3" aria-hidden="true" />
          <p className="st-script" aria-hidden="true">Less searching.<br />More creating.</p>
        </div>
        <div className="reveal">
          <p className="hm-eyebrow">Less running around. More being you.</p>
          <h2 id="why-title">Your time is valuable. <em>Your ideas are worth it.</em></h2>
          <div className="hm-prose">
            <p>We know creating a custom outfit can take time. Finding the right fabric. Visiting different shops. Explaining every little detail. Going back and forth over fittings. Wondering whether the final piece will look anything like your reference.</p>
            <p>We want to make that journey simpler.</p>
            <p>With Invidzz, our vision is to bring inspiration, design exploration, and custom garment creation into one connected experience.</p>
          </div>
          <p className="st-closing">Less searching for what doesn&apos;t exist. <em>More creating what could.</em></p>
          <ul className="st-features">
            {aims.map((aim) => (
              <li key={aim.title}><Icon path={aim.icon} /><h3>{aim.title}</h3><p>{aim.text}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="st-styles" aria-labelledby="styles-title">
        <div className="page-wrap st-styles-inner">
          <div className="reveal">
            <p className="hm-eyebrow">Not everyone sees fashion the same way</p>
            <h2 id="styles-title">That&apos;s <em>the point.</em></h2>
            <div className="hm-prose">
              <p>Some love clean lines and understated elegance. Some want bold silhouettes, unexpected details, and colours that make a statement.</p>
              <p>Some know exactly what they want to wear. Others discover it along the way. We want to make space for all of them.</p>
              <p>Through original designs and a more personal approach to clothing, Invidzz is being built for people who enjoy exploring their style on their own terms.</p>
            </div>
            <p className="st-closing">Not to follow every trend. Not to dress like everyone else. <em>But to feel like themselves.</em></p>
          </div>
          <div className="reveal"><StylePicker /></div>
        </div>
      </section>

      <section className="st-end st-dark" id="join" aria-labelledby="join-title">
        <div className="page-wrap">
          <p className="hm-eyebrow">This is only the beginning</p>
          <p className="st-wordmark reveal"><span>Your style.</span> <span>Your imagination.</span> <span><em>Your Invidzz.</em></span></p>
          <div className="st-end-inner">
            <div className="reveal">
              <div className="hm-prose">
                <p>We&apos;re building Invidzz with a simple belief: what you wear should leave room for who you are.</p>
                <p>Our journey begins with original designs and grows towards a more personal fashion experience, where your inspiration can become part of the creation process.</p>
                <p>We&apos;re still building, experimenting, and shaping what&apos;s next. And we&apos;d love for you to be part of it.</p>
              </div>
              <p className="st-script">Wear what feels like you.</p>
            </div>
            <div className="reveal">
              <h2 id="join-title">Be part of what <em>we&apos;re creating.</em></h2>
              <EarlyAccessForm />
              <Link className="hm-link" href="/#first-expression">See the first expression</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
