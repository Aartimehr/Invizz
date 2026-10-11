import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EarlyAccessForm } from "@/components/early-access-form";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
// Pencil-sketch versions of temporary Unsplash photographs, standing in until our own campaign is shot (customise.jpg is still the photograph).
// The original photographs are in photo-originals/home. To replace one, save the new picture over the file of the same name in public/home.
import beliefImage from "@/public/home/belief.jpg";
import collectionOne from "@/public/home/collection-1.jpg";
import collectionTwo from "@/public/home/collection-2.jpg";
import collectionThree from "@/public/home/collection-3.jpg";
import collectionFour from "@/public/home/collection-4.jpg";
import customiseImage from "@/public/home/customise.jpg";
import heroImage from "@/public/home/hero.jpg";

const title = "Invidzz | Wear What Feels Like You";
const description = "Discover Invidzz, a contemporary fashion label built around original designs, individuality, and a more personal approach to style.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "Invidzz", title, description, images: [{ url: heroImage.src, width: heroImage.width, height: heroImage.height, alt: "A pencil sketch of a floral summer wrap dress and a woven straw bag" }] },
  twitter: { card: "summary_large_image", title, description, images: [heroImage.src] },
};

// Mood pictures only: none of them shows a piece from the collection.
const moodboard = [
  { image: collectionOne, alt: "A model leaning back in an oversized tailored blazer, photographed from below", sizes: "(max-width: 680px) 100vw, 40vw" },
  { image: collectionTwo, alt: "Soft folds of sheer white linen", sizes: "(max-width: 680px) 50vw, 30vw" },
  { image: collectionThree, alt: "A belted camel coat worn over black trousers on stone steps", sizes: "(max-width: 680px) 50vw, 24vw" },
  { image: collectionFour, alt: "Turned-up tan trousers and black leather shoes in afternoon light", sizes: "(max-width: 680px) 100vw, 30vw" },
];

