import perfumeFloral from "@/assets/perfume-floral.jpg";
import bodyCream from "@/assets/body-cream.jpg";
import hairCare from "@/assets/hair-care.jpg";
import bodyOil from "@/assets/body-oil.jpg";
import hairMask from "@/assets/hair-mask.jpg";
import showerGel from "@/assets/shower-gel.jpg";
import banner from "@/assets/catalog-banner.jpg";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  featured?: boolean;
};

export type Reseller = {
  slug: string;
  name: string;
  storeName: string;
  bio: string;
  whatsapp: string; // E.164 sem +
  instagram: string;
  avatarInitials: string;
  banner: string;
  products: Product[];
};

const CATEGORIES = ["Perfumes", "Linha Corporal", "Linha Capilar"];

const baseProducts: Product[] = [
  {
    id: "p1",
    name: "Eau de Parfum Floral",
    description: "Fragrância floral amadeirada, 100ml. Fixação 8h+. Notas de jasmim e sândalo.",
    price: 189.9,
    oldPrice: 249.9,
    image: perfumeFloral,
    category: "Perfumes",
    featured: true,
  },
  {
    id: "p2",
    name: "Creme Hidratante Corporal",
    description: "Hidratação profunda 24h com manteiga de karité e vitamina E. 400ml.",
    price: 79.9,
    oldPrice: 99.9,
    image: bodyCream,
    category: "Linha Corporal",
    featured: true,
  },
  {
    id: "p3",
    name: "Kit Shampoo + Condicionador",
    description: "Reparação intensiva com óleo de argan. Cabelos sedosos e brilhantes. 2x300ml.",
    price: 109.9,
    oldPrice: 139.9,
    image: hairCare,
    category: "Linha Capilar",
    featured: true,
  },
  {
    id: "p4",
    name: "Óleo Corporal Satin",
    description: "Óleo seco com partículas luminosas. Hidrata e ilumina a pele. 150ml.",
    price: 94.9,
    image: bodyOil,
    category: "Linha Corporal",
    featured: true,
  },
  {
    id: "p5",
    name: "Máscara Capilar Restauração",
    description: "Máscara de reposição de massa capilar. Cabelos danificados e quimicamente tratados. 250g.",
    price: 69.9,
    oldPrice: 89.9,
    image: hairMask,
    category: "Linha Capilar",
  },
  {
    id: "p6",
    name: "Gel de Banho Perfumado",
    description: "Espuma cremosa com fragrância duradoura. pH balanceado. 250ml.",
    price: 49.9,
    image: showerGel,
    category: "Linha Corporal",
  },
  {
    id: "p7",
    name: "Perfume Oriental Noir",
    description: "Fragrância envolvente com notas de baunilha, âmbar e patchouli. 100ml.",
    price: 219.9,
    image: perfumeFloral,
    category: "Perfumes",
  },
  {
    id: "p8",
    name: "Sérum Capilar Reparador",
    description: "Sérum leave-in com queratina e proteínas. Protege das agressões diárias. 60ml.",
    price: 59.9,
    image: bodyOil,
    category: "Linha Capilar",
    featured: true,
  },
];

export const RESELLERS: Record<string, Reseller> = {
  maria: {
    slug: "maria",
    name: "Maria Helena",
    storeName: "Maria Helena Beauty",
    bio: "Perfumes importados e cosméticos de alta performance para quem ama se cuidar da cabeça aos pés.",
    whatsapp: "5511999990001",
    instagram: "@mariahelena.beauty",
    avatarInitials: "MH",
    banner,
    products: baseProducts,
  },
  joana: {
    slug: "joana",
    name: "Joana Lima",
    storeName: "Joana Perfumes",
    bio: "Especialista em fragrâncias exclusivas e linha capilar profissional. Entrega rápida.",
    whatsapp: "5511988880002",
    instagram: "@joana.perfumes",
    avatarInitials: "JL",
    banner,
    products: baseProducts.map((p) => ({ ...p, id: p.id + "_j" })),
  },
};

export const CATEGORIES_LIST = CATEGORIES;

export function getReseller(slug: string): Reseller | undefined {
  return RESELLERS[slug.toLowerCase()];
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
