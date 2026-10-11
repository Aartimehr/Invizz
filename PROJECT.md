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
- **Almost no backend.** No server actions, database or auth. Every page is static. The one exception is `app/api/early-access/route.ts`, which receives the homepage email sign-up and forwards it to the address in the `EARLY_ACCESS_WEBHOOK_URL` environment variable (the only one). While that is unset it answers "not-configured" and the form tells the visitor the list is not open and offers WhatsApp instead. The form must never show success unless the mailing list accepted the address.

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
| `public/invidzz-logo-2026.png` | The logo (changed 2026-10-11): the IN monogram above the INVIDZZ wordmark, dark ink on a see-through background, made from the owner's artwork in `photo-originals/logo`. The footer flips it to ivory with a CSS filter. Give a future logo a new file name so browsers do not keep showing the old one |
| `app/icon.png` | The browser-tab icon: the IN monogram on cream |
| `app/page.tsx` | The homepage (redesigned 2026-10-11 as a brand-launch teaser): hero, belief, collection teaser, customisation, manifesto, early access. Its styles are the `.hm-*` and `.early-*` classes |
| `components/early-access-form.tsx` | The homepage email sign-up form |
| `components/reveal-on-scroll.tsx` | Homepage motion: fades each `.reveal` block up as it scrolls into view. The opening animation and the timings are in `app/globals.css` under `prefers-reduced-motion: no-preference` |
| `public/home/*.jpg` | Homepage pictures. Six are pencil-sketch versions (made 2026-10-11) of temporary Unsplash photographs; `customise.jpg` is still the photograph, at the owner's request. `hero.jpg` is a faceless summer-dress sketch traced from the same Unsplash photo as the "Daylight Dress" product and `belief.jpg` is the same kind of sketch traced from the "Poppy Day Dress" product photo (the earlier winter pictures are `hero-winter*.jpg` and `belief-winter*.jpg` in `photo-originals/home`). Replace one by saving the new picture over the same file name |
| `public/pages/*.jpg` | The same kind of sketch: `about-1.jpg` for the top of `/about-us`, `promises.jpg` for `/our-promises` |
| `app/about-us/page.tsx` | Our Story (redesigned 2026-10-11 from the owner's copy and reference picture): dark and ivory bands, styles are the `.st-*` classes. It describes customisation as planned, not available, and must not promise that any uploaded design can be made |
| `components/story-interactive.tsx` | The interactive parts of Our Story: style picker, picture teaser, the "details" tablet preview and the four-stage timeline. Nothing is saved or sent; a chosen picture never leaves the visitor's browser |
| `photo-originals/` | The original photographs behind every sketch, and `sketch.js`, the script that converts a photograph (run it with `NODE_PATH=node_modules`). Not published. Product photos and the pictures on the locked pages are still photographs loaded from Unsplash |

Routes: `/`, `/your-styles`, `/your-styles/men`, `/your-styles/women`, `/your-styles/[slug]`, `/try-customise`, `/our-promises`, `/about-us`, `/thank-you`. `/how-to-order` was renamed to `/try-customise` on 2026-10-11 and redirects there (`next.config.ts`).

**`/your-styles`, `/your-styles/men`, `/your-styles/women` and `/try-customise` are locked (2026-10-11):** their sections are blurred and unusable behind a "Locked for now" notice that points to early access (`components/locked-notice.tsx`, `.locked-*` classes). The comment at the top of each page (and of `components/collection-page.tsx` for men and women) says how to unlock it. The single product pages are not locked: no page links to them any more, but a direct address still opens one and its order form works. Their "How ordering works" link points to the locked `/try-customise#how-to-order`.

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
- The testimonials section on `/your-styles` is commented out (2026-10-11) because its reviews are invented, with US and UK locations. Bring it back only with real ones.
- The footer shows social links only for accounts with a real address in `store.social` (`lib/store.ts`); all are empty.
- The early-access sign-up is not connected: set `EARLY_ACCESS_WEBHOOK_URL` in Vercel to a mailing-list or form service address that accepts a JSON `{ email }` POST.
- The homepage pictures in `public/home` are sketches traced from temporary Unsplash photographs, and the collection teaser says so ("Mood imagery, for now").
- `metadataBase` in `app/layout.tsx` is `https://invizz.vercel.app`; change it if the site moves to its own domain.
- The admin portal (`../Invidzz-admin`) still shows the old logo.

## Conventions

- Palette (`:root` in `app/globals.css`): warm ivory `--paper`, soft cream `--cream`, charcoal `--ink`, taupe `--taupe` (decoration only; use `--stone` for small text), burgundy `--burgundy` as the homepage accent. Older pages still use `--olive` and `--rust` accents and Georgia headings; the homepage, header and footer use `--font-display` (Instrument Serif).
- The homepage makes no claims about products, prices or launch dates, and none of its pictures is presented as a piece from the collection.
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
