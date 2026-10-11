// Everything a customer uses to check we're real lives here.
// Replace every placeholder before sharing the site.
export const store = {
  name: "Invidzz",
  // Country code + number, digits only (no "+", spaces or dashes).
  whatsappNumber: "917827351031",
  whatsappDisplay: "+91 78273 51031",
  upiId: "yourname@bank",
  // Exactly as it appears in the customer's UPI app when they scan the QR.
  upiPayeeName: "Your Name As Shown In UPI",
  ownerName: "Your Full Name",
  city: "Your City, State",
  email: "hello@example.com",
  // Flat delivery charge in rupees. 0 means free delivery.
  shippingFee: 0,
  confirmWithin: "12 hours",
  dispatchDays: "2–4",
  refundDays: 3,
  returnWindowDays: 7,
  // Full addresses of our real accounts, e.g. "https://www.instagram.com/yourhandle". An empty one is left out of the footer.
  social: { Instagram: "", Pinterest: "", YouTube: "" },
};

export function upiPaymentLink(amount: number, reference: string) {
  const params = { pa: store.upiId, pn: store.upiPayeeName, am: amount.toFixed(2), cu: "INR", tn: reference };
  // UPI apps expect %20 for spaces, which URLSearchParams would write as "+".
  const query = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
  return `upi://pay?${query}`;
}

export const upiApps = [
  { id: "gpay", name: "Google Pay", scheme: "tez://upi/pay" },
  { id: "phonepe", name: "PhonePe", scheme: "phonepe://pay" },
  { id: "paytm", name: "Paytm", scheme: "paytmmp://pay" },
  { id: "bhim", name: "BHIM UPI", scheme: "upi://pay" },
] as const;

export type UpiAppId = (typeof upiApps)[number]["id"];

// Same payment as the QR code, addressed to one app so the phone opens that app directly.
export function upiAppLink(appId: UpiAppId, amount: number, reference: string) {
  const app = upiApps.find((candidate) => candidate.id === appId) ?? upiApps[3];
  return upiPaymentLink(amount, reference).replace("upi://pay", app.scheme);
}

export function whatsappLink(message: string) {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
