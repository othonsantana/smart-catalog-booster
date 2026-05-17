import { useEffect, useState, useSyncExternalStore } from "react";
import type { Product } from "./catalog-data";

export type CatalogTemplate = {
  id: string; name: string; description: string; banner: string; products: Product[]; createdAt: number;
};

export type AdminReseller = {
  slug: string; name: string; storeName: string; bio: string; whatsapp: string; instagram: string;
  avatarInitials: string; banner: string; templateId: string; products: Product[]; createdAt: number;
  username: string; password: string; active: boolean;
};

type AdminState = { templates: Record<string, CatalogTemplate>; resellers: Record<string, AdminReseller> };

const KEY = "ci_admin_v1";
const listeners = new Set<() => void>();
let state: AdminState = { templates: {}, resellers: {} };

function load() {
  if (typeof window === "undefined") return;
  try { const raw = localStorage.getItem(KEY); if (raw) { state = JSON.parse(raw); } else { seed(); } } catch { seed(); }
}
function persist() { if (typeof window === "undefined") return; localStorage.setItem(KEY, JSON.stringify(state)); }
function emit() { persist(); listeners.forEach((l) => l()); }

function seed() {
  const seedProducts: Product[] = [
    { id: "p1", name: "Eau de Parfum Floral", description: "Fragrância floral amadeirada, 100ml. Fixação 8h+.", price: 189.9, oldPrice: 249.9, image: "", category: "Perfumes", featured: true },
    { id: "p2", name: "Creme Hidratante Corporal", description: "Hidratação profunda 24h com manteiga de karité. 400ml.", price: 79.9, oldPrice: 99.9, image: "", category: "Linha Corporal", featured: true },
    { id: "p3", name: "Kit Shampoo + Condicionador", description: "Reparação intensiva com óleo de argan. 2x300ml.", price: 109.9, oldPrice: 139.9, image: "", category: "Linha Capilar", featured: true },
    { id: "p4", name: "Óleo Corporal Satin", description: "Óleo seco com partículas luminosas. 150ml.", price: 94.9, image: "", category: "Linha Corporal", featured: true },
    { id: "p5", name: "Máscara Capilar Restauração", description: "Reposição de massa capilar. 250g.", price: 69.9, oldPrice: 89.9, image: "", category: "Linha Capilar" },
    { id: "p6", name: "Gel de Banho Perfumado", description: "Espuma cremosa com fragrância duradoura. 250ml.", price: 49.9, image: "", category: "Linha Corporal" },
    { id: "p7", name: "Perfume Oriental Noir", description: "Notas de baunilha, âmbar e patchouli. 100ml.", price: 219.9, image: "", category: "Perfumes" },
    { id: "p8", name: "Sérum Capilar Reparador", description: "Leave-in com queratina e proteínas. 60ml.", price: 59.9, image: "", category: "Linha Capilar", featured: true },
  ];
  const templateId = "tpl_default";
  state = {
    templates: { [templateId]: { id: templateId, name: "Modelo Padrão", description: "Template padrão com perfumes, linha corporal e capilar.", banner: "", products: seedProducts, createdAt: Date.now() } },
    resellers: {
      maria: { slug: "maria", name: "Maria Helena", storeName: "Maria Helena Beauty", bio: "Perfumes importados e cosméticos de alta performance.", whatsapp: "5511999990001", instagram: "@mariahelena.beauty", avatarInitials: "MH", banner: "", templateId, products: seedProducts.map((p) => ({ ...p })), createdAt: Date.now(), username: "maria", password: "maria123", active: true },
      joana: { slug: "joana", name: "Joana Lima", storeName: "Joana Perfumes", bio: "Especialista em fragrâncias exclusivas e linha capilar profissional.", whatsapp: "5511988880002", instagram: "@joana.perfumes", avatarInitials: "JL", banner: "", templateId, products: seedProducts.map((p) => ({ ...p, id: p.id + "_j" })), createdAt: Date.now(), username: "joana", password: "joana123", active: true },
    },
  };
  persist();
}
load();

