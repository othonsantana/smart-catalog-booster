import { useEffect, useState, useSyncExternalStore } from "react";
import type { Product } from "./catalog-data";

type CartItem = { product: Product; qty: number };
type CartState = Record<string, CartItem>; // keyed by `${resellerSlug}:${productId}`

const listeners = new Set<() => void>();
let state: CartState = {};

function loadInitial() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("ci_cart_v1");
    if (raw) state = JSON.parse(raw);
  } catch {}
}
loadInitial();

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem("ci_cart_v1", JSON.stringify(state));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function key(slug: string, id: string) {
  return `${slug}:${id}`;
}

export const cartStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot(): CartState {
    return state;
  },
  add(slug: string, product: Product) {
    const k = key(slug, product.id);
    const existing = state[k];
    state = { ...state, [k]: { product, qty: (existing?.qty ?? 0) + 1 } };
    emit();
  },
  remove(slug: string, productId: string) {
    const k = key(slug, productId);
    const next = { ...state };
    delete next[k];
    state = next;
    emit();
  },
  setQty(slug: string, productId: string, qty: number) {
    const k = key(slug, productId);
    if (!state[k]) return;
    if (qty <= 0) {
      cartStore.remove(slug, productId);
      return;
    }
    state = { ...state, [k]: { ...state[k], qty } };
    emit();
  },
  clear(slug: string) {
    const next: CartState = {};
    for (const [k, v] of Object.entries(state)) {
      if (!k.startsWith(`${slug}:`)) next[k] = v;
    }
    state = next;
    emit();
  },
  itemsFor(slug: string): CartItem[] {
    return Object.entries(state)
      .filter(([k]) => k.startsWith(`${slug}:`))
      .map(([, v]) => v);
  },
};

export function useCart(slug: string) {
  // SSR-safe: only read after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const snap = useSyncExternalStore(
    cartStore.subscribe,
    () => cartStore.getSnapshot(),
    () => state,
  );
  const items = mounted
    ? Object.entries(snap)
        .filter(([k]) => k.startsWith(`${slug}:`))
        .map(([, v]) => v)
    : [];
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);
  return { items, count, total };
}
