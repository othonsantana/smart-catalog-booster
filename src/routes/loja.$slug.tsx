import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getReseller, formatBRL, type Product } from "@/lib/catalog-data";
import { useReseller } from "@/lib/reseller-store";
import { cartStore, useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingBag,
  Heart,
  Instagram,
  MessageCircle,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Share2,
  Sparkles,
  Check,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/loja/$slug")({
  loader: ({ params }) => {
    const reseller = getReseller(params.slug);
    if (!reseller) throw notFound();
    return { reseller };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.reseller;
    const title = r ? `${r.storeName} — Catálogo` : "Catálogo";
    const desc = r?.bio ?? "Catálogo online";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: r?.banner },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-display font-bold">Catálogo não encontrado</h1>
        <p className="mt-2 text-muted-foreground">Esta loja ainda não existe.</p>
        <Button asChild className="mt-6 rounded-full bg-primary-gradient">
          <Link to="/">Voltar pro início</Link>
        </Button>
      </div>
    </div>
  ),
  component: StorePage,
});

function StorePage() {
  const { slug } = Route.useParams();
  const reseller = useReseller(slug)!;
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("Todos");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const { items, count, total } = useCart(reseller.slug);

  const categories = useMemo(() => {
    const set = new Set(reseller.products.map((p) => p.category));
    return ["Todos", ...Array.from(set)];
  }, [reseller.products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reseller.products.filter((p) => {
      const matchCat = activeCat === "Todos" || p.category === activeCat;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [reseller.products, query, activeCat]);

  const featured = reseller.products.filter((p) => p.featured);

  function toggleFav(id: string) {
    setFavs((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function shareStore() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: reseller.storeName, url });
        return;
      } catch {}
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    }
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="grid place-items-center w-9 h-9 rounded-full bg-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 text-center">
            <div className="text-sm font-display font-semibold truncate">{reseller.storeName}</div>
          </div>
          <button
            onClick={shareStore}
            className="grid place-items-center w-9 h-9 rounded-full bg-secondary"
            aria-label="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4">
        {/* Hero da loja */}
        <section className="pt-5">
          <div
            className="relative h-40 sm:h-52 rounded-3xl overflow-hidden bg-petal"
            style={{
              backgroundImage: `url(${reseller.banner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            {reseller.banner && (
              <button onClick={() => { fetch(reseller.banner).then(r => r.blob()).then(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'banner.jpg'; a.click(); URL.revokeObjectURL(a.href); }).catch(() => window.open(reseller.banner, '_blank')); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur grid place-items-center shadow-soft z-10" aria-label="Baixar banner">
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative -mt-10 px-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary-gradient grid place-items-center text-primary-foreground text-xl font-display font-bold shadow-elevated border-4 border-background">
              {reseller.avatarInitials}
            </div>
            <div className="pb-1 min-w-0">
              <h1 className="text-xl font-display font-bold truncate">{reseller.storeName}</h1>
              <p className="text-xs text-muted-foreground truncate">{reseller.instagram}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{reseller.bio}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={`https://wa.me/${reseller.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: "var(--whatsapp)" }}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a
              href={`https://instagram.com/${reseller.instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold bg-secondary text-secondary-foreground"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Search */}
        <section className="mt-6 sticky top-14 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="pl-10 h-12 rounded-2xl bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  activeCat === c
                    ? "bg-primary-gradient text-primary-foreground shadow-soft"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Featured banner */}
        {featured.length > 0 && activeCat === "Todos" && !query && (
          <section className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Em destaque
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
              {featured.map((p) => (
                <button
                  key={p.id}
                  onClick={() => cartStore.add(reseller.slug, p)}
                  className="shrink-0 w-44 text-left rounded-2xl overflow-hidden bg-card shadow-soft active:scale-[0.98] transition"
                >
                  <div className="aspect-square bg-secondary">
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">{formatBRL(p.price)}</span>
                      {p.oldPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">{formatBRL(p.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Product grid */}
        <section className="mt-4">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  resellerSlug={reseller.slug}
                  whatsapp={reseller.whatsapp}
                  storeUrl={typeof window !== 'undefined' ? window.location.href : ''}
                  isFav={favs.has(p.id)}
                  onFav={() => toggleFav(p.id)}
                  delay={i * 0.02}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating cart */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
          >
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <button className="w-full rounded-full px-5 py-4 bg-foreground text-background flex items-center justify-between shadow-elevated">
                  <span className="flex items-center gap-3 font-semibold">
                    <span className="relative">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-primary text-[10px] grid place-items-center text-primary-foreground font-bold">
                        {count}
                      </span>
                    </span>
                    Ver carrinho
                  </span>
                  <span className="font-bold">{formatBRL(total)}</span>
                </button>
              </SheetTrigger>
              <CartSheet
                slug={reseller.slug}
                whatsapp={reseller.whatsapp}
                storeName={reseller.storeName}
                items={items}
                total={total}
                onClose={() => setCartOpen(false)}
              />
            </Sheet>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({
  product,
  resellerSlug,
  isFav,
  onFav,
  delay,
}: {
  product: Product;
  resellerSlug: string;
  whatsapp: string;
  storeUrl: string;
  isFav: boolean;
  onFav: () => void;
  delay: number;
}) {
  const [added, setAdded] = useState(false);
  function add() {
    cartStore.add(resellerSlug, product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="rounded-2xl overflow-hidden bg-card shadow-soft flex flex-col"
    >
      <div className="relative aspect-square bg-secondary">
        <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
        <button
          onClick={onFav}
          className="absolute top-2 right-2 w-9 h-9 grid place-items-center rounded-full bg-background/80 backdrop-blur shadow-soft"
          aria-label="Favoritar"
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        {product.oldPrice && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-gradient text-primary-foreground">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground">{product.category}</div>
        <div className="text-sm font-medium line-clamp-2 leading-tight mt-0.5">{product.name}</div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-primary">{formatBRL(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[11px] text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
          )}
        </div>
        <button
          onClick={add}
          className={`mt-3 w-full rounded-xl py-2 text-sm font-semibold transition ${
            added ? "bg-[oklch(0.68_0.16_150)] text-white" : "bg-primary-gradient text-primary-foreground"
          }`}
        >
          {added ? (
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4" /> Adicionado</span>
          ) : (
            <span className="inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Adicionar</span>
          )}
        </button>
        <div className="mt-2 flex gap-1.5">
          {product.image && (
            <a href={product.image} download={`${product.name}.jpg`} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition" onClick={(e) => { e.preventDefault(); fetch(product.image).then(r => r.blob()).then(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${product.name}.jpg`; a.click(); URL.revokeObjectURL(a.href); }).catch(() => window.open(product.image, '_blank')); }}>
              <Download className="w-3 h-3" /> Baixar
            </a>
          )}
          <a href={`https://wa.me/?text=${encodeURIComponent(`Olha esse produto: *${product.name}*\nPreço: ${formatBRL(product.price)}\n${storeUrl}`)}`} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-white transition" style={{ background: 'var(--whatsapp)' }}>
            <MessageCircle className="w-3 h-3" /> Enviar
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function CartSheet({
  slug,
  whatsapp,
  storeName,
  items,
  total,
  onClose,
}: {
  slug: string;
  whatsapp: string;
  storeName: string;
  items: { product: Product; qty: number }[];
  total: number;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  function buildMessage() {
    const lines = [
      `Olá, ${storeName}! Quero fazer um pedido:`,
      "",
      ...items.map((i) => `• ${i.qty}x ${i.product.name} — ${formatBRL(i.qty * i.product.price)}`),
      "",
      `*Total: ${formatBRL(total)}*`,
      "",
      `*Dados de entrega*`,
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Endereço: ${address}`,
    ];
    if (note.trim()) lines.push(`Observação: ${note}`);
    return lines.join("\n");
  }

  function sendOrder() {
    if (!name || !phone || !address) return;
    const text = encodeURIComponent(buildMessage());
    const url = `https://wa.me/${whatsapp}?text=${text}`;
    cartStore.clear(slug);
    if (typeof window !== "undefined") window.open(url, "_blank");
    onClose();
  }

  return (
    <SheetContent side="bottom" className="rounded-t-3xl max-h-[92vh] flex flex-col">
      <SheetHeader>
        <SheetTitle className="font-display text-xl">
          {step === "cart" ? "Seu carrinho" : "Finalizar pedido"}
        </SheetTitle>
      </SheetHeader>

      {step === "cart" ? (
        <>
          <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2 space-y-3">
            {items.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">Seu carrinho está vazio.</div>
            ) : (
              items.map((it) => (
                <div key={it.product.id} className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                    <img src={it.product.image} alt={it.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{it.product.name}</div>
                    <div className="text-sm font-bold text-primary">{formatBRL(it.product.price)}</div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
                    <button
                      onClick={() => cartStore.setQty(slug, it.product.id, it.qty - 1)}
                      className="w-7 h-7 rounded-full bg-background grid place-items-center"
                      aria-label="Diminuir"
                    >
                      {it.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{it.qty}</span>
                    <button
                      onClick={() => cartStore.setQty(slug, it.product.id, it.qty + 1)}
                      className="w-7 h-7 rounded-full bg-background grid place-items-center"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-border pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-display font-bold">{formatBRL(total)}</span>
            </div>
            <Button
              disabled={items.length === 0}
              onClick={() => setStep("checkout")}
              className="w-full rounded-full h-12 bg-primary-gradient shadow-glow"
            >
              Finalizar pedido
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2 space-y-3">
            <div>
              <label className="text-sm font-medium">Nome completo</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11 rounded-xl" placeholder="Seu nome" />
            </div>
            <div>
              <label className="text-sm font-medium">Telefone (WhatsApp)</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 h-11 rounded-xl" placeholder="(11) 9 9999-9999" />
            </div>
            <div>
              <label className="text-sm font-medium">Endereço de entrega</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 h-11 rounded-xl" placeholder="Rua, número, bairro, cidade" />
            </div>
            <div>
              <label className="text-sm font-medium">Observação (opcional)</label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 rounded-xl" placeholder="Ex: tamanho, cor..." rows={2} />
            </div>
          </div>
          <div className="border-t border-border pt-4 mt-2 flex gap-2">
            <Button variant="outline" onClick={() => setStep("cart")} className="rounded-full">
              Voltar
            </Button>
            <Button
              disabled={!name || !phone || !address}
              onClick={sendOrder}
              className="flex-1 rounded-full h-12 text-white"
              style={{ background: "var(--whatsapp)" }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar pelo WhatsApp
            </Button>
          </div>
        </>
      )}
    </SheetContent>
  );
}
