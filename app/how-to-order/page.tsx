import type { Metadata } from "next";
import Link from "next/link";
import { UpiApps } from "@/components/upi-apps";
import { store } from "@/lib/store";

export const metadata: Metadata = {
  title: "How ordering works",
  description: "How to order from Invizz, how UPI payment works, and how to check it's really us before you pay.",
};

const steps = [
  {
    number: "01",
    title: "Pick your piece",
    description: "Choose your size and tell us where to send it. We only ask for what we need to deliver your order.",
    detail: "No account needed",
  },
  {
    number: "02",
    title: "Pay by UPI",
    description: `At checkout you'll see a QR code with your exact amount filled in. Scan it with any UPI app. Your app will show the name ${store.upiPayeeName} before you pay.`,
    detail: "Any UPI app",
  },
  {
    number: "03",
    title: "Send us your order",
    description: `Tap "I've paid" and a ready-made WhatsApp message with your order opens for you to send to ${store.whatsappDisplay}. You message us; we never message you first asking for money.`,
    detail: "You start the chat",
  },
  {
    number: "04",
    title: "We confirm, personally",
    description: `A real person checks your payment and replies within ${store.confirmWithin}, quoting your order reference, with your receipt and delivery date.`,
    detail: "Receipt on WhatsApp",
  },
  {
    number: "05",
    title: "On its way",
    description: `We dispatch in ${store.dispatchDays} working days and send you the tracking number with a photo of your packed parcel.`,
    detail: "Tracked delivery",
  },
];

const checks = [
  `The QR and UPI ID are the ones on this website. Your UPI app shows the name ${store.upiPayeeName} and the ID ${store.upiId}.`,
  `Our WhatsApp number is ${store.whatsappDisplay}. Replies about your order come only from this number and quote your order reference.`,
  "We never ask for an OTP, your UPI PIN, card details or remote access to your phone.",
  "We never send a QR or link to “receive” a refund. Refunds arrive in your account on their own; you never scan or approve anything to get money.",
];

export default function HowToOrderPage() {
  return (
    <main>
      <section className="page-hero page-wrap">
        <div>
          <p className="eyebrow">Ordering, plainly explained</p>
          <h1>How ordering<br /><em>works here.</em></h1>
        </div>
        <p className="page-hero-note">We&apos;re a small, new label. Until our full online checkout is live, we take payment by UPI and confirm every order ourselves on WhatsApp. Here is exactly what to expect.</p>
      </section>

      <section className="promise-list-section">
        <div className="page-wrap">
          <div className="section-title-row"><div><p className="eyebrow">From checkout to your door</p><h2>Five simple steps</h2></div><p className="section-note">No surprises, and a real person at every step.</p></div>
          <div className="promise-list">
            {steps.map((step) => (
              <article className="promise-item" key={step.number}>
                <span className="promise-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
                <span className="promise-detail">{step.detail}</span>
              </article>
            ))}
          </div>
        </div>
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
    </main>
  );
}
