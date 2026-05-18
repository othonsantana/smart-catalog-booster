import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { adminStore, useAdminStore, type CatalogTemplate, type AdminReseller } from "@/lib/admin-store";
import { isAdmin, logout } from "@/lib/auth-store";
import { formatBRL, type Product } from "@/lib/catalog-data";
import { handleImageUpload } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LayoutDashboard, FileText, Users, Plus, Pencil, Trash2, ExternalLink, Copy, Package, Sparkles, LogOut, Phone, Store, Lock, Unlock, Key, ShieldCheck, ShieldX, Upload, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — Catálogo Inteligente" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const nav = useNavigate();
  const { templates, resellers, mounted } = useAdminStore();
  useEffect(() => { if (typeof window !== "undefined" && !isAdmin()) nav({ to: "/" }); }, [nav]);
  if (!mounted) return <div className="min-h-screen grid place-items-center"><Sparkles className="w-6 h-6 animate-spin text-primary" /></div>;
  const activeCount = resellers.filter((r) => r.active).length;
  return (
    <div className="min-h-screen bg-soft-gradient pb-20">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
          <div className="grid place-items-center w-9 h-9 rounded-full bg-primary-gradient text-primary-foreground"><Sparkles className="w-4 h-4" /></div>
          <div className="flex-1 min-w-0"><div className="text-xs text-muted-foreground">Administração</div><div className="text-sm font-display font-semibold">Catálogo Inteligente</div></div>
          <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground" onClick={logout}><LogOut className="w-4 h-4 mr-1" /> Sair</Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-secondary/80 rounded-full p-1">
            <TabsTrigger value="dashboard" className="rounded-full gap-1.5 data-[state=active]:bg-primary-gradient data-[state=active]:text-primary-foreground"><LayoutDashboard className="w-4 h-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="templates" className="rounded-full gap-1.5 data-[state=active]:bg-primary-gradient data-[state=active]:text-primary-foreground"><FileText className="w-4 h-4" /> Modelos</TabsTrigger>
            <TabsTrigger value="resellers" className="rounded-full gap-1.5 data-[state=active]:bg-primary-gradient data-[state=active]:text-primary-foreground"><Users className="w-4 h-4" /> Revendedores</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><DashboardTab templates={templates} resellers={resellers} activeCount={activeCount} /></TabsContent>
          <TabsContent value="templates"><TemplatesTab templates={templates} /></TabsContent>
          <TabsContent value="resellers"><ResellersTab resellers={resellers} templates={templates} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function DashboardTab({ templates, resellers, activeCount }: { templates: CatalogTemplate[]; resellers: AdminReseller[]; activeCount: number }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        {[{ label: "Modelos", value: templates.length, icon: FileText }, { label: "Revendedores", value: resellers.length, icon: Users }, { label: "Ativos", value: activeCount, icon: ShieldCheck }, { label: "Bloqueados", value: resellers.length - activeCount, icon: ShieldX }].map((s) => (
          <Card key={s.label} className="rounded-2xl p-5 shadow-soft border-border/60"><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-secondary grid place-items-center text-primary"><s.icon className="w-5 h-5" /></span><div><div className="text-2xl font-display font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div></div></Card>
        ))}
      </div>
      <Card className="rounded-2xl p-5 shadow-soft border-border/60">
        <h3 className="font-display font-semibold mb-3">Revendedores recentes</h3>
        {resellers.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum.</p> : (
          <div className="space-y-2">{resellers.slice(0, 5).map((r) => (
            <div key={r.slug} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-gradient grid place-items-center text-primary-foreground text-xs font-bold">{r.avatarInitials}</div>
                <div><div className="text-sm font-medium flex items-center gap-2">{r.storeName} {r.active ? <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">Ativo</span> : <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">Bloqueado</span>}</div><div className="text-xs text-muted-foreground">/loja/{r.slug}</div></div>
              </div>
              <Button asChild size="sm" variant="ghost" className="rounded-full"><Link to="/loja/$slug" params={{ slug: r.slug }} target="_blank"><ExternalLink className="w-3.5 h-3.5" /></Link></Button>
            </div>
          ))}</div>
        )}
      </Card>
    </div>
  );
}

