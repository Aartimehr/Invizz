"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState, type FormEvent } from "react";
import { UpiApps } from "@/components/upi-apps";
import { formatPrice, type Product } from "@/lib/products";
import { store, upiPaymentLink, whatsappLink } from "@/lib/store";

type Order = {
  reference: string;
  size: string;
  quantity: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

function createReference() {
  return `INV-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

export function OrderForm({ product }: { product: Product }) {
  const [step, setStep] = useState<"details" | "pay">("details");
  const [order, setOrder] = useState<Order | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paidFrom, setPaidFrom] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState<string | null>(null);

  const total = product.price * quantity + store.shippingFee;

  function handleDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    setOrder({
      reference: order?.reference ?? createReference(),
      size: field("size"),
      quantity,
      name: field("name"),
      phone: field("phone"),
      address: field("address"),
      city: field("city"),
      pincode: field("pincode"),
    });
    setConfirmUrl(null);
    setStep("pay");
  }

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(store.upiId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function handlePaid(current: Order) {
    const message = [
      `Hi ${store.name}! I've placed an order and paid by UPI.`,
      "",
      `Order ref: ${current.reference}`,
      `Item: ${product.name}`,
      `Size: ${current.size}`,
      `Quantity: ${current.quantity}`,
      `Amount paid: ${formatPrice(total)}`,
      ...(paidFrom.trim() ? [`Paid from the UPI account of: ${paidFrom.trim()}`] : []),
      "",
      `Name: ${current.name}`,
      `Phone: ${current.phone}`,
      `Address: ${current.address}`,
      `City: ${current.city}`,
      `PIN code: ${current.pincode}`,
      "",
      "I'm attaching my payment screenshot.",
    ].join("\n");

    const url = whatsappLink(message);
    setConfirmUrl(url);
    window.open(url, "_blank", "noopener");
  }

  if (step === "pay" && order) {
    const paymentLink = upiPaymentLink(total, order.reference);

    return (
      <div className="order-form">
        <div className="checkout-head">
          <p className="eyebrow">Checkout / Step 2 of 2</p>
          <button className="link-button" type="button" onClick={() => setStep("details")}>← Edit details</button>
        </div>

        <dl className="order-summary">
          <div><dt>Order reference</dt><dd>{order.reference}</dd></div>
          <div><dt>{product.name} / {order.size} × {order.quantity}</dt><dd>{formatPrice(product.price * order.quantity)}</dd></div>
          <div><dt>Delivery</dt><dd>{store.shippingFee ? formatPrice(store.shippingFee) : "Free"}</dd></div>
          <div className="order-summary-total"><dt>To pay</dt><dd>{formatPrice(total)}</dd></div>
        </dl>

        <div className="upi-panel">
          <div className="upi-qr">
            <QRCodeSVG value={paymentLink} size={188} marginSize={2} title={`UPI QR code to pay ${formatPrice(total)} to ${store.upiPayeeName}`} />
          </div>
          <div className="upi-copy">
            <h3>Scan with any UPI app</h3>
            <p>The amount is already filled in. Before you pay, check that your app shows the name:</p>
            <p className="upi-payee">{store.upiPayeeName}</p>
            <UpiApps />
          </div>
        </div>

        <div className="upi-alt">
          <p className="field-label">On your phone?</p>
          <a className="button button-outline" href={paymentLink}>Open my UPI app <span aria-hidden="true">↗</span></a>
          <p className="order-hint">
            Or pay {formatPrice(total)} to <strong>{store.upiId}</strong>{" "}
            <button className="link-button" type="button" onClick={copyUpiId}>{copied ? "Copied" : "Copy UPI ID"}</button>
          </p>
        </div>

        <label className="field">
          <span className="field-label">Paid from someone else&apos;s account? (optional)</span>
          <input value={paidFrom} onChange={(event) => setPaidFrom(event.target.value)} placeholder="Their name, so we can match the payment" />
        </label>

        <button className="button button-dark order-submit" type="button" onClick={() => handlePaid(order)}>
          I&apos;ve paid. Send my order on WhatsApp <span aria-hidden="true">↗</span>
        </button>
        <p className="order-hint">
          This opens a ready-made WhatsApp message to {store.whatsappDisplay}. We check the payment, then confirm your order and send your receipt within {store.confirmWithin}. If we can&apos;t fulfil it, we refund the full amount to the same UPI account within {store.refundDays} working days.
        </p>

        <div aria-live="polite">
          {confirmUrl ? (
            <div className="order-sent">
              <p className="eyebrow">One step left</p>
              <h3>Press send in WhatsApp.</h3>
              <p>Attach your payment screenshot in the chat if you can. Your order reference is <strong>{order.reference}</strong>, and our reply will quote it.</p>
              <a className="text-link" href={confirmUrl} target="_blank" rel="noopener noreferrer">WhatsApp didn&apos;t open? Tap here <span aria-hidden="true">↗</span></a>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form className="order-form" onSubmit={handleDetails}>
      <p className="eyebrow">Checkout / Step 1 of 2</p>

      <fieldset className="field">
        <legend className="field-label">Size</legend>
        <div className="choice-row">
          {product.sizes.map((size) => (
            <label className="choice" key={size}>
              <input type="radio" name="size" value={size} defaultChecked={order?.size === size} required />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field field-narrow">
        <span className="field-label">Quantity</span>
        <select name="quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
          {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}
        </select>
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field-label">Full name</span>
          <input name="name" autoComplete="name" defaultValue={order?.name} required />
        </label>
        <label className="field">
          <span className="field-label">Mobile number</span>
          <input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" title="10-digit mobile number" defaultValue={order?.phone} required />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Delivery address</span>
        <textarea name="address" rows={3} autoComplete="street-address" defaultValue={order?.address} required />
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field-label">City</span>
          <input name="city" autoComplete="address-level2" defaultValue={order?.city} required />
        </label>
        <label className="field">
          <span className="field-label">PIN code</span>
          <input name="pincode" inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" title="6-digit PIN code" defaultValue={order?.pincode} required />
        </label>
      </div>

      <div className="order-total">
        <span>Total{store.shippingFee ? ` (incl. ${formatPrice(store.shippingFee)} delivery)` : " (free delivery)"}</span>
        <strong>{formatPrice(total)}</strong>
      </div>

      <button className="button button-dark order-submit" type="submit">
        Proceed to checkout <span aria-hidden="true">↗</span>
      </button>
      <p className="order-hint">
        Next you&apos;ll pay by UPI (Google Pay, PhonePe, Paytm, BHIM or any UPI app). We never ask for card details, an OTP or your UPI PIN. <Link href="/try-customise#how-to-order">How ordering works</Link>
      </p>
    </form>
  );
}
