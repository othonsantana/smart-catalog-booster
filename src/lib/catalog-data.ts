import perfume from "@/assets/product-perfume.jpg";
import cream from "@/assets/product-cream.jpg";
import jewelry from "@/assets/product-jewelry.jpg";
import lipstick from "@/assets/product-lipstick.jpg";
import scarf from "@/assets/product-scarf.jpg";
import earrings from "@/assets/product-earrings.jpg";
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

const CATEGORIES = ["Perfumes", "Skincare", "Maquiagem", "Semijoias", "Moda"];

const baseProducts: Product[] = [
  {
    id: "p1",
    name: "Eau de Parfum Pacieh",
    description: "Fragrância floral amadeirada, 100ml. Fixação 8h+.",
    price: 189.9,
    oldPrice: 249.9,
    image: perfume,
    category: "Perfumes",
    featured: true,
  },
  {
    id: "p2",
    name: "Creme Hidratante Lavanda",
    description: "Hidratação profunda com extrato de lavanda.",
    price: 89.9,
    image: cream,
    category: "Skincare",
    featured: true,
  },
  {
    id: "p3",
    name: "Colar Gota Quartzo Rosa",
    description: "Banhado a ouro 18k, pingente quartzo natural.",
    price: 129.0,
    oldPrice: 159.0,
    image: jewelry,
    category: "Semijoias",
    featured: true,
  },
  {
    id: "p4",
    name: "Kit Batons Matte Coleção Rosé",
    description: "Conjunto com 4 tons exclusivos de longa duração.",
    price: 119.9,
    image: lipstick,
    category: "Maquiagem",
  },
  {
    id: "p5",
    name: "Lenço de Seda Bicolor",
    description: "Seda 100% natural, 90x90cm, acabamento manual.",
    price: 159.0,
    image: scarf,
    category: "Moda",
  },
  {
    id: "p6",
    name: "Brincos Pérola Gota",
    description: "Pérolas cultivadas com encaixe banhado a ouro.",
    price: 79.9,
    oldPrice: 99.9,
    image: earrings,
    category: "Semijoias",
    featured: true,
  },
];

export const RESELLERS: Record<string, Reseller> = {
  maria: {
    slug: "maria",
    name: "Maria Helena",
    storeName: "Maria Helena Beauty",
    bio: "Curadoria de cosméticos e semijoias para mulheres que amam se cuidar.",
    whatsapp: "5511999990001",
    instagram: "@mariahelena.beauty",
    avatarInitials: "MH",
    banner,
    products: baseProducts,
  },
  joana: {
    slug: "joana",
    name: "Joana Lima",
    storeName: "Atelier da Joana",
    bio: "Perfumes importados e semijoias exclusivas com entrega rápida.",
    whatsapp: "5511988880002",
    instagram: "@atelier.joana",
    avatarInitials: "JL",
    banner,
    products: baseProducts,
  },
};

export const CATEGORIES_LIST = CATEGORIES;

export function getReseller(slug: string): Reseller | undefined {
  return RESELLERS[slug.toLowerCase()];
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
