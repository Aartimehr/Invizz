import { formatPrice } from "@/lib/products";
import { store } from "@/lib/store";

export type Customer = { name: string; phone: string; address: string; city: string; pincode: string };

export type PlacedOrder = {
  reference: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: Customer;
  paidWith: string;
  fromCart: boolean;
};

const orderKey = "invizz-order";
// Set when the customer leaves for their UPI app, so a tab the phone reloaded still lands on the thank-you page.
const awaitingKey = "invizz-awaiting-return";

let raw: string | null = null;
let parsed: PlacedOrder | null = null;

export function createReference() {
  return `INV-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

export function saveOrder(order: PlacedOrder, awaitingReturn: boolean) {
  try {
    sessionStorage.setItem(orderKey, JSON.stringify(order));
    if (awaitingReturn) sessionStorage.setItem(awaitingKey, "1");
    else sessionStorage.removeItem(awaitingKey);
  } catch {
    // Without storage the thank-you page falls back to its generic message.
  }
}

export function takeAwaitingOrder() {
  try {
    if (!sessionStorage.getItem(awaitingKey)) return null;
    sessionStorage.removeItem(awaitingKey);
  } catch {
    return null;
  }
  return orderStore.getSnapshot();
}

export const orderStore = {
  subscribe() {
    return () => {};
  },
  getSnapshot() {
    let current: string | null = null;
    try {
      current = sessionStorage.getItem(orderKey);
    } catch {
      current = null;
    }
    if (current !== raw) {
      raw = current;
      try {
        parsed = current ? (JSON.parse(current) as PlacedOrder) : null;
      } catch {
        parsed = null;
      }
    }
    return parsed;
  },
  getServerSnapshot() {
    return null;
  },
};

export function orderMessage(order: PlacedOrder) {
  return [
    `Hi ${store.name}! I've placed an order and paid by UPI (${order.paidWith}).`,
    "",
    `Order ref: ${order.reference}`,
    ...order.items.map((item) => `${item.name} / ${item.size} × ${item.quantity}: ${formatPrice(item.price * item.quantity)}`),
    `Delivery: ${order.shipping ? formatPrice(order.shipping) : "Free"}`,
    `Amount paid: ${formatPrice(order.total)}`,
    "",
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
    `City: ${order.customer.city}`,
    `PIN code: ${order.customer.pincode}`,
    "",
    "I'm attaching my payment screenshot.",
  ].join("\n");
}
