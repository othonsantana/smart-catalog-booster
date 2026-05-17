import { useEffect, useState, useSyncExternalStore } from "react";
import type { Product } from "./catalog-data";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CatalogTemplate = {
  id: string;
  name: string;
  description: string;
  banner: string;
  products: Product[];
  createdAt: number;
};

export type AdminReseller = {
  slug: string;
  name: string;
  storeName: string;
  bio: string;
  whatsapp: string;
  instagram: string;
  avatarInitials: string;
  banner: string;
  templateId: string;
  products: Product[];
  createdAt: number;
};

type AdminState = {
  templates: Record<string, CatalogTemplate>;
  resellers: Record<string, AdminReseller>;
};

// ─── Persistence ─────────────────────────────────────────────────────────────

const KEY = "ci_admin_v1";
const listeners = new Set<() => void>();

function emptyState(): AdminState {
  return { templates: {}, resellers: {} };
}

let state: AdminState = emptyState();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = JSON.parse(raw);
    } else {
      seed();
    }
  } catch {
    seed();
  }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

function seed() {
  const seedProducts: Product[] = [
    { id: "p1", name: "Eau de Parfum Floral", description: "Fragrância floral amadeirada, 100ml. Fixação 8h+. Notas de jasmim e sândalo.", price: 189.9, oldPrice: 249.9, image: "", category: "Perfumes", featured: true },
    { id: "p2", name: "Creme Hidratante Corporal", description: "Hidratação profunda 24h com manteiga de karité e vitamina E. 400ml.", price: 79.9, oldPrice: 99.9, image: "", category: "Linha Corporal", featured: true },
    { id: "p3", name: "Kit Shampoo + Condicionador", description: "Reparação intensiva com óleo de argan. Cabelos sedosos e brilhantes. 2x300ml.", price: 109.9, oldPrice: 139.9, image: "", category: "Linha Capilar", featured: true },
    { id: "p4", name: "Óleo Corporal Satin", description: "Óleo seco com partículas luminosas. Hidrata e ilumina a pele. 150ml.", price: 94.9, image: "", category: "Linha Corporal", featured: true },
    { id: "p5", name: "Máscara Capilar Restauração", description: "Máscara de reposição de massa capilar. Cabelos danificados e quimicamente tratados. 250g.", price: 69.9, oldPrice: 89.9, image: "", category: "Linha Capilar" },
    { id: "p6", name: "Gel de Banho Perfumado", description: "Espuma cremosa com fragrância duradoura. pH balanceado. 250ml.", price: 49.9, image: "", category: "Linha Corporal" },
    { id: "p7", name: "Perfume Oriental Noir", description: "Fragrância envolvente com notas de baunilha, âmbar e patchouli. 100ml.", price: 219.9, image: "", category: "Perfumes" },
    { id: "p8", name: "Sérum Capilar Reparador", description: "Sérum leave-in com queratina e proteínas. Protege das agressões diárias. 60ml.", price: 59.9, image: "", category: "Linha Capilar", featured: true },
  ];

  const templateId = "tpl_default";
  const template: CatalogTemplate = {
    id: templateId, name: "Modelo Padrão", description: "Template padrão com perfumes, linha corporal e capilar.",
    banner: "", products: seedProducts, createdAt: Date.now(),
  };

  const maria: AdminReseller = {
    slug: "maria", name: "Maria Helena", storeName: "Maria Helena Beauty",
    bio: "Perfumes importados e cosméticos de alta performance para quem ama se cuidar da cabeça aos pés.",
    whatsapp: "5511999990001", instagram: "@mariahelena.beauty", avatarInitials: "MH",
    banner: "", templateId, products: seedProducts.map((p) => ({ ...p })), createdAt: Date.now(),
  };

  const joana: AdminReseller = {
    slug: "joana", name: "Joana Lima", storeName: "Joana Perfumes",
    bio: "Especialista em fragrâncias exclusivas e linha capilar profissional. Entrega rápida.",
    whatsapp: "5511988880002", instagram: "@joana.perfumes", avatarInitials: "JL",
    banner: "", templateId, products: seedProducts.map((p) => ({ ...p, id: p.id + "_j" })), createdAt: Date.now(),
  };

  state = { templates: { [templateId]: template }, resellers: { maria, joana } };
  persist();
}

