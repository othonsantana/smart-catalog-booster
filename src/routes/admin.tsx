import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { adminStore, useAdminStore, type CatalogTemplate, type AdminReseller } from "@/lib/admin-store";
import { isAdmin, logout } from "@/lib/auth-store";
import { formatBRL, type Product } from "@/lib/catalog-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LayoutDashboard, FileText, Users, Plus, Pencil, Trash2, ExternalLink, Copy, Package, Sparkles, LogOut, Phone, Store, Lock, Unlock, Key, ShieldCheck, ShieldX, Eye } from "lucide-react";

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
  const blockedCount = resellers.length - activeCount;

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
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { label: "Modelos", value: templates.length, icon: FileText },
                  { label: "Revendedores", value: resellers.length, icon: Users },
                  { label: "Ativos", value: activeCount, icon: ShieldCheck },
                  { label: "Bloqueados", value: blockedCount, icon: ShieldX },
                ].map((s) => (
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
                {resellers.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum revendedor.</p> : (
                  <div className="space-y-2">{resellers.slice(0, 5).map((r) => (
                    <div key={r.slug} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-gradient grid place-items-center text-primary-foreground text-xs font-bold">{r.avatarInitials}</div>
                        <div>
                          <div className="text-sm font-medium flex items-center gap-2">{r.storeName} {r.active ? <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">Ativo</span> : <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">Bloqueado</span>}</div>
                          <div className="text-xs text-muted-foreground">/loja/{r.slug} · @{r.username}</div>
                        </div>
                      </div>
                      <Button asChild size="sm" variant="ghost" className="rounded-full"><Link to="/loja/$slug" params={{ slug: r.slug }} target="_blank"><ExternalLink className="w-3.5 h-3.5" /></Link></Button>
                    </div>
                  ))}</div>
                )}
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="templates"><TemplatesTab templates={templates} /></TabsContent>
          <TabsContent value="resellers"><ResellersTab resellers={resellers} templates={templates} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ─── Templates ──────────────────────────────────────────────────────────── */
function TemplatesTab({ templates }: { templates: CatalogTemplate[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTpl, setPreviewTpl] = useState<CatalogTemplate | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg">Modelos de Catálogo</h2>
        <Button size="sm" className="rounded-full bg-primary-gradient" onClick={() => { setEditing({ id: "", name: "", description: "", banner: "", products: [], createdAt: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Novo Modelo</Button>
      </div>
      {templates.length === 0 ? <Card className="rounded-2xl p-10 text-center text-muted-foreground shadow-soft">Nenhum modelo criado.</Card> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{templates.map((t) => (
          <Card key={t.id} className="rounded-2xl p-5 shadow-soft border-border/60 flex flex-col">
            <div className="flex items-start justify-between">
              <div><h3 className="font-semibold">{t.name}</h3><p className="text-xs text-muted-foreground mt-1">{t.description || "Sem descrição"}</p></div>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">{t.products.length} produtos</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">{Array.from(new Set(t.products.map((p) => p.category))).map((c) => <span key={c} className="px-2 py-0.5 rounded-full bg-petal/50 text-[10px] font-medium">{c}</span>)}</div>
            <div className="mt-auto pt-4 flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setPreviewTpl(t); setPreviewOpen(true); }}><Eye className="w-3 h-3 mr-1" /> Preview</Button>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setEditing({ ...t, products: t.products.map((p) => ({ ...p })) }); setOpen(true); }}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => adminStore.duplicateTemplate(t.id)}><Copy className="w-3 h-3" /></Button>
              <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { if (confirm(`Excluir "${t.name}"?`)) adminStore.deleteTemplate(t.id); }}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}</div>
      )}
      <TemplateDialog open={open} onOpenChange={setOpen} editing={editing} setEditing={setEditing} />
      {/* Preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Preview: {previewTpl?.name}</DialogTitle></DialogHeader>
          {previewTpl && (
            <div className="space-y-3">
              {previewTpl.banner && <div className="h-28 rounded-2xl bg-secondary" style={{ backgroundImage: `url(${previewTpl.banner})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
              <div className="grid grid-cols-2 gap-2">{previewTpl.products.map((p) => (
                <div key={p.id} className="rounded-xl bg-secondary/50 p-3">
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-sm font-bold text-primary">{formatBRL(p.price)}</div>
                </div>
              ))}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateDialog({ open, onOpenChange, editing, setEditing }: { open: boolean; onOpenChange: (v: boolean) => void; editing: CatalogTemplate | null; setEditing: (v: CatalogTemplate | null) => void }) {
  const [pOpen, setPOpen] = useState(false);
  const [ep, setEp] = useState<Partial<Product> & { id: string } | null>(null);
  const isNew = !editing?.id;
  function save() { if (!editing) return; if (isNew) adminStore.createTemplate({ name: editing.name, description: editing.description, banner: editing.banner, products: editing.products }); else adminStore.updateTemplate(editing.id, { name: editing.name, description: editing.description, banner: editing.banner, products: editing.products }); onOpenChange(false); setEditing(null); }
  function saveProd() { if (!editing || !ep) return; const p: Product = { id: ep.id, name: ep.name?.trim() || "Sem nome", description: ep.description?.trim() || "", price: Number(ep.price) || 0, oldPrice: ep.oldPrice ? Number(ep.oldPrice) : undefined, image: ep.image?.trim() || "", category: ep.category || "Perfumes", featured: ep.featured }; const idx = editing.products.findIndex((x) => x.id === p.id); const next = idx >= 0 ? editing.products.map((x) => x.id === p.id ? p : x) : [...editing.products, p]; setEditing({ ...editing, products: next }); setPOpen(false); setEp(null); }
  const cats = editing ? Array.from(new Set(editing.products.map((p) => p.category))) : [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display">{isNew ? "Novo Modelo" : "Editar Modelo"}</DialogTitle></DialogHeader>
        {editing && (<div className="space-y-4">
          <F label="Nome"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Ex: Catálogo Premium" /></F>
          <F label="Descrição"><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} /></F>
          <F label="Banner (URL)"><Input value={editing.banner} onChange={(e) => setEditing({ ...editing, banner: e.target.value })} placeholder="https://..." /></F>
          <div className="border-t border-border/60 pt-4">
            <div className="flex items-center justify-between mb-3"><span className="font-semibold text-sm">Produtos ({editing.products.length})</span>
              <Button size="sm" className="rounded-full bg-primary-gradient" onClick={() => { setEp({ id: `p_${Date.now()}`, name: "", description: "", price: 0, image: "", category: cats[0] || "Perfumes" }); setPOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Produto</Button>
            </div>
            {editing.products.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum produto.</p> : (
              <div className="space-y-2 max-h-60 overflow-y-auto">{editing.products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-secondary/50">
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{p.name}</div><div className="text-xs text-muted-foreground">{p.category} · {formatBRL(p.price)}</div></div>
                  <button onClick={() => { setEp({ ...p }); setPOpen(true); }} className="text-xs px-2 py-1 rounded-md bg-background"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => { if (confirm(`Remover "${p.name}"?`)) setEditing({ ...editing, products: editing.products.filter((x) => x.id !== p.id) }); }} className="text-xs px-2 py-1 rounded-md bg-background text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}</div>
            )}
          </div>
        </div>)}
        <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={save} className="bg-primary-gradient">Salvar</Button></DialogFooter>
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
              <F label="Imagem (URL)"><Input value={ep.image ?? ""} onChange={(e) => setEp({ ...ep, image: e.target.value })} placeholder="https://..." /></F>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!ep.featured} onChange={(e) => setEp({ ...ep, featured: e.target.checked })} /> Destacar</label>
            </div>)}
            <DialogFooter><Button variant="ghost" onClick={() => setPOpen(false)}>Cancelar</Button><Button onClick={saveProd} className="bg-primary-gradient">Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Resellers ──────────────────────────────────────────────────────────── */
function ResellersTab({ resellers, templates }: { resellers: AdminReseller[]; templates: CatalogTemplate[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<AdminReseller> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwSlug, setPwSlug] = useState("");
  const [newPw, setNewPw] = useState("");

  function startNew() { setEditing({ name: "", storeName: "", bio: "", whatsapp: "", instagram: "", templateId: templates[0]?.id || "", banner: "", username: "", password: "" }); setIsNew(true); setOpen(true); }
  function startEdit(r: AdminReseller) { setEditing({ ...r }); setIsNew(false); setOpen(true); }
  function save() {
    if (!editing) return;
    if (isNew) adminStore.createReseller({ name: editing.name || "Revendedor", storeName: editing.storeName || "Loja", bio: editing.bio || "", whatsapp: editing.whatsapp || "", instagram: editing.instagram || "", templateId: editing.templateId || "", banner: editing.banner, username: editing.username || "", password: editing.password || "123456" });
    else if (editing.slug) adminStore.updateReseller(editing.slug, { name: editing.name, storeName: editing.storeName, bio: editing.bio, whatsapp: editing.whatsapp, instagram: editing.instagram, templateId: editing.templateId, banner: editing.banner });
    setOpen(false); setEditing(null);
  }
  function changePw() { if (pwSlug && newPw) { adminStore.changeResellerPassword(pwSlug, newPw); setPwOpen(false); setNewPw(""); } }

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
                  <div className="font-semibold flex items-center gap-2">
                    {r.storeName}
                    {r.active ? <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Ativo</span> : <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-medium">Bloqueado</span>}
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                    <span>@{r.username}</span>
                    <span><Phone className="w-3 h-3 inline" /> {r.whatsapp}</span>
                    {tpl && <span><FileText className="w-3 h-3 inline" /> {tpl.name}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.products.length} produtos</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-1.5 shrink-0 flex-wrap">
                  <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/loja/$slug" params={{ slug: r.slug }} target="_blank"><Store className="w-3.5 h-3.5 mr-1" /> Loja</Link></Button>
                  <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/painel/$slug" params={{ slug: r.slug }} target="_blank"><ExternalLink className="w-3.5 h-3.5 mr-1" /> Painel</Link></Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => startEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => adminStore.toggleResellerActive(r.slug)} title={r.active ? "Bloquear" : "Ativar"}>{r.active ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}</Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setPwSlug(r.slug); setNewPw(""); setPwOpen(true); }} title="Alterar senha"><Key className="w-3.5 h-3.5" /></Button>
                  {tpl && <Button size="sm" variant="outline" className="rounded-full" onClick={() => { if (confirm(`Replicar "${tpl.name}"?`)) adminStore.applyTemplate(r.slug, r.templateId); }}><Copy className="w-3.5 h-3.5" /></Button>}
                  <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { if (confirm(`Excluir "${r.storeName}"?`)) adminStore.deleteReseller(r.slug); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </Card>
          );
        })}</div>
      )}
      {/* Create/Edit dialog */}
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
              <F label="Username (login)"><Input value={editing.username ?? ""} onChange={(e) => setEditing({ ...editing, username: e.target.value })} placeholder="usuario" /></F>
              <F label="Senha"><Input value={editing.password ?? ""} onChange={(e) => setEditing({ ...editing, password: e.target.value })} placeholder="senha123" /></F>
            </div>)}
            {templates.length > 0 && (
              <F label="Modelo de catálogo">
                <select value={editing.templateId ?? ""} onChange={(e) => setEditing({ ...editing, templateId: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="">— Selecione um modelo —</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.products.length} produtos)</option>)}
                </select>
              </F>
            )}
          </div>)}
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={save} className="bg-primary-gradient">Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Change password dialog */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-display">Alterar Senha</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Revendedor: <strong>{pwSlug}</strong></p>
          <F label="Nova senha"><Input type="text" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Nova senha" /></F>
          <DialogFooter><Button variant="ghost" onClick={() => setPwOpen(false)}>Cancelar</Button><Button onClick={changePw} className="bg-primary-gradient" disabled={!newPw}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>{children}</label>;
}