/* ── Templates Tab with inline editing panel ── */
function TemplatesTab({ templates }: { templates: CatalogTemplate[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  function createNew() {
    if (!newName.trim()) return;
    const t = adminStore.createTemplate({ name: newName.trim(), description: "", banner: "", products: [] });
    setSelectedId(t.id); setCreating(false); setNewName("");
  }

  const selected = selectedId ? templates.find((t) => t.id === selectedId) : null;

  return (
    <div className="flex gap-6 min-h-[500px]">
      {/* Sidebar - template list */}
      <div className="w-64 shrink-0 space-y-3">
        <Button size="sm" className="w-full rounded-full bg-primary-gradient" onClick={() => setCreating(true)}><Plus className="w-4 h-4 mr-1" /> Novo Modelo</Button>
        {creating && (
          <div className="flex gap-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do modelo" className="rounded-xl text-sm" onKeyDown={(e) => e.key === "Enter" && createNew()} autoFocus />
            <Button size="sm" onClick={createNew} className="rounded-xl bg-primary-gradient">OK</Button>
          </div>
        )}
        {templates.map((t) => (
          <button key={t.id} onClick={() => setSelectedId(t.id)} className={`w-full text-left p-3 rounded-2xl border transition ${selectedId === t.id ? "border-primary bg-primary/5 shadow-soft" : "border-border/60 bg-card hover:bg-secondary/50"}`}>
            <div className="font-semibold text-sm truncate">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.products.length} produtos</div>
          </button>
        ))}
        {templates.length === 0 && !creating && <p className="text-sm text-muted-foreground text-center py-8">Nenhum modelo. Crie o primeiro!</p>}
      </div>

      {/* Main panel */}
      <div className="flex-1">
        {selected ? <TemplateEditor key={selected.id} template={selected} onDelete={() => setSelectedId(null)} /> : (
          <Card className="rounded-2xl p-10 text-center text-muted-foreground shadow-soft h-full grid place-items-center">
            <div><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Selecione um modelo para editar</p></div>
          </Card>
        )}
      </div>
    </div>
  );
}

function TemplateEditor({ template, onDelete }: { template: CatalogTemplate; onDelete: () => void }) {
  const [name, setName] = useState(template.name);
  const [desc, setDesc] = useState(template.description);
  const [banner, setBanner] = useState(template.banner);
  const [saved, setSaved] = useState(false);
  // Product editing
  const [pOpen, setPOpen] = useState(false);
  const [ep, setEp] = useState<Partial<Product> & { id: string } | null>(null);

  function saveInfo() {
    adminStore.updateTemplate(template.id, { name, description: desc, banner });
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  }

  async function uploadBanner() {
    const b64 = await handleImageUpload(); if (b64) { setBanner(b64); adminStore.updateTemplate(template.id, { banner: b64 }); }
  }

  function startNewProduct() {
    const cats = template.products.length > 0 ? template.products[0].category : "Perfumes";
    setEp({ id: `p_${Date.now()}`, name: "", description: "", price: 0, image: "", category: cats }); setPOpen(true);
  }

  function startEditProduct(p: Product) { setEp({ ...p }); setPOpen(true); }

  async function uploadProductImage() {
    if (!ep) return;
    const b64 = await handleImageUpload(); if (b64) setEp({ ...ep, image: b64 });
  }

  function saveProduct() {
    if (!ep) return;
    const p: Product = { id: ep.id, name: ep.name?.trim() || "Sem nome", description: ep.description?.trim() || "", price: Number(ep.price) || 0, oldPrice: ep.oldPrice ? Number(ep.oldPrice) : undefined, image: ep.image?.trim() || "", category: ep.category || "Perfumes", featured: ep.featured };
    const prods = template.products; const idx = prods.findIndex((x) => x.id === p.id);
    const next = idx >= 0 ? prods.map((x) => (x.id === p.id ? p : x)) : [...prods, p];
    adminStore.updateTemplate(template.id, { products: next });
    setPOpen(false); setEp(null);
  }

  function removeProduct(id: string) {
    adminStore.updateTemplate(template.id, { products: template.products.filter((p) => p.id !== id) });
  }

  const cats = Array.from(new Set(template.products.map((p) => p.category)));

  return (
    <Card className="rounded-2xl shadow-soft border-border/60 overflow-hidden">
      {/* Banner */}
      <div className="relative h-32 bg-secondary cursor-pointer group" onClick={uploadBanner} style={banner ? { backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition grid place-items-center">
          <span className="text-white text-sm font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> {banner ? "Trocar banner" : "Enviar banner"}</span>
        </div>
        {!banner && <div className="h-full grid place-items-center text-muted-foreground"><Upload className="w-6 h-6" /><span className="text-xs mt-1">Clique para enviar banner</span></div>}
      </div>

      <div className="p-5 space-y-4">
        {/* Info */}
        <div className="grid sm:grid-cols-2 gap-3">
          <F label="Nome do modelo"><Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" /></F>
          <F label="Descrição"><Input value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-xl" placeholder="Descrição breve..." /></F>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="rounded-full bg-primary-gradient" onClick={saveInfo}>{saved ? "Salvo ✓" : "Salvar info"}</Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => adminStore.duplicateTemplate(template.id)}><Copy className="w-3.5 h-3.5 mr-1" /> Duplicar</Button>
          <Button size="sm" variant="ghost" className="rounded-full text-destructive ml-auto" onClick={() => { if (confirm(`Excluir "${template.name}"?`)) { adminStore.deleteTemplate(template.id); onDelete(); } }}><Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir</Button>
        </div>

        {/* Products */}
        <div className="border-t border-border/60 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-semibold">Produtos ({template.products.length})</span>
            <Button size="sm" className="rounded-full bg-primary-gradient" onClick={startNewProduct}><Plus className="w-4 h-4 mr-1" /> Produto</Button>
          </div>

          {template.products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum produto. Adicione o primeiro!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {template.products.map((p) => (
                <div key={p.id} className="rounded-xl border border-border/60 overflow-hidden bg-card">
                  <div className="h-24 bg-secondary">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs text-muted-foreground">{p.category}</div>
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-sm font-bold text-primary">{formatBRL(p.price)}</div>
                    <div className="mt-2 flex gap-1">
                      <button onClick={() => startEditProduct(p)} className="text-xs px-2 py-1 rounded-md bg-secondary"><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => { if (confirm(`Remover "${p.name}"?`)) removeProduct(p.id); }} className="text-xs px-2 py-1 rounded-md bg-secondary text-destructive"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product dialog */}
      <Dialog open={pOpen} onOpenChange={setPOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display">Produto</DialogTitle></DialogHeader>
          {ep && (<div className="space-y-3">
            <F label="Nome"><Input value={ep.name ?? ""} onChange={(e) => setEp({ ...ep, name: e.target.value })} /></F>
            <F label="Descrição"><Textarea value={ep.description ?? ""} onChange={(e) => setEp({ ...ep, description: e.target.value })} rows={2} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Preço (R$)"><Input type="number" step="0.01" value={ep.price ?? 0} onChange={(e) => setEp({ ...ep, price: Number(e.target.value) })} /></F>
              <F label="Preço antigo"><Input type="number" step="0.01" value={ep.oldPrice ?? ""} onChange={(e) => setEp({ ...ep, oldPrice: e.target.value ? Number(e.target.value) : undefined })} /></F>
            </div>
            <F label="Categoria"><Input value={ep.category ?? ""} onChange={(e) => setEp({ ...ep, category: e.target.value })} list="cats" /><datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist></F>
            <F label="Imagem do produto">
              <div className="flex items-center gap-3">
                {ep.image ? <img src={ep.image} alt="" className="w-16 h-16 rounded-lg object-cover" /> : <div className="w-16 h-16 rounded-lg bg-secondary grid place-items-center"><ImageIcon className="w-5 h-5 text-muted-foreground" /></div>}
                <Button size="sm" variant="outline" className="rounded-full" onClick={uploadProductImage}><Upload className="w-3.5 h-3.5 mr-1" /> Enviar imagem</Button>
              </div>
            </F>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!ep.featured} onChange={(e) => setEp({ ...ep, featured: e.target.checked })} /> Destacar</label>
          </div>)}
          <DialogFooter><Button variant="ghost" onClick={() => setPOpen(false)}>Cancelar</Button><Button onClick={saveProduct} className="bg-primary-gradient">Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ── Resellers Tab ── */
function ResellersTab({ resellers, templates }: { resellers: AdminReseller[]; templates: CatalogTemplate[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<AdminReseller> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwSlug, setPwSlug] = useState("");
  const [newPw, setNewPw] = useState("");

  function startNew() { setEditing({ name: "", storeName: "", bio: "", whatsapp: "", instagram: "", templateId: templates[0]?.id || "", username: "", password: "" }); setIsNew(true); setOpen(true); }
  function startEdit(r: AdminReseller) { setEditing({ ...r }); setIsNew(false); setOpen(true); }
  function save() {
    if (!editing) return;
    if (isNew) adminStore.createReseller({ name: editing.name || "Revendedor", storeName: editing.storeName || "Loja", bio: editing.bio || "", whatsapp: editing.whatsapp || "", instagram: editing.instagram || "", templateId: editing.templateId || "", username: editing.username || "", password: editing.password || "123456" });
    else if (editing.slug) adminStore.updateReseller(editing.slug, { name: editing.name, storeName: editing.storeName, bio: editing.bio, whatsapp: editing.whatsapp, instagram: editing.instagram, templateId: editing.templateId });
    setOpen(false); setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg">Revendedores</h2>
        <Button size="sm" className="rounded-full bg-primary-gradient" onClick={startNew}><Plus className="w-4 h-4 mr-1" /> Novo Revendedor</Button>
      </div>
      {resellers.length === 0 ? <Card className="rounded-2xl p-10 text-center text-muted-foreground shadow-soft">Nenhum revendedor.</Card> : (
        <div className="space-y-3">{resellers.map((r) => {
          const tpl = templates.find((t) => t.id === r.templateId);
          return (
            <Card key={r.slug} className={`rounded-2xl p-4 shadow-soft border-border/60 ${!r.active ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-gradient grid place-items-center text-primary-foreground font-bold font-display shrink-0 relative">
                  {r.avatarInitials}
                  {!r.active && <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 grid place-items-center"><Lock className="w-3 h-3 text-white" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center gap-2">{r.storeName} {r.active ? <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Ativo</span> : <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-medium">Bloqueado</span>}</div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3"><span>@{r.username}</span><span><Phone className="w-3 h-3 inline" /> {r.whatsapp}</span>{tpl && <span><FileText className="w-3 h-3 inline" /> {tpl.name}</span>}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-1.5 shrink-0 flex-wrap">
                  <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/loja/$slug" params={{ slug: r.slug }} target="_blank"><Store className="w-3.5 h-3.5 mr-1" /> Loja</Link></Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => startEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => adminStore.toggleResellerActive(r.slug)} title={r.active ? "Bloquear" : "Ativar"}>{r.active ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}</Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setPwSlug(r.slug); setNewPw(""); setPwOpen(true); }}><Key className="w-3.5 h-3.5" /></Button>
                  {tpl && <Button size="sm" variant="outline" className="rounded-full" onClick={() => { if (confirm(`Replicar "${tpl.name}"?`)) adminStore.applyTemplate(r.slug, r.templateId); }}><Copy className="w-3.5 h-3.5" /></Button>}
                  <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { if (confirm(`Excluir "${r.storeName}"?`)) adminStore.deleteReseller(r.slug); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </Card>
          );
        })}</div>
      )}
      {/* Create/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{isNew ? "Novo Revendedor" : "Editar Revendedor"}</DialogTitle></DialogHeader>
          {editing && (<div className="space-y-3">
            <F label="Nome completo"><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
            <F label="Nome da loja"><Input value={editing.storeName ?? ""} onChange={(e) => setEditing({ ...editing, storeName: e.target.value })} /></F>
            <F label="Bio"><Textarea value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={2} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="WhatsApp"><Input value={editing.whatsapp ?? ""} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} placeholder="5511999999999" /></F>
              <F label="Instagram"><Input value={editing.instagram ?? ""} onChange={(e) => setEditing({ ...editing, instagram: e.target.value })} placeholder="@usuario" /></F>
            </div>
            {isNew && (<div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
              <F label="Username"><Input value={editing.username ?? ""} onChange={(e) => setEditing({ ...editing, username: e.target.value })} /></F>
              <F label="Senha"><Input value={editing.password ?? ""} onChange={(e) => setEditing({ ...editing, password: e.target.value })} /></F>
            </div>)}
            {templates.length > 0 && (
              <F label="Modelo de catálogo">
                <select value={editing.templateId ?? ""} onChange={(e) => setEditing({ ...editing, templateId: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="">— Selecione —</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.products.length} produtos)</option>)}
                </select>
              </F>
            )}
          </div>)}
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={save} className="bg-primary-gradient">Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Change password */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-display">Alterar Senha</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Revendedor: <strong>{pwSlug}</strong></p>
          <F label="Nova senha"><Input value={newPw} onChange={(e) => setNewPw(e.target.value)} /></F>
          <DialogFooter><Button variant="ghost" onClick={() => setPwOpen(false)}>Cancelar</Button><Button onClick={() => { if (pwSlug && newPw) { adminStore.changeResellerPassword(pwSlug, newPw); setPwOpen(false); } }} className="bg-primary-gradient" disabled={!newPw}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>{children}</label>;
}