load();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function generateInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

// ─── Admin Store ─────────────────────────────────────────────────────────────

export const adminStore = {
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  getSnapshot(): AdminState { return state; },

  getAllTemplates(): CatalogTemplate[] { return Object.values(state.templates).sort((a, b) => b.createdAt - a.createdAt); },
  getTemplate(id: string): CatalogTemplate | undefined { return state.templates[id]; },
  createTemplate(data: Omit<CatalogTemplate, "id" | "createdAt">): CatalogTemplate {
    const id = `tpl_${Date.now()}`;
    const template: CatalogTemplate = { ...data, id, createdAt: Date.now() };
    state = { ...state, templates: { ...state.templates, [id]: template } };
    emit(); return template;
  },
  updateTemplate(id: string, patch: Partial<Omit<CatalogTemplate, "id" | "createdAt">>) {
    const existing = state.templates[id]; if (!existing) return;
    state = { ...state, templates: { ...state.templates, [id]: { ...existing, ...patch } } };
    emit();
  },
  deleteTemplate(id: string) {
    const next = { ...state.templates }; delete next[id];
    state = { ...state, templates: next }; emit();
  },

  getAllResellers(): AdminReseller[] { return Object.values(state.resellers).sort((a, b) => b.createdAt - a.createdAt); },
  getReseller(slug: string): AdminReseller | undefined { return state.resellers[slug.toLowerCase()]; },
  createReseller(data: { name: string; storeName: string; bio: string; whatsapp: string; instagram: string; templateId: string; banner?: string }): AdminReseller {
    const slug = generateSlug(data.storeName || data.name);
    const template = state.templates[data.templateId];
    const products = template ? template.products.map((p) => ({ ...p, id: `${p.id}_${slug}` })) : [];
    const reseller: AdminReseller = {
      slug, name: data.name, storeName: data.storeName, bio: data.bio,
      whatsapp: data.whatsapp, instagram: data.instagram.startsWith("@") ? data.instagram : `@${data.instagram}`,
      avatarInitials: generateInitials(data.name), banner: data.banner || template?.banner || "",
      templateId: data.templateId, products, createdAt: Date.now(),
    };
    state = { ...state, resellers: { ...state.resellers, [slug]: reseller } };
    emit(); return reseller;
  },
  updateReseller(slug: string, patch: Partial<Omit<AdminReseller, "slug" | "createdAt">>) {
    const existing = state.resellers[slug]; if (!existing) return;
    state = { ...state, resellers: { ...state.resellers, [slug]: { ...existing, ...patch } } };
    emit();
  },
  deleteReseller(slug: string) {
    const next = { ...state.resellers }; delete next[slug];
    state = { ...state, resellers: next }; emit();
  },
  applyTemplate(slug: string, templateId: string) {
    const reseller = state.resellers[slug];
    const template = state.templates[templateId];
    if (!reseller || !template) return;
    const priceOverrides = new Map<string, { price: number; oldPrice?: number }>();
    for (const p of reseller.products) priceOverrides.set(p.name, { price: p.price, oldPrice: p.oldPrice });
    const newProducts = template.products.map((p) => {
      const override = priceOverrides.get(p.name);
      return { ...p, id: `${p.id}_${slug}`, price: override?.price ?? p.price, oldPrice: override?.oldPrice ?? p.oldPrice };
    });
    state = { ...state, resellers: { ...state.resellers, [slug]: { ...reseller, templateId, products: newProducts, banner: template.banner || reseller.banner } } };
    emit();
  },
  resetAll() { state = emptyState(); seed(); emit(); },
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAdminStore() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const snap = useSyncExternalStore(adminStore.subscribe, () => adminStore.getSnapshot(), () => state);
  return {
    templates: mounted ? Object.values(snap.templates).sort((a, b) => b.createdAt - a.createdAt) : [],
    resellers: mounted ? Object.values(snap.resellers).sort((a, b) => b.createdAt - a.createdAt) : [],
    mounted,
  };
}
