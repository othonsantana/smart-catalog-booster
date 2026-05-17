import { useEffect, useState, useSyncExternalStore } from "react";
import { RESELLERS, type Reseller, type Product } from "./catalog-data";

type Override = {
  banner?: string;
  storeName?: string;
  bio?: string;
  whatsapp?: string;
  instagram?: string;
  categories?: string[];
  products?: Product[];
};

type StateMap = Record<string, Override>;

const KEY = "ci_reseller_overrides_v1";
const listeners = new Set<() => void>();
let state: StateMap = {};

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
}
load();

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function getOverride(slug: string): Override {
  return state[slug] ?? {};
}

function setOverride(slug: string, patch: Override) {
  state = { ...state, [slug]: { ...getOverride(slug), ...patch } };
  emit();
}

export function mergeReseller(slug: string): Reseller | undefined {
  const base = RESELLERS[slug.toLowerCase()];
  if (!base) return undefined;
  const o = getOverride(slug);
  const products = o.products ?? base.products;
  const baseCats = Array.from(new Set(products.map((p) => p.category)));
  const categories = o.categories ?? baseCats;
  // filter products whose category was removed
  const finalProducts = products.filter((p) => categories.includes(p.category));
  return {
    ...base,
    storeName: o.storeName ?? base.storeName,
    bio: o.bio ?? base.bio,
    whatsapp: o.whatsapp ?? base.whatsapp,
    instagram: o.instagram ?? base.instagram,
    banner: o.banner ?? base.banner,
    products: finalProducts,
  };
}

export const resellerStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return state;
  },
  updateInfo(slug: string, patch: Pick<Override, "storeName" | "bio" | "whatsapp" | "instagram" | "banner">) {
    setOverride(slug, patch);
  },
  setBanner(slug: string, banner: string) {
    setOverride(slug, { banner });
  },
  setCategories(slug: string, categories: string[]) {
    setOverride(slug, { categories });
  },
  addCategory(slug: string, cat: string) {
    const cur = mergeReseller(slug);
    if (!cur) return;
    const next = Array.from(new Set([...cur.products.map((p) => p.category), cat]));
    setOverride(slug, { categories: next });
  },
  removeCategory(slug: string, cat: string) {
    const cur = mergeReseller(slug);
    if (!cur) return;
    const cats = Array.from(new Set(cur.products.map((p) => p.category))).filter((c) => c !== cat);
    setOverride(slug, { categories: cats });
  },
  setProducts(slug: string, products: Product[]) {
    setOverride(slug, { products });
  },
  upsertProduct(slug: string, product: Product) {
    const base = RESELLERS[slug.toLowerCase()];
    if (!base) return;
    const o = getOverride(slug);
    const list = o.products ?? base.products;
    const idx = list.findIndex((p) => p.id === product.id);
    const next = idx >= 0 ? list.map((p) => (p.id === product.id ? product : p)) : [...list, product];
    setOverride(slug, { products: next });
  },
  deleteProduct(slug: string, productId: string) {
    const base = RESELLERS[slug.toLowerCase()];
    if (!base) return;
    const o = getOverride(slug);
    const list = o.products ?? base.products;
    setOverride(slug, { products: list.filter((p) => p.id !== productId) });
  },
  reset(slug: string) {
    const next = { ...state };
    delete next[slug];
    state = next;
    emit();
  },
};

export function useReseller(slug: string): Reseller | undefined {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useSyncExternalStore(
    resellerStore.subscribe,
    () => state,
    () => state,
  );
  // Always return SSR-merged on first render to avoid hydration mismatch
  return mounted ? mergeReseller(slug) : RESELLERS[slug.toLowerCase()];
}
