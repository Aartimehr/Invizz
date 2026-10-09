"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { orderMessage, orderStore } from "@/lib/order";
import { formatPrice } from "@/lib/products";
import { store, whatsappLink } from "@/lib/store";

export function ThankYou() {
  const order = useSyncExternalStore(orderStore.subscribe, orderStore.getSnapshot, orderStore.getServerSnapshot);

  if (!order) {
    return (
      <section className="thanks page-wrap">
        <p className="eyebrow">Thank you</p>
        <h1>Thanks for<br /><em>stopping by.</em></h1>
        <p className="thanks-copy">We can&apos;t find a recent order in this browser. If you&apos;ve paid, message us on WhatsApp at {store.whatsappDisplay} with your payment screenshot and we&apos;ll sort it out.</p>
        <Link className="text-link" href="/your-styles">Back to the collection <span aria-hidden="true">↗</span></Link>
      </section>
    );
  }

  const firstName = order.customer.name.split(" ")[0];

  return (
    <section className="thanks page-wrap">
      <div>
        <p className="eyebrow">Order {order.reference}</p>
        <h1>Thank you,<br /><em>{firstName}.</em></h1>
        <p className="thanks-copy">One step left. Send us your order on WhatsApp so we can match your payment. A real person confirms it within {store.confirmWithin} and sends your receipt.</p>
        <a className="button button-dark thanks-send" href={whatsappLink(orderMessage(order))} target="_blank" rel="noopener noreferrer">
          Send my order on WhatsApp <span aria-hidden="true">↗</span>
        </a>
        <p className="order-hint">Payment didn&apos;t go through? Nothing leaves your account until you approve it in your UPI app. <Link href="/your-styles">Go back and try again</Link>.</p>
      </div>
      <div className="thanks-order">
        <p className="field-label">Your order</p>
        <dl className="order-summary">
          {order.items.map((item) => (
            <div key={`${item.name}-${item.size}`}><dt>{item.name} / {item.size} × {item.quantity}</dt><dd>{formatPrice(item.price * item.quantity)}</dd></div>
          ))}
          <div><dt>Delivery</dt><dd>{order.shipping ? formatPrice(order.shipping) : "Free"}</dd></div>
          <div className="order-summary-total"><dt>Paid with {order.paidWith}</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
        <p className="order-hint">Delivering to {order.customer.name}, {order.customer.address}, {order.customer.city} {order.customer.pincode}. Dispatched in {store.dispatchDays} working days.</p>
      </div>
    </section>
  );
}