// A line of text that slides across the screen without stopping. The phrases are written out twice so the loop has no gap.
function Strip({ phrases, reverse = false }: { phrases: string[]; reverse?: boolean }) {
  return (
    <div className={`hm-strip${reverse ? " hm-strip-reverse" : ""}`}>
      <div className="hm-strip-track">
        {[0, 1, 2, 3].map((copy) => (
          <p aria-hidden={copy > 0} key={copy}>
            {phrases.map((phrase) => <span key={phrase}>{phrase}</span>)}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="home">
      <RevealOnScroll />
      <section className="hm-hero" aria-labelledby="hero-title">
        <div className="page-wrap hm-hero-inner">
          <div className="hm-hero-copy">
            <p className="hm-eyebrow">A new expression of fashion</p>
            <h1 id="hero-title">
              <span>Not made</span> <span>to fit in.</span>{" "}
              <em><span>Made to</span> <span>be yours.</span></em>
            </h1>
            <p className="hm-lede">A new perspective on fashion. Original designs, elevated essentials, and the freedom to make a style your own.</p>
            <div className="hm-actions">
              <Link className="hm-button" href="#first-expression">Discover What&apos;s Next</Link>
              <Link className="hm-link" href="/about-us">Explore Our Story</Link>
            </div>
          </div>
          <div className="hm-hero-art">
            <Image src={heroImage} alt="A pencil sketch of a floral summer wrap dress and a woven straw bag, shown from the shoulders down" priority placeholder="blur" sizes="(max-width: 900px) 100vw, 56vw" />
          </div>
        </div>
        <div className="page-wrap hm-hero-foot" aria-hidden="true">
          <span>Wear what feels like you.</span>
          <span>The first drop is on its way</span>
        </div>
      </section>

      <section className="hm-belief page-wrap" aria-labelledby="belief-title">
        <div className="hm-belief-art reveal">
          <Image src={beliefImage} alt="A pencil sketch of a belted summer dress with a full skirt and a small flower print, shown from the shoulders down" placeholder="blur" sizes="(max-width: 900px) 100vw, 40vw" />
          <span aria-hidden="true">What we believe</span>
        </div>
        <div className="hm-belief-copy reveal">
          <p className="hm-eyebrow">What we believe</p>
          <h2 id="belief-title">Fashion is more than what you wear. <em>It&apos;s what you choose to express.</em></h2>
          <div className="hm-prose">
            <p>At Invidzz, we believe style should never feel like someone else&apos;s definition of you.</p>
            <p>We&apos;re building a fashion label around original designs, considered craftsmanship, and the freedom to make every look your own.</p>
            <p>From distinctive silhouettes to personal touches, we&apos;re creating a space for those who see fashion as an extension of who they are.</p>
          </div>
          <p className="hm-closing">This is your style. Your statement. Your Invidzz.</p>
        </div>
      </section>

      <Strip phrases={["Wear what feels like you", "Made to be yours", "Your style", "Your statement", "Your Invidzz"]} />

      <section className="hm-collection" id="first-expression" aria-labelledby="collection-title">
        <div className="page-wrap">
          <div className="hm-collection-head reveal">
            <div>
              <p className="hm-eyebrow">Something different is taking shape</p>
              <h2 id="collection-title">The first <em>expression.</em></h2>
            </div>
            <p className="hm-lede">Thoughtfully designed. Distinctly Invidzz. A collection for those who find their own way of standing out.</p>
          </div>
          <div className="hm-mood">
            {moodboard.map((item, index) => (
              <figure className={`hm-mood-item hm-mood-${index + 1} reveal`} key={item.image.src}>
                <Image src={item.image} alt={item.alt} placeholder="blur" sizes={item.sizes} />
              </figure>
            ))}
            <div className="hm-mood-note reveal">
              <p className="hm-drop">The first drop is on its way.</p>
              <p>Mood imagery, for now. The collection itself stays under wraps a little longer.</p>
              <Link className="hm-link" href="#early-access">Be the first to see it</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hm-custom page-wrap" aria-labelledby="custom-title">
        <div className="hm-custom-copy reveal">
          <p className="hm-eyebrow">A different way to create</p>
          <h2 id="custom-title">What if your clothes could start with <em>your ideas?</em></h2>
          <div className="hm-prose">
            <p>We&apos;re working towards a more personal kind of fashion — one where you don&apos;t just choose a design, but get a chance to make it your own.</p>
            <p>A little more you. A little less ordinary.</p>
          </div>
          <p className="hm-tag">Personal style, reimagined.</p>
          <Link className="hm-link" href="/try-customise">See where it starts</Link>
        </div>
        <div className="hm-custom-art reveal">
          <Image src={customiseImage} alt="A designer's hands sketching a garment in pencil on white paper" placeholder="blur" sizes="(max-width: 900px) 100vw, 52vw" />
        </div>
      </section>

      <Strip reverse phrases={["A little more you", "A little less ordinary", "Original designs", "Personal style, reimagined", "The first drop is on its way"]} />

      <section className="hm-manifesto" aria-labelledby="manifesto-title">
        <div className="page-wrap">
          <p className="hm-eyebrow">The Invidzz point of view</p>
          <h2 id="manifesto-title" className="reveal">We don&apos;t believe in dressing like <em>everyone else.</em></h2>
          <div className="hm-manifesto-body reveal">
            <p>We believe in experimenting. In evolving. In wearing what feels right to you, not just what the world says is right.</p>
            <p>Some days, understated. Some days, impossible to ignore. Always your choice.</p>
          </div>
          <p className="hm-manifesto-tag reveal">Wear what feels like you.</p>
        </div>
      </section>

      <section className="hm-early" id="early-access" aria-labelledby="early-title">
        <div className="page-wrap hm-early-inner">
          <div className="reveal">
            <p className="hm-eyebrow">You&apos;re early. We like that.</p>
            <h2 id="early-title">Be part of <em>what&apos;s coming.</em></h2>
          </div>
          <div className="reveal">
            <p className="hm-lede">First looks. Behind-the-scenes moments. New designs before the reveal. Get closer to the world of Invidzz.</p>
            <EarlyAccessForm />
          </div>
        </div>
      </section>
    </main>
  );
}
