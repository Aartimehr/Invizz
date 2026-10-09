"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useEffectEvent, useRef, useState, type FormEvent } from "react";
import { Modal } from "@/components/modal";
import { UpiAppIcon } from "@/components/upi-apps";
import { maxQuantity, type CartLine } from "@/lib/cart";
import { createReference, saveOrder, type Customer, type PlacedOrder } from "@/lib/order";
import { formatPrice, getProduct } from "@/lib/products";
import { store, upiAppLink, upiApps, upiPaymentLink, type UpiAppId } from "@/lib/store";

type Step = "bag" | "details" | "pay" | "qr";

type Props = {
  lines: CartLine[];
  fromCart: boolean;
  onQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onClose: () => void;
  onPlaced: () => void;
};

export function CheckoutDialog({ lines, fromCart, onQuantity, onRemove, onClose, onPlaced }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("bag");
  const [reference, setReference] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [appId, setAppId] = useState<UpiAppId>("bhim");
  const [cardNote, setCardNote] = useState(false);
  const leftForApp = useRef(false);

  const items = lines.flatMap((line, index) => {
    const product = getProduct(line.slug);
    return product ? [{ ...line, index, product }] : [];
  });
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + store.shippingFee;
  const pieces = items.reduce((sum, item) => sum + item.quantity, 0);
  const app = upiApps.find((candidate) => candidate.id === appId) ?? upiApps[3];

  function placedOrder(details: Customer): PlacedOrder {
    return {
      reference,
      items: items.map((item) => ({ name: item.product.name, size: item.size, quantity: item.quantity, price: item.product.price })),
      subtotal,
      shipping: store.shippingFee,
      total,
      customer: details,
      paidWith: app.name,
      fromCart,
    };
  }

  function finish() {
    if (!customer) return;
    saveOrder(placedOrder(customer), false);
    onPlaced();
    router.push("/thank-you");
  }

  // Coming back to this tab after the UPI app opened means the customer is done there.
  const onReturn = useEffectEvent(() => finish());

  useEffect(() => {
    if (step !== "qr") return;
    let wentAway = false;
    function handleVisibility() {
      if (!leftForApp.current) return;
      if (document.visibilityState === "hidden") wentAway = true;
      else if (wentAway) onReturn();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [step]);

  function handleDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    setCustomer({ name: field("name"), phone: field("phone"), address: field("address"), city: field("city"), pincode: field("pincode") });
    if (!reference) setReference(createReference());
    setStep("pay");
  }

  function handleOpenApp() {
    if (!customer) return;
    leftForApp.current = true;
    saveOrder(placedOrder(customer), true);
  }

  const summary = (
    <details className="summary-breakup">
      <summary>
        <span>Total amount</span>
        <strong>{formatPrice(total)}</strong>
        <span className="summary-toggle" aria-hidden="true">Price breakup</span>
      </summary>
      <dl className="order-summary">
        {items.map((item) => (
          <div key={`${item.slug}-${item.size}`}><dt>{item.product.name} / {item.size} × {item.quantity}</dt><dd>{formatPrice(item.product.price * item.quantity)}</dd></div>
        ))}
        <div><dt>Item total ({pieces} {pieces === 1 ? "piece" : "pieces"})</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div><dt>Delivery</dt><dd>{store.shippingFee ? formatPrice(store.shippingFee) : "Free"}</dd></div>
        <div className="order-summary-total"><dt>To pay</dt><dd>{formatPrice(total)}</dd></div>
      </dl>
    </details>
  );

  if (!items.length) {
    return (
      <Modal label="Your bag" onClose={onClose}>
        <div className="checkout">
          <p className="eyebrow">Your bag</p>
          <h2 className="modal-title">Nothing in here yet.</h2>
          <p className="order-hint">Add a piece you like and it will wait for you here.</p>
          <button className="button button-dark order-submit" type="button" onClick={onClose}>Keep looking</button>
        </div>
      </Modal>
    );
  }

  if (step === "bag") {
    return (
      <Modal label="Checkout" onClose={onClose}>
        <div className="checkout">
          <div>
            <p className="eyebrow">{fromCart ? "Your bag" : "Buy now"}</p>
            <h2 className="modal-title">Checkout</h2>
          </div>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={`${item.slug}-${item.size}`}>
                <span className={`checkout-thumb launch-image ${item.product.tone}`}>
                  <Image src={`https://images.unsplash.com/${item.product.image}?auto=format&fit=crop&w=200&q=80`} alt="" fill sizes="64px" />
                </span>
                <div className="checkout-item-copy">
                  <h3>{item.product.name}</h3>
                  <p>Size {item.size}</p>
                  <div className="quantity">
                    <button type="button" aria-label={`One less ${item.product.name}`} disabled={item.quantity <= 1} onClick={() => onQuantity(item.index, item.quantity - 1)}>−</button>
                    <span aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                    <button type="button" aria-label={`One more ${item.product.name}`} disabled={item.quantity >= maxQuantity} onClick={() => onQuantity(item.index, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="checkout-item-side">
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                  <button className="link-button" type="button" onClick={() => onRemove(item.index)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p className="field-label checkout-label">Order summary</p>
            {summary}
          </div>
          <button className="button button-dark order-submit" type="button" onClick={() => setStep("details")}>
            Proceed to checkout <span aria-hidden="true">↗</span>
          </button>
        </div>
      </Modal>
    );
  }

  if (step === "details") {
    return (
      <Modal label="Delivery details" onClose={onClose}>
        <form className="checkout" onSubmit={handleDetails}>
          <div className="checkout-head">
            <p className="eyebrow">Step 1 of 2 / Delivery</p>
            <button className="link-button" type="button" onClick={() => setStep("bag")}>← Back to bag</button>
          </div>
          <h2 className="modal-title">Where should we send it?</h2>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Full name</span>
              <input name="name" autoComplete="name" defaultValue={customer?.name} required />
            </label>
            <label className="field">
              <span className="field-label">Mobile number</span>
              <input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" title="10-digit mobile number" defaultValue={customer?.phone} required />
            </label>
          </div>
          <label className="field">
            <span className="field-label">Delivery address</span>
            <textarea name="address" rows={3} autoComplete="street-address" defaultValue={customer?.address} required />
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">City</span>
              <input name="city" autoComplete="address-level2" defaultValue={customer?.city} required />
            </label>
            <label className="field">
              <span className="field-label">PIN code</span>
              <input name="pincode" inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" title="6-digit PIN code" defaultValue={customer?.pincode} required />
            </label>
          </div>
          {summary}
          <button className="button button-dark order-submit" type="submit">
            Continue to payment <span aria-hidden="true">↗</span>
          </button>
        </form>
      </Modal>
    );
  }

  if (step === "pay") {
    return (
      <Modal label="Choose how to pay" onClose={onClose}>
        <div className="checkout">
          <div className="checkout-head">
            <p className="eyebrow">Step 2 of 2 / Payment</p>
            <button className="link-button" type="button" onClick={() => setStep("details")}>← Edit details</button>
          </div>
          <h2 className="modal-title">Pay {formatPrice(total)}</h2>

          <section className="pay-method">
            <h3>UPI</h3>
            <p className="order-hint">Pick the app you use. We&apos;ll show a QR code with your amount filled in.</p>
            <div className="pay-apps">
              {upiApps.map((candidate) => (
                <button className="pay-app" type="button" key={candidate.id} aria-label={`Pay with ${candidate.name}`} onClick={() => { setAppId(candidate.id); setStep("qr"); }}>
                  <UpiAppIcon name={candidate.name} />
                </button>
              ))}
            </div>
          </section>

          <section className="pay-method">
            <h3>Cards</h3>
            <button className="pay-card" type="button" aria-describedby="card-note" onClick={() => setCardNote(true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 9.5h19M6 15h4" /></svg>
              <span>Credit or debit card</span>
              <small>Coming soon</small>
            </button>
            <p className="order-hint" id="card-note" aria-live="polite">
              {cardNote ? "Card payments aren't switched on yet. Please pay by UPI for now." : "Visa, Mastercard and RuPay."}
            </p>
          </section>

          {summary}
        </div>
      </Modal>
    );
  }

  const qrValue = upiPaymentLink(total, reference);

  return (
    <Modal label={`Pay with ${app.name}`} onClose={onClose}>
      <div className="checkout">
        <div className="checkout-head">
          <p className="eyebrow">Order {reference}</p>
          <button className="link-button" type="button" onClick={() => setStep("pay")}>← Other ways to pay</button>
        </div>
        <h2 className="modal-title">Pay {formatPrice(total)} with {app.name}</h2>

        <div className="qr-panel">
          <a className="upi-qr qr-link" href={upiAppLink(appId, total, reference)} onClick={handleOpenApp} aria-label={`Open ${app.name} to pay ${formatPrice(total)}`}>
            <QRCodeSVG value={qrValue} size={188} marginSize={2} title={`UPI QR code to pay ${formatPrice(total)} to ${store.upiPayeeName}`} />
            <span>Tap to open {app.name}</span>
          </a>
          <div className="upi-copy">
            <p><strong>On your phone:</strong> tap the QR code. {app.name} opens with the amount filled in.</p>
            <p><strong>On a computer:</strong> scan the QR code with any UPI app.</p>
            <p>Before you pay, check that your app shows the name:</p>
            <p className="upi-payee">{store.upiPayeeName}</p>
          </div>
        </div>

        <a className="button button-outline order-submit" href={qrValue} onClick={handleOpenApp}>Use a different UPI app <span aria-hidden="true">↗</span></a>
        <button className="button button-dark order-submit" type="button" onClick={finish}>I&apos;ve paid <span aria-hidden="true">↗</span></button>
        <p className="order-hint">After you pay, come back to this tab and we&apos;ll take you to your order. We never ask for an OTP or your UPI PIN.</p>
      </div>
    </Modal>
  );
}
