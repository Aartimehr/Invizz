import type { Metadata } from "next";
import Link from "next/link";
import { DesignStudio } from "@/components/design-studio";
import { LockedNotice } from "@/components/locked-notice";
import { UpiApps } from "@/components/upi-apps";
import { store } from "@/lib/store";

export const metadata: Metadata = {
  title: "Try Customise",
  description: "Draw the piece you want to wear and send it to Invidzz. See how a customised order works and how to check it's really us before you pay.",
};

const steps = [
  {
    number: "01",
    title: "Draw it",
    description: "Pick a piece and a fabric colour, then draw or paint your idea on the canvas. A rough sketch is enough.",
  },
  {
    number: "02",
    title: "Tell us your size",
    description: "Add your size, name and mobile number, and any notes about fabric, fit or where a print should go.",
  },
  {
    number: "03",
    title: "Send it on WhatsApp",
    description: `Save your drawing, then send it with the ready-made message to ${store.whatsappDisplay}. You message us; we never message you first asking for money.`,
  },
  {
    number: "04",
    title: "We reply with a price",
    description: "A real person looks at your drawing and replies in the same chat, quoting your design reference, with the price and how long it will take. If it's something we can't make, we say so. Nothing is paid until you say yes.",
  },
  {
    number: "05",
    title: "Pay by UPI, and we make it",
    description: `Once you agree, pay by UPI. Your app will show the name ${store.upiPayeeName} before you pay. We check the payment, send your receipt and start making your piece.`,
  },
];

const checks = [
  `The QR and UPI ID are the ones on this website. Your UPI app shows the name ${store.upiPayeeName} and the ID ${store.upiId}.`,
  `Our WhatsApp number is ${store.whatsappDisplay}. Replies about your order come only from this number and quote your order reference.`,
  "We never ask for an OTP, your UPI PIN, card details or remote access to your phone.",
  "We never send a QR or link to “receive” a refund. Refunds arrive in your account on their own; you never scan or approve anything to get money.",
];

export default function TryCustomisePage() {
  return (
    <main className="locked-page">
      {/* The page is locked for now: everything in locked-content is blurred and cannot be used.
          To unlock it, remove the LockedNotice and the locked-content wrapper (keep what is inside it). */}
      <LockedNotice text="Designing your own piece is on its way. This page opens when it is ready." />
      <div className="locked-content" inert aria-hidden="true">
      <section className="page-hero page-wrap">
        <div>
          <p className="eyebrow">Made your way</p>
          <h1>Try<br /><em>customise.</em></h1>
        </div>
        <p className="page-hero-note">Have a piece in mind that isn&apos;t in our collection? Draw it here and send it to us. We reply on WhatsApp with a price before you pay anything.</p>
      </section>

      <section className="custom-section page-wrap">
        <DesignStudio />
        <aside className="custom-steps" id="how-to-order">
          <p className="eyebrow">From your drawing to your door</p>
          <h2>How to order</h2>
          <ol>
            {steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="trust-section page-wrap">
        <div>
          <p className="eyebrow">Before you pay anyone</p>
          <h2>How to know<br /><em>it&apos;s really us.</em></h2>
          <UpiApps />
        </div>
        <ul className="trust-list">
          {checks.map((check) => <li key={check}>{check}</li>)}
        </ul>
      </section>

      <section className="policy-section">
        <div className="page-wrap policy-grid">
          <article>
            <p className="eyebrow">If we can&apos;t fulfil it</p>
            <h3>Full refund</h3>
            <p>If a piece is unavailable or we can&apos;t deliver to you, we refund the full amount to the UPI account you paid from within {store.refundDays} working days.</p>
          </article>
          <article>
            <p className="eyebrow">If it isn&apos;t right</p>
            <h3>Returns and exchanges</h3>
            <p>Message us within {store.returnWindowDays} days of delivery. Send the piece back unworn with its tags, and we&apos;ll exchange it or refund you to the same UPI account.</p>
          </article>
          <article>
            <p className="eyebrow">Who you&apos;re buying from</p>
            <h3>{store.name}</h3>
            <p>Run by {store.ownerName}, {store.city}.<br />WhatsApp {store.whatsappDisplay}<br /><a href={`mailto:${store.email}`}>{store.email}</a></p>
          </article>
        </div>
      </section>

      <section className="promise-end">
        <p className="eyebrow eyebrow-light">Ready when you are</p>
        <h2>Find the piece<br /><em>that feels like you.</em></h2>
        <Link className="button button-light" href="/your-styles">Explore the collection <span aria-hidden="true">↗</span></Link>
      </section>
      </div>
    </main>
  );
}
