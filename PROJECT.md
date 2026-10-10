# Invidzz: project guide

Loaded into every Claude Code session through `CLAUDE.md`. Keep it current: when a decision, flow or placeholder below changes, update this file in the same change.

Last reviewed: 2026-10-11.

## What this is

Invidzz is a small, new clothing label in India selling directly to customers through this website. The brand was spelled "Invizz" until October 2026; the repo folder, `package.json` name, GitHub repo (`Aartimehr/Invizz`) and browser storage keys still use the old spelling on purpose.

## Business constraints that shape the code

- **Not registered, no business bank account, no GST.** A payment gateway (Razorpay, Cashfree) is not available yet.
- **UPI only.** The owner decided against cash on delivery. Cards are shown at checkout as "not switched on yet".
- **Payment goes to a personal UPI ID.** The site cannot see or verify payments. The owner checks their UPI app by hand.
- **Orders arrive on WhatsApp.** The customer sends a pre-filled message; that message is the only order record.
- **Receipts, not invoices.** Without GST registration the site must not say "tax invoice" or show tax lines.
- **Trust is the main product risk.** Customers prepay a new brand by UPI, so pages must state the payee name, the WhatsApp number, the refund promise and what the brand never asks for (OTP, UPI PIN, card details, scanning a QR to receive money).

Planned next stage, not started: sole-proprietor registration (Udyam), a current account, then a payment gateway.

**Admin portal (started 2026-10-10):** a separate project in the sibling folder `../Invidzz-admin` (port 3001) with Catalog, Orders and Banners pages. It currently saves to its own browser only and this website does not read from it. The owner has chosen Supabase as the shared database; once it is connected, this site will read products and banners from it and save each order at checkout. See `PROJECT.md` in that folder for the steps.

## Stack

- Next.js 16.3 App Router, React 19.2, TypeScript, Tailwind 4 (only `@import "tailwindcss"`; all styling is hand-written classes in `app/globals.css`).
- `qrcode.react` for the UPI QR. No other runtime dependencies.
- **Read `AGENTS.md` first:** this Next.js version differs from older ones; check `node_modules/next/dist/docs/` before using an API.
- **No backend.** No API routes, server actions, database, auth or environment variables. Every page is static.

## Commands

- `npm run dev`: dev server on port 3000.
- `npm run build`: production build; also the full typecheck.
- `npm run lint`: ESLint.
- There are no tests.

## Where things live

| Path | What it holds |
|---|---|
| `lib/store.ts` | Business details and policies shown to customers; UPI and WhatsApp link builders |
| `lib/products.ts` | The whole catalogue (30 pieces: men and women, three collections each), `formatPrice` |
| `lib/cart.ts` | Bag state in `localStorage`, read through `useSyncExternalStore` |
| `lib/order.ts` | Order reference, the placed order in `sessionStorage`, the WhatsApp message text |
| `components/cart-provider.tsx` | Wraps the app; owns the size dialog, the checkout dialog and the "added to bag" notice |
| `components/checkout-dialog.tsx` | Modal checkout: bag, delivery details, choose UPI app, QR |
| `components/order-form.tsx` | Older inline two-step checkout used on the single product page |
| `lib/custom-order.ts` | Customised requests: garment outlines, colours, the `CUS-XXXXXX` reference, the WhatsApp message text |
| `components/design-studio.tsx` | The drawing canvas and form on `/try-customise` |
| `components/thank-you.tsx` | Order summary and the "Send my order on WhatsApp" button |
| `components/shop-card.tsx`, `collection-page.tsx` | Product cards with Buy now and Add to cart; the men and women pages |
| `components/upi-apps.tsx` | Google Pay, PhonePe, Paytm icons (BHIM is a text label) |
| `app/globals.css` | All styles, one rule per line, mobile overrides in the `max-width: 680px` block |
| `public/invidzz-logo.png` | The logo, cropped from the owner's artwork with its dark green background |

