import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { adminStore, useAdminStore, type CatalogTemplate, type AdminReseller } from "@/lib/admin-store";
import { isAuthenticated, logout } from "@/lib/auth-store";
import { formatBRL, type Product } from "@/lib/catalog-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  LayoutDashboard, FileText, Users, Plus, Pencil, Trash2, ExternalLink,
  Copy, Package, Sparkles, LogOut, Phone, Store, RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Administrativo — Catálogo Inteligente" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { templates, resellers, mounted } = useAdminStore();

  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated()) navigate({ to: "/" });
  }, [navigate]);

  if (!mounted) return <div className="min-h-screen grid place-items-center"><Sparkles className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-soft-gradient pb-20">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
          <div className="grid place-items-center w-9 h-9 rounded-full bg-primary-gradient text-primary-foreground">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Administração</div>
            <div className="text-sm font-display font-semibold">Catálogo Inteligente</div>
          </div>
          <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground" onClick={logout}>
            <LogOut className="w-4 h-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-secondary/80 rounded-full p-1">
            <TabsTrigger value="dashboard" className="rounded-full gap-1.5 data-[state=active]:bg-primary-gradient data-[state=active]:text-primary-foreground">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-full gap-1.5 data-[state=active]:bg-primary-gradient data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4" /> Modelos
            </TabsTrigger>
            <TabsTrigger value="resellers" className="rounded-full gap-1.5 data-[state=active]:bg-primary-gradient data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4" /> Revendedores
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><DashboardTab templates={templates} resellers={resellers} /></TabsContent>
          <TabsContent value="templates"><TemplatesTab templates={templates} /></TabsContent>
          <TabsContent value="resellers"><ResellersTab resellers={resellers} templates={templates} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function DashboardTab({ templates, resellers }: { templates: CatalogTemplate[]; resellers: AdminReseller[] }) {
  const totalProducts = templates.reduce((s, t) => s + t.products.length, 0);
  const stats = [
    { label: "Modelos de Catálogo", value: templates.length, icon: FileText },
    { label: "Revendedores", value: resellers.length, icon: Users },
    { label: "Produtos nos Modelos", value: totalProducts, icon: Package },
  ];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl p-5 shadow-soft border-border/60">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-secondary grid place-items-center text-primary"><s.icon className="w-5 h-5" /></span>
              <div><div className="text-2xl font-display font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="rounded-2xl p-5 shadow-soft border-border/60">
        <h3 className="font-display font-semibold mb-3">Revendedores recentes</h3>
        {resellers.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum revendedor cadastrado.</p> : (
          <div className="space-y-2">
            {resellers.slice(0, 5).map((r) => (
              <div key={r.slug} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-gradient grid place-items-center text-primary-foreground text-xs font-bold">{r.avatarInitials}</div>
                  <div><div className="text-sm font-medium">{r.storeName}</div><div className="text-xs text-muted-foreground">/loja/{r.slug}</div></div>
                </div>
                <Button asChild size="sm" variant="ghost" className="rounded-full"><Link to="/loja/$slug" params={{ slug: r.slug }} target="_blank"><ExternalLink className="w-3.5 h-3.5" /></Link></Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function TemplatesTab({ templates }: { templates: CatalogTemplate[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogTemplate | null>(null);
  function startNew() { setEditing({ id: "", name: "", description: "", banner: "", products: [], createdAt: 0 }); setOpen(true); }
  function startEdit(t: CatalogTemplate) { setEditing({ ...t, products: t.products.map((p) => ({ ...p })) }); setOpen(true); }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg">Modelos de Catálogo</h2>
        <Button size="sm" className="rounded-full bg-primary-gradient" onClick={startNew}><Plus className="w-4 h-4 mr-1" /> Novo Modelo</Button>
      </div>
      {templates.length === 0 ? (
        <Card className="rounded-2xl p-10 text-center text-muted-foreground shadow-soft">Nenhum modelo criado.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Card key={t.id} className="rounded-2xl p-5 shadow-soft border-border/60 flex flex-col">
              <div className="flex items-start justify-between">
                <div><h3 className="font-semibold">{t.name}</h3><p className="text-xs text-muted-foreground mt-1">{t.description || "Sem descrição"}</p></div>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">{t.products.length} produtos</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {Array.from(new Set(t.products.map((p) => p.category))).map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-petal/50 text-[10px] font-medium">{c}</span>
                ))}
              </div>
              <div className="mt-auto pt-4 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full flex-1" onClick={() => startEdit(t)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { if (confirm(`Excluir "${t.name}"?`)) adminStore.deleteTemplate(t.id); }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <TemplateDialog open={open} onOpenChange={setOpen} editing={editing} setEditing={setEditing} />
    </div>
  );
}

function TemplateDialog({ open, onOpenChange, editing, setEditing }: { open: boolean; onOpenChange: (v: boolean) => void; editing: CatalogTemplate | null; setEditing: (v: CatalogTemplate | null) => void }) {
  const [productOpen, setProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> & { id: string } | null>(null);
  const isNew = !editing?.id;
  function save() {
    if (!editing) return;
    if (isNew) adminStore.createTemplate({ name: editing.name, description: editing.description, banner: editing.banner, products: editing.products });
    else adminStore.updateTemplate(editing.id, { name: editing.name, description: editing.description, banner: editing.banner, products: editing.products });
    onOpenChange(false); setEditing(null);
  }
  function addProduct() {
    const cats = editing ? Array.from(new Set(editing.products.map((p) => p.category))) : [];
    setEditingProduct({ id: `p_${Date.now()}`, name: "", description: "", price: 0, image: "", category: cats[0] || "Perfumes" }); setProductOpen(true);
  }
  function editProduct(p: Product) { setEditingProduct({ ...p }); setProductOpen(true); }
  function saveProduct() {
    if (!editing || !editingProduct) return;
    const p: Product = { id: editingProduct.id, name: editingProduct.name?.trim() || "Sem nome", description: editingProduct.description?.trim() || "", price: Number(editingProduct.price) || 0, oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : undefined, image: editingProduct.image?.trim() || "", category: editingProduct.category || "Perfumes", featured: editingProduct.featured };
    const idx = editing.products.findIndex((x) => x.id === p.id);
    const next = idx >= 0 ? editing.products.map((x) => x.id === p.id ? p : x) : [...editing.products, p];
    setEditing({ ...editing, products: next }); setProductOpen(false); setEditingProduct(null);
  }
  function removeProduct(id: string) { if (!editing) return; setEditing({ ...editing, products: editing.products.filter((p) => p.id !== id) }); }
  const categories = editing ? Array.from(new Set(editing.products.map((p) => p.category))) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display">{isNew ? "Novo Modelo" : "Editar Modelo"}</DialogTitle></DialogHeader>
        {editing && (
          <div className="space-y-4">
            <Field label="Nome do Modelo"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Ex: Catálogo Premium" /></Field>
            <Field label="Descrição"><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} placeholder="Descrição do modelo..." /></Field>
            <Field label="Banner padrão (URL)"><Input value={editing.banner} onChange={(e) => setEditing({ ...editing, banner: e.target.value })} placeholder="https://..." /></Field>
            <div className="border-t border-border/60 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">Produtos ({editing.products.length})</span>
                <Button size="sm" className="rounded-full bg-primary-gradient" onClick={addProduct}><Plus className="w-4 h-4 mr-1" /> Produto</Button>
              </div>
              {editing.products.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum produto.</p> : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editing.products.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-secondary/50">
                      <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{p.name}</div><div className="text-xs text-muted-foreground">{p.category} · {formatBRL(p.price)}</div></div>
                      <button onClick={() => editProduct(p)} className="text-xs px-2 py-1 rounded-md bg-background"><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => { if (confirm(`Remover "${p.name}"?`)) removeProduct(p.id); }} className="text-xs px-2 py-1 rounded-md bg-background text-destructive"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={save} className="bg-primary-gradient">Salvar Modelo</Button>
        </DialogFooter>
        <Dialog open={productOpen} onOpenChange={setProductOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="font-display">Produto</DialogTitle></DialogHeader>
            {editingProduct && (
              <div className="space-y-3">
                <Field label="Nome"><Input value={editingProduct.name ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} /></Field>
                <Field label="Descrição"><Textarea value={editingProduct.description ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={2} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Preço (R$)"><Input type="number" step="0.01" value={editingProduct.price ?? 0} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} /></Field>
                  <Field label="Preço antigo"><Input type="number" step="0.01" value={editingProduct.oldPrice ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? Number(e.target.value) : undefined })} /></Field>
                </div>
                <Field label="Categoria"><Input value={editingProduct.category ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} placeholder="Perfumes, Linha Corporal..." list="cat-suggestions" /><datalist id="cat-suggestions">{categories.map((c) => <option key={c} value={c} />)}</datalist></Field>
                <Field label="Imagem (URL)"><Input value={editingProduct.image ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} placeholder="https://..." /></Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editingProduct.featured} onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })} /> Destacar</label>
              </div>
            )}
            <DialogFooter><Button variant="ghost" onClick={() => setProductOpen(false)}>Cancelar</Button><Button onClick={saveProduct} className="bg-primary-gradient">Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

function ResellersTab({ resellers, templates }: { resellers: AdminReseller[]; templates: CatalogTemplate[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<AdminReseller> | null>(null);
  const [isNew, setIsNew] = useState(false);
  function startNew() { setEditing({ name: "", storeName: "", bio: "", whatsapp: "", instagram: "", templateId: templates[0]?.id || "", banner: "" }); setIsNew(true); setOpen(true); }
  function startEdit(r: AdminReseller) { setEditing({ ...r }); setIsNew(false); setOpen(true); }
  function save() {
    if (!editing) return;
    if (isNew) adminStore.createReseller({ name: editing.name || "Revendedor", storeName: editing.storeName || editing.name || "Loja", bio: editing.bio || "", whatsapp: editing.whatsapp || "", instagram: editing.instagram || "", templateId: editing.templateId || "", banner: editing.banner });
    else if (editing.slug) adminStore.updateReseller(editing.slug, { name: editing.name, storeName: editing.storeName, bio: editing.bio, whatsapp: editing.whatsapp, instagram: editing.instagram, templateId: editing.templateId, banner: editing.banner });
    setOpen(false); setEditing(null);
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg">Revendedores</h2>
        <Button size="sm" className="rounded-full bg-primary-gradient" onClick={startNew}><Plus className="w-4 h-4 mr-1" /> Novo Revendedor</Button>
      </div>
      {resellers.length === 0 ? <Card className="rounded-2xl p-10 text-center text-muted-foreground shadow-soft">Nenhum revendedor.</Card> : (
        <div className="space-y-3">
          {resellers.map((r) => {
            const tpl = templates.find((t) => t.id === r.templateId);
            return (
              <Card key={r.slug} className="rounded-2xl p-4 shadow-soft border-border/60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-gradient grid place-items-center text-primary-foreground font-bold font-display shrink-0">{r.avatarInitials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{r.storeName}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                      <span>/loja/{r.slug}</span>
                      <span><Phone className="w-3 h-3 inline" /> {r.whatsapp}</span>
                      {tpl && <span><FileText className="w-3 h-3 inline" /> {tpl.name}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.products.length} produtos</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                    <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/loja/$slug" params={{ slug: r.slug }} target="_blank"><Store className="w-3.5 h-3.5 mr-1" /> Loja</Link></Button>
                    <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/painel/$slug" params={{ slug: r.slug }} target="_blank"><ExternalLink className="w-3.5 h-3.5 mr-1" /> Painel</Link></Button>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => startEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
                    {tpl && <Button size="sm" variant="outline" className="rounded-full" title="Replicar modelo" onClick={() => { if (confirm(`Replicar "${tpl.name}" para ${r.storeName}?`)) adminStore.applyTemplate(r.slug, r.templateId); }}><Copy className="w-3.5 h-3.5" /></Button>}
                    <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { if (confirm(`Excluir "${r.storeName}"?`)) adminStore.deleteReseller(r.slug); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{isNew ? "Novo Revendedor" : "Editar Revendedor"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Nome completo"><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Nome da loja"><Input value={editing.storeName ?? ""} onChange={(e) => setEditing({ ...editing, storeName: e.target.value })} /></Field>
              <Field label="Bio"><Textarea value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={2} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="WhatsApp (com DDD)"><Input value={editing.whatsapp ?? ""} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} placeholder="5511999999999" /></Field>
                <Field label="Instagram"><Input value={editing.instagram ?? ""} onChange={(e) => setEditing({ ...editing, instagram: e.target.value })} placeholder="@usuario" /></Field>
              </div>
              {isNew && templates.length > 0 && (
                <Field label="Modelo de catálogo">
                  <select value={editing.templateId ?? ""} onChange={(e) => setEditing({ ...editing, templateId: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                    {templates.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.products.length} produtos)</option>)}
                  </select>
                </Field>
              )}
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={save} className="bg-primary-gradient">Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>{children}</label>;
}
