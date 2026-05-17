import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getReseller, formatBRL, type Product } from "@/lib/catalog-data";
import { resellerStore, useReseller } from "@/lib/reseller-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Tag,
  Package,
  ExternalLink,
  RotateCcw,
  Phone,
  User,
  Save,
  CheckCircle,
} from "lucide-react";
import { isAuthenticated } from "@/lib/auth-store";

export const Route = createFileRoute("/painel/$slug")({
  loader: ({ params }) => {
    const reseller = getReseller(params.slug);
    if (!reseller) throw notFound();
    return { reseller };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Painel — ${loaderData?.reseller.storeName ?? "Revendedor"}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-display font-bold">Revendedor não encontrado</h1>
        <Button asChild className="mt-6 rounded-full bg-primary-gradient">
          <Link to="/">Voltar</Link>
        </Button>
      </div>
    </div>
  ),
  component: PanelPage,
});

function PanelPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const reseller = useReseller(slug)!;
  const categories = Array.from(new Set(reseller.products.map((p) => p.category)));

  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated()) navigate({ to: "/" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-soft-gradient pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="grid place-items-center w-9 h-9 rounded-full bg-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Painel</div>
            <div className="text-sm font-display font-semibold truncate">{reseller.storeName}</div>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/loja/$slug" params={{ slug }} target="_blank">
              Ver catálogo <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-6 space-y-6">
        <StoreInfoSection slug={slug} reseller={reseller} />
        <BannerSection slug={slug} banner={reseller.banner} />
        <CategoriesSection slug={slug} categories={categories} />
        <ProductsSection slug={slug} products={reseller.products} categories={categories} />

        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              if (confirm("Restaurar dados originais deste revendedor?")) {
                resellerStore.reset(slug);
              }
            }}
          >
            <RotateCcw className="w-4 h-4" /> Restaurar dados originais
          </Button>
        </div>
      </main>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl p-5 shadow-soft border-border/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-display font-semibold">
          <span className="w-8 h-8 rounded-xl bg-secondary grid place-items-center text-primary">
            <Icon className="w-4 h-4" />
          </span>
          {title}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function StoreInfoSection({ slug, reseller }: { slug: string; reseller: { storeName: string; whatsapp: string; instagram: string; bio: string } }) {
  const [storeName, setStoreName] = useState(reseller.storeName);
  const [whatsapp, setWhatsapp] = useState(reseller.whatsapp);
  const [instagram, setInstagram] = useState(reseller.instagram);
  const [bio, setBio] = useState(reseller.bio);
  const [saved, setSaved] = useState(false);

  function save() {
    resellerStore.updateInfo(slug, {
      storeName: storeName.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      instagram: instagram.trim() || undefined,
      bio: bio.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SectionCard title="Informações da Loja" icon={User}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <span className="block text-xs font-medium text-muted-foreground mb-1">Nome da Loja</span>
          <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Nome da sua loja" className="rounded-xl" />
        </div>
        <div>
          <span className="block text-xs font-medium text-muted-foreground mb-1">WhatsApp (com DDD)</span>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="5511999999999" className="rounded-xl pl-9" />
          </div>
        </div>
        <div>
          <span className="block text-xs font-medium text-muted-foreground mb-1">Instagram</span>
          <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@seuusuario" className="rounded-xl" />
        </div>
        <div>
          <span className="block text-xs font-medium text-muted-foreground mb-1">Bio</span>
          <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Uma frase sobre sua loja" className="rounded-xl" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button onClick={save} className="rounded-xl bg-primary-gradient">
          {saved ? <><CheckCircle className="w-4 h-4 mr-1" /> Salvo!</> : <><Save className="w-4 h-4 mr-1" /> Salvar informações</>}
        </Button>
        {saved && <span className="text-xs text-green-600 font-medium">Alterações salvas com sucesso</span>}
      </div>
    </SectionCard>
  );
}

function BannerSection({ slug, banner }: { slug: string; banner: string }) {
  const [url, setUrl] = useState(banner);

  function save() {
    if (!url.trim()) return;
    resellerStore.setBanner(slug, url.trim());
  }

  return (
    <SectionCard title="Banner da loja" icon={ImageIcon}>
      <div
        className="h-32 rounded-2xl bg-petal mb-3"
        style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL da imagem (https://...)"
          className="rounded-xl"
        />
        <Button onClick={save} className="rounded-xl bg-primary-gradient">
          Salvar banner
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Cole a URL de uma imagem (use um upload externo, Imgur, etc).
      </p>
    </SectionCard>
  );
}

function CategoriesSection({ slug, categories }: { slug: string; categories: string[] }) {
  const [newCat, setNewCat] = useState("");

  function add() {
    const v = newCat.trim();
    if (!v) return;
    resellerStore.addCategory(slug, v);
    setNewCat("");
  }

  return (
    <SectionCard title="Categorias" icon={Tag}>
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.length === 0 && (
          <span className="text-sm text-muted-foreground">Nenhuma categoria.</span>
        )}
        {categories.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-secondary text-sm font-medium"
          >
            {c}
            <button
              onClick={() => {
                if (confirm(`Remover categoria "${c}"? Os produtos dela ficarão ocultos.`)) {
                  resellerStore.removeCategory(slug, c);
                }
              }}
              className="w-6 h-6 grid place-items-center rounded-full hover:bg-background"
              aria-label={`Remover ${c}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Ex: Linha Corporal"
          className="rounded-xl"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <Button onClick={add} className="rounded-xl bg-primary-gradient">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Sugeridas: Linha Corporal, Linha Capilar, Perfumes.
      </p>
    </SectionCard>
  );
}

type EditingProduct = Partial<Product> & { id: string };

function ProductsSection({
  slug,
  products,
  categories,
}: {
  slug: string;
  products: Product[];
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EditingProduct | null>(null);

  function startNew() {
    setEditing({
      id: `p_${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      image: "",
      category: categories[0] ?? "Perfumes",
    });
    setOpen(true);
  }

  function startEdit(p: Product) {
    setEditing({ ...p });
    setOpen(true);
  }

  function save() {
    if (!editing) return;
    const p: Product = {
      id: editing.id,
      name: editing.name?.trim() || "Sem nome",
      description: editing.description?.trim() || "",
      price: Number(editing.price) || 0,
      oldPrice: editing.oldPrice ? Number(editing.oldPrice) : undefined,
      image: editing.image?.trim() || "",
      category: editing.category || categories[0] || "Perfumes",
      featured: editing.featured,
    };
    resellerStore.upsertProduct(slug, p);
    setOpen(false);
    setEditing(null);
  }

  return (
    <SectionCard
      title={`Produtos (${products.length})`}
      icon={Package}
      action={
        <Button size="sm" className="rounded-full bg-primary-gradient" onClick={startNew}>
          <Plus className="w-4 h-4" /> Novo produto
        </Button>
      }
    >
      {products.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground text-sm">Nenhum produto.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 p-3 flex gap-3 bg-card">
              <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{p.category}</div>
                <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                <div className="text-sm font-bold text-primary">{formatBRL(p.price)}</div>
                <div className="mt-1 flex gap-1">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary"
                  >
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                  <button
                    onClick={() => confirm(`Excluir "${p.name}"?`) && resellerStore.deleteProduct(slug, p.id)}
                    className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-destructive"
                  >
                    <Trash2 className="w-3 h-3" /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span hidden />
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing && products.find((p) => p.id === editing.id) ? "Editar produto" : "Novo produto"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Nome">
                <Input
                  value={editing.name ?? ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </Field>
              <Field label="Descrição">
                <Textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço (R$)">
                  <Input
                    type="number"
                    step="0.01"
                    value={editing.price ?? 0}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Preço antigo (opcional)">
                  <Input
                    type="number"
                    step="0.01"
                    value={editing.oldPrice ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        oldPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </Field>
              </div>
              <Field label="Categoria">
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Imagem (URL)">
                <Input
                  value={editing.image ?? ""}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                Destacar na vitrine
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save} className="bg-primary-gradient">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