Routes: `/`, `/your-styles`, `/your-styles/men`, `/your-styles/women`, `/your-styles/[slug]`, `/try-customise`, `/our-promises`, `/about-us`, `/thank-you`. `/how-to-order` was renamed to `/try-customise` on 2026-10-11 and redirects there (`next.config.ts`).

## How an order works

1. The customer taps **Buy now** (checks out that one piece) or **Add to cart** on a card, and picks a size.
2. The checkout dialog collects name, mobile, address, city and PIN code.
3. They choose a UPI app. The dialog shows a QR for that order with the amount and order reference (`INV-XXXXXX`) filled in. On a phone the QR is also a link that opens the chosen app.
4. When they return to the tab, or tap that they have paid, the order is saved to `sessionStorage` and they land on `/thank-you`.
5. `/thank-you` has the button that opens WhatsApp with the full order. The owner matches the payment by amount, time and payer name, then confirms and sends a receipt in the chat.

The single product page (`/your-styles/[slug]`) still uses `OrderForm`, which does the same job inline and opens WhatsApp directly without the thank-you page. The two paths should be kept consistent or merged.

## How a customised order works

1. On `/try-customise` the customer picks a piece and fabric colour, draws on the canvas, and fills in size, name, mobile number and notes.
2. The page prepares a picture of the drawing and a design reference (`CUS-XXXXXX`). The customer saves the picture, then opens WhatsApp with a pre-filled message and attaches it by hand, because a WhatsApp link cannot carry a picture.
3. The owner replies in the chat with a price and making time. Nothing is paid before that. Payment is then by UPI, arranged in the chat; the website's checkout is not involved.
4. The owner records the request by hand in the admin (Orders, Customised orders tab).

## Known limitations (by design for now)

- A drawing is lost if the customer leaves or reloads `/try-customise` before saving it.
- The site makes no promise about reply time, price, making time or returns for customised pieces. The page still shows the general 7-day returns policy, which the owner has not confirmed applies to them.
- An order is lost if the customer pays but never sends the WhatsApp message.
- Amounts are computed in the browser and could be tampered with; the owner must check the credited amount.
- No stock tracking. Set `soldOut: true` on a product by hand.
- App-specific UPI links (`tez://`, `phonepe://`, `paytmmp://`) and payments to a personal UPI ID are sometimes declined by the apps. This has not been tested with the owner's real account.

## Before launch

- `lib/store.ts` still has placeholders: `upiId`, `upiPayeeName`, `ownerName`, `city`, `email`. The WhatsApp number is real.
- Policies in `lib/store.ts` (free delivery, 12-hour confirmation, 2–4 day dispatch, 3-day refund, 7-day returns) were drafted by Claude and need the owner's confirmation.
- Prices, sizes and product photos (Unsplash) are placeholders.
- Testimonials on `/your-styles` are invented, with US and UK locations. Replace with real ones or remove.
- Footer social links point to the Instagram, Pinterest and TikTok home pages.
- The favicon is still the default.

## Conventions

- Brand name in text is "Invidzz"; the logo is the image, not text.
- Prices are whole rupees as numbers; always display with `formatPrice`.
- Customer-facing copy is plain and specific, and must not promise anything `lib/store.ts` does not back up.
- New styles go in `app/globals.css` in the existing one-line-per-rule style, using the colour variables in `:root`. Add the phone override inside the existing 680px media block.
- Browser storage access is wrapped in `try/catch`; the page must work when storage is blocked.
- Do not rename the `invizz-*` storage keys; that would empty existing customers' bags.

## Testing on a phone

The phone opens the dev server through the computer's network address or a tunnel. `allowedDevOrigins` in `next.config.ts` lists the allowed hosts; without a matching entry the page renders but nothing responds to taps. Add the host there if a new network or tunnel is used.

## Working with the owner

- The owner is not a developer. Explain in plain language, and say what was and was not checked.
- When they ask a question, answer it before changing code; build only once they say to.
- They commit and push themselves. Do not commit unless asked.