function generateSlug(name: string): string { return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function generateInitials(name: string): string { return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(""); }

export const adminStore = {
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  getSnapshot(): AdminState { return state; },

  // Templates
  getAllTemplates(): CatalogTemplate[] { return Object.values(state.templates).sort((a, b) => b.createdAt - a.createdAt); },
  getTemplate(id: string): CatalogTemplate | undefined { return state.templates[id]; },
  createTemplate(data: Omit<CatalogTemplate, "id" | "createdAt">): CatalogTemplate {
    const id = `tpl_${Date.now()}`; const t: CatalogTemplate = { ...data, id, createdAt: Date.now() };
    state = { ...state, templates: { ...state.templates, [id]: t } }; emit(); return t;
  },
  updateTemplate(id: string, patch: Partial<Omit<CatalogTemplate, "id" | "createdAt">>) {
    const e = state.templates[id]; if (!e) return;
    state = { ...state, templates: { ...state.templates, [id]: { ...e, ...patch } } }; emit();
  },
  deleteTemplate(id: string) { const n = { ...state.templates }; delete n[id]; state = { ...state, templates: n }; emit(); },
  duplicateTemplate(id: string): CatalogTemplate | undefined {
    const src = state.templates[id]; if (!src) return;
    const newId = `tpl_${Date.now()}`;
    const t: CatalogTemplate = { ...src, id: newId, name: `${src.name} (cópia)`, products: src.products.map((p) => ({ ...p, id: `${p.id}_c${Date.now()}` })), createdAt: Date.now() };
    state = { ...state, templates: { ...state.templates, [newId]: t } }; emit(); return t;
  },

  // Resellers
  getAllResellers(): AdminReseller[] { return Object.values(state.resellers).sort((a, b) => b.createdAt - a.createdAt); },
  getReseller(slug: string): AdminReseller | undefined { return state.resellers[slug.toLowerCase()]; },
  createReseller(data: { name: string; storeName: string; bio: string; whatsapp: string; instagram: string; templateId: string; banner?: string; username: string; password: string }): AdminReseller {
    const slug = generateSlug(data.storeName || data.name);
    const template = state.templates[data.templateId];
    const products = template ? template.products.map((p) => ({ ...p, id: `${p.id}_${slug}` })) : [];
    const reseller: AdminReseller = {
      slug, name: data.name, storeName: data.storeName, bio: data.bio, whatsapp: data.whatsapp,
      instagram: data.instagram.startsWith("@") ? data.instagram : `@${data.instagram}`,
      avatarInitials: generateInitials(data.name), banner: data.banner || template?.banner || "",
      templateId: data.templateId, products, createdAt: Date.now(),
      username: data.username, password: data.password, active: true,
    };
    state = { ...state, resellers: { ...state.resellers, [slug]: reseller } }; emit(); return reseller;
  },
  updateReseller(slug: string, patch: Partial<Omit<AdminReseller, "slug" | "createdAt">>) {
    const e = state.resellers[slug]; if (!e) return;
    state = { ...state, resellers: { ...state.resellers, [slug]: { ...e, ...patch } } }; emit();
  },
  deleteReseller(slug: string) { const n = { ...state.resellers }; delete n[slug]; state = { ...state, resellers: n }; emit(); },
  toggleResellerActive(slug: string) {
    const r = state.resellers[slug]; if (!r) return;
    state = { ...state, resellers: { ...state.resellers, [slug]: { ...r, active: !r.active } } }; emit();
  },
  changeResellerPassword(slug: string, newPassword: string) {
    const r = state.resellers[slug]; if (!r) return;
    state = { ...state, resellers: { ...state.resellers, [slug]: { ...r, password: newPassword } } }; emit();
  },
  applyTemplate(slug: string, templateId: string) {
    const r = state.resellers[slug]; const t = state.templates[templateId]; if (!r || !t) return;
    const overrides = new Map<string, { price: number; oldPrice?: number }>();
    for (const p of r.products) overrides.set(p.name, { price: p.price, oldPrice: p.oldPrice });
    const products = t.products.map((p) => { const o = overrides.get(p.name); return { ...p, id: `${p.id}_${slug}`, price: o?.price ?? p.price, oldPrice: o?.oldPrice ?? p.oldPrice }; });
    state = { ...state, resellers: { ...state.resellers, [slug]: { ...r, templateId, products, banner: t.banner || r.banner } } }; emit();
  },
  resetAll() { state = { templates: {}, resellers: {} }; seed(); emit(); },
};

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
