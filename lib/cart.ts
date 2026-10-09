import { getProduct } from "@/lib/products";

export type CartLine = { slug: string; size: string; quantity: number };

export const maxQuantity = 5;

const key = "invizz-cart";
const empty: CartLine[] = [];
const listeners = new Set<() => void>();
let lines = empty;
let loaded = false;

function isLine(value: unknown): value is CartLine {
  const line = value as CartLine | null;
  return Boolean(line && getProduct(line.slug) && typeof line.size === "string" && Number.isInteger(line.quantity) && line.quantity > 0);
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (Array.isArray(saved)) lines = saved.filter(isLine);
  } catch {
    // Private windows and blocked storage: the bag just starts empty.
  }
}

// Read with useSyncExternalStore so the bag survives a reload without a hydration mismatch.
export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  getSnapshot() {
    load();
    return lines;
  },
  getServerSnapshot() {
    return empty;
  },
  set(next: CartLine[]) {
    lines = next;
    loaded = true;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Still works for this visit.
    }
    listeners.forEach((listener) => listener());
  },
};

export function addLine(current: CartLine[], slug: string, size: string) {
  const existing = current.find((line) => line.slug === slug && line.size === size);
  if (!existing) return [...current, { slug, size, quantity: 1 }];
  return current.map((line) => (line === existing ? { ...line, quantity: Math.min(maxQuantity, line.quantity + 1) } : line));
}
