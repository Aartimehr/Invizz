"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { SizeDialog, type SizeIntent } from "@/components/size-dialog";
import { addLine, cartStore, type CartLine } from "@/lib/cart";
import { takeAwaitingOrder } from "@/lib/order";
import type { Product } from "@/lib/products";

type CartContextValue = {
  count: number;
  pickSize: (product: Product, intent: SizeIntent) => void;
  openCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [sizeRequest, setSizeRequest] = useState<{ product: Product; intent: SizeIntent } | null>(null);
  // Buy now checks out one piece on its own and leaves the bag untouched.
  const [buyLine, setBuyLine] = useState<CartLine | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Phones often reload the tab while the customer is in their UPI app.
  useEffect(() => {
    const order = takeAwaitingOrder();
    if (!order) return;
    if (order.fromCart) cartStore.set([]);
    router.replace("/thank-you");
  }, [router]);

  const value = useMemo<CartContextValue>(() => ({
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    pickSize: (product, intent) => setSizeRequest({ product, intent }),
    openCart: () => { setBuyLine(null); setCheckoutOpen(true); },
  }), [lines]);

  function handleSize(size: string) {
    if (!sizeRequest) return;
    const { product, intent } = sizeRequest;
    setSizeRequest(null);
    if (intent === "buy") {
      setBuyLine({ slug: product.slug, size, quantity: 1 });
      setCheckoutOpen(true);
      return;
    }
    cartStore.set(addLine(lines, product.slug, size));
    setNotice(`${product.name}, size ${size}, is in your bag.`);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 5000);
  }

  function closeCheckout() {
    setCheckoutOpen(false);
    setBuyLine(null);
  }

  function handleQuantity(index: number, quantity: number) {
    if (buyLine) setBuyLine({ ...buyLine, quantity });
    else cartStore.set(lines.map((line, position) => (position === index ? { ...line, quantity } : line)));
  }

  function handleRemove(index: number) {
    if (buyLine) closeCheckout();
    else cartStore.set(lines.filter((_, position) => position !== index));
  }

  function handlePlaced() {
    if (!buyLine) cartStore.set([]);
    closeCheckout();
  }

  return (
    <CartContext.Provider value={value}>
      {children}
      {sizeRequest ? (
        <SizeDialog product={sizeRequest.product} intent={sizeRequest.intent} onChoose={handleSize} onClose={() => setSizeRequest(null)} />
      ) : null}
      {checkoutOpen ? (
        <CheckoutDialog
          lines={buyLine ? [buyLine] : lines}
          fromCart={!buyLine}
          onQuantity={handleQuantity}
          onRemove={handleRemove}
          onClose={closeCheckout}
          onPlaced={handlePlaced}
        />
      ) : null}
      <div className="cart-notice" role="status">
        {notice ? (
          <p>
            {notice}{" "}
            <button className="link-button" type="button" onClick={() => { setNotice(""); value.openCart(); }}>View bag</button>
          </p>
        ) : null}
      </div>
    </CartContext.Provider>
  );
}