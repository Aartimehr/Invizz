import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main>
      <section className="about-hero page-wrap">
        <div>
          <p className="eyebrow">A little about us</p>
          <h1>We’re here for<br /><em>the feeling.</em></h1>
          <p>That moment when you get dressed and it just feels right. That’s where Invidzz begins.</p>
        </div>
        <div className="about-hero-photo">
          <Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=85" alt="A confident expression of personal style" fill priority sizes="(max-width: 760px) 100vw, 55vw" />
          <span>Our kind of everyday</span>
        </div>
        <span className="about-side-note">An independent point of view / Est. with intention</span>
      </section>

      <section className="about-story">
        <div className="page-wrap about-story-inner">
          <p className="eyebrow">The story so far</p>
          <h2>Invidzz started with a simple thought:<br /><em>getting dressed should feel like you.</em></h2>
          <div className="about-story-bottom">
            <span className="story-initial" aria-hidden="true">I.</span>
            <div>
              <p>Somewhere along the way, style started to feel like keeping up. We wanted to bring it back to something more personal: the pieces you reach for because they feel good, fit your life and help you show up as yourself.</p>
              <p>So we started making the kind of clothes we wanted to wear—thoughtful, versatile and quietly full of character. Invidzz is still that idea, shared with a growing community of people who believe the best style is your own.</p>
              <Link className="text-link" href="/your-styles">Come find your favourites <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about-image-break">
        <Image src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=2200&q=85" alt="A portrait celebrating confident, individual style" fill sizes="100vw" />
        <div className="about-image-caption"><p className="eyebrow eyebrow-light">Always, in your own way</p><p>Less noise.<br /><em>More you.</em></p></div>
      </section>

      <section className="about-values page-wrap">
        <div><p className="eyebrow">Our little north star</p><h2>We make clothes.<br /><em>You make them yours.</em></h2></div>
        <div className="about-values-copy"><p>We’re not here to tell you who to be. We’re here to make getting dressed a little more joyful, a little more considered, and a whole lot more you.</p><Link className="text-link" href="/our-promises">See what we stand for <span aria-hidden="true">↗</span></Link></div>
      </section>
    </main>
  );
}
