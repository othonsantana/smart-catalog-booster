import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles,
  Smartphone,
  Zap,
  ShoppingBag,
  MessageCircle,
  BarChart3,
  Palette,
  Link2,
  Check,
  ArrowRight,
  Heart,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo Inteligente — Catálogo profissional para revendedores de perfumes e cosméticos" },
      {
        name: "description",
        content:
          "Plataforma para revendedores de perfumes, cosméticos, linha corporal e capilar criarem seu catálogo online com link próprio, carrinho e pedidos via WhatsApp.",
      },
      { property: "og:title", content: "Catálogo Inteligente" },
      {
        property: "og:description",
        content: "Seu catálogo de perfumes e cosméticos pronto em 1 minuto. Pedidos direto no WhatsApp.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

const BENEFITS = [
  { icon: Smartphone, title: "Pensado pro celular", text: "Visual de aplicativo, rápido e simples — perfeito pra suas clientes verem seus perfumes e cosméticos." },
  { icon: MessageCircle, title: "Pedidos no WhatsApp", text: "A cliente escolhe os produtos da linha corporal ou capilar e o pedido cai formatado no seu WhatsApp." },
  { icon: Link2, title: "Link próprio", text: "Cada revendedor ganha um endereço exclusivo pra compartilhar perfumes e cosméticos." },
  { icon: Palette, title: "Visual personalizado", text: "Banner, cores e produtos da sua linha corporal e capilar do seu jeito, sem código." },
  { icon: BarChart3, title: "Métricas em tempo real", text: "Acompanhe acessos, produtos mais clicados e taxa de conversão do seu catálogo." },
  { icon: Zap, title: "Pronto em 1 clique", text: "O administrador duplica um modelo profissional pra você. Você só personaliza seus perfumes e cosméticos." },
];

const FEATURES = [
  "Cadastro ilimitado de revendedores",
  "Modelos de catálogo profissionais",
  "Mini carrinho inteligente",
  "Categorias: Perfumes, Corporal, Capilar",
  "Banners promocionais",
  "Captura automática de leads",
  "Compartilhamento por WhatsApp",
  "Dashboard com métricas",
];

const STEPS = [
  { n: "01", title: "Crie o modelo", text: "O admin monta um catálogo padrão com perfumes, cosméticos corporais e capilares." },
  { n: "02", title: "Duplica em 1 clique", text: "Cada novo revendedor recebe uma cópia personalizada na hora." },
  { n: "03", title: "Compartilha o link", text: "O revendedor envia seu catálogo no Status e converte vendas de perfumes e cosméticos." },
];

const PLANS = [
  {
    name: "Essencial",
    price: "R$ 29",
    cadence: "/mês",
    desc: "Pra começar a vender perfumes e cosméticos online já.",
    features: ["Até 30 produtos", "Link próprio", "Pedidos via WhatsApp", "Suporte por chat"],
    highlight: false,
  },
  {
    name: "Profissional",
    price: "R$ 99",
    cadence: "/ano",
    desc: "O mais escolhido pelos revendedores de perfumes.",
    features: ["Produtos ilimitados", "Banners promocionais", "Dashboard de métricas", "Personalização total", "Suporte prioritário"],
    highlight: true,
  },
  {
    name: "Time",
    price: "R$ 199",
    cadence: "/ano",
    desc: "Pra quem gerencia vários revendedores de cosméticos.",
    features: ["Tudo do Profissional", "Até 10 revendedores", "Painel administrativo", "Relatórios consolidados"],
    highlight: false,
  },
];

const TESTIMONIALS = [
  { name: "Carla, 42", role: "Perfumes importados", text: "Em 1 semana minhas vendas de perfumes pelo WhatsApp dobraram. Minhas clientes adoram escolher pela foto." },
  { name: "Renata, 38", role: "Linha capilar e corporal", text: "Eu vendo kits de cabelo e hidratantes. O catálogo ficou tão lindo que minhas clientes acham que tenho uma loja de verdade." },
  { name: "Beatriz, 51", role: "Cosméticos premium", text: "O link com meu nome ficou perfeito. Agora vendo minha linha corporal e perfumes de forma muito mais organizada." },
];

const FAQS = [
  { q: "Eu preciso saber de tecnologia?", a: "Não. Tudo é feito em poucos cliques pelo celular ou computador, com modelos prontos pra perfumes e cosméticos." },
  { q: "Como funciona o pedido?", a: "A cliente escolhe os produtos da linha corporal ou capilar, finaliza com nome e telefone, e o pedido chega formatado no seu WhatsApp." },
  { q: "Posso mudar o visual da loja?", a: "Sim. Você personaliza banners, cores, logo e os produtos que aparecem — perfumes, cremes, shampoos etc." },
  { q: "Preciso pagar pra testar?", a: "Não. Você experimenta a plataforma gratuitamente antes de assinar." },
];

function FloatingBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-60 ${className}`}
    />
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-primary-gradient text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>Catálogo<span className="text-primary">Inteligente</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#beneficios" className="hover:text-foreground transition">Benefícios</a>
            <a href="#como-funciona" className="hover:text-foreground transition">Como funciona</a>
            <a href="#planos" className="hover:text-foreground transition">Planos</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/admin">Painel Admin</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/painel/$slug" params={{ slug: "maria" }}>Painel demo</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/loja/$slug" params={{ slug: "maria" }}>Ver demo</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-4 bg-primary-gradient shadow-glow">
              <a href="#planos">Começar agora</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <FloatingBlob className="bg-petal w-[420px] h-[420px] -top-20 -left-20" />
        <FloatingBlob className="bg-orchid w-[520px] h-[520px] -top-40 right-[-180px]" />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Novo: pedidos direto no WhatsApp
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight">
              Seu catálogo profissional, pronto em <span className="text-primary">1 minuto</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              A plataforma feita pra revendedores de perfumes, cosméticos, linha corporal e capilar.
              Link próprio, mini carrinho e pedidos formatados direto no seu WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 bg-primary-gradient shadow-glow">
                <a href="#planos">
                  Criar meu catálogo <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link to="/loja/$slug" params={{ slug: "maria" }}>Ver demo ao vivo</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["MH", "RL", "BC", "JS"].map((i, idx) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background grid place-items-center text-[10px] font-semibold text-primary-foreground"
                    style={{ background: `oklch(0.65 0.14 ${280 + idx * 12})` }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span>+2.300 revendedores de perfumes e cosméticos já vendem com a gente</span>
            </div>
          </motion.div>

          {/* Phone mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto"
          >
            <div className="relative w-[280px] h-[560px] rounded-[3rem] bg-foreground p-3 shadow-elevated animate-float">
              <div className="w-full h-full rounded-[2.4rem] bg-hero-gradient overflow-hidden relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-foreground rounded-full" />
                <div className="pt-10 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary-gradient grid place-items-center text-primary-foreground text-xs font-bold">MH</div>
                    <div>
                      <div className="text-[11px] font-semibold">Maria Helena Beauty</div>
                      <div className="text-[9px] text-muted-foreground">@mariahelena.beauty</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-card/80 backdrop-blur px-3 py-2 text-[10px] text-muted-foreground shadow-soft">
                    🔥 Black Friday — até 40% off
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="rounded-xl bg-card shadow-soft overflow-hidden">
                        <div className="aspect-square bg-petal/50" />
                        <div className="p-2">
                          <div className="text-[9px] font-medium truncate">Produto {i}</div>
                          <div className="text-[10px] font-bold text-primary">R$ 89,90</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-foreground text-background px-4 py-3 flex items-center justify-between text-xs font-semibold shadow-elevated">
                  <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> 3 itens</span>
                  <span>R$ 297,00</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-10 px-3 py-2 rounded-2xl bg-card shadow-elevated text-xs flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary fill-primary" /> +127 favoritos hoje
            </div>
            <div className="absolute -left-6 bottom-20 px-3 py-2 rounded-2xl bg-card shadow-elevated text-xs flex items-center gap-2">
              <MessageCircle className="w-4 h-4" style={{ color: "var(--whatsapp)" }} /> Pedido recebido
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-24 bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Benefícios</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold">
              Tudo que você precisa, nada que atrapalhe.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Pensado pra quem vende todo dia no WhatsApp e quer parecer profissional sem complicação.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="p-6 h-full border-border/60 hover:shadow-elevated hover:-translate-y-1 transition-all rounded-2xl">
                  <div className="w-11 h-11 rounded-xl bg-secondary grid place-items-center text-primary mb-4">
                    <b.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Como funciona</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold">Do modelo ao primeiro pedido</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-3xl p-8 bg-card border border-border/60 shadow-soft">
                <div className="text-6xl font-display font-bold text-primary/15">{s.n}</div>
                <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="py-24 bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Funcionalidades</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold">Um SaaS completo, sem complicação.</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Da gestão dos produtos até o pedido formatado no WhatsApp, tudo cuidadosamente desenhado.
            </p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary-gradient text-primary-foreground grid place-items-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary-gradient rounded-3xl rotate-3 opacity-20" />
            <Card className="relative rounded-3xl p-6 shadow-elevated">
              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold">Painel da Maria</div>
                <span className="text-xs text-muted-foreground">Hoje</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { k: "Pedidos", v: "32" },
                  { k: "Acessos", v: "1.2k" },
                  { k: "Conversão", v: "8,4%" },
                ].map((m) => (
                  <div key={m.k} className="rounded-2xl p-4 bg-secondary">
                    <div className="text-2xl font-display font-bold">{m.v}</div>
                    <div className="text-xs text-muted-foreground">{m.k}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Acessos por dia</div>
                <div className="flex items-end gap-1.5 h-24">
                  {[20, 35, 28, 50, 42, 70, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-md bg-primary-gradient"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Planos</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold">Comece grátis, escale quando precisar.</h2>
            <p className="mt-4 text-muted-foreground">Sem fidelidade. Cancele quando quiser.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PLANS.map((p) => (
              <Card
                key={p.name}
                className={`rounded-3xl p-7 relative ${
                  p.highlight
                    ? "bg-primary-gradient text-primary-foreground border-transparent shadow-glow scale-[1.03]"
                    : "bg-card border-border/60"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground text-background text-xs font-semibold">
                    Mais popular
                  </span>
                )}
                <h3 className="font-display font-bold text-2xl">{p.name}</h3>
                <p className={`text-sm mt-1 ${p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.desc}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-display font-bold">{p.price}</span>
                  <span className={p.highlight ? "text-primary-foreground/80 mb-2" : "text-muted-foreground mb-2"}>{p.cadence}</span>
                </div>
                <Button
                  className={`mt-6 w-full rounded-full ${
                    p.highlight ? "bg-foreground text-background hover:bg-foreground/90" : "bg-primary-gradient"
                  }`}
                >
                  Começar agora
                </Button>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 mt-0.5 ${p.highlight ? "text-primary-foreground" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Depoimentos</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold">Revendedoras que vendem mais com a gente.</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="rounded-3xl p-6 shadow-soft">
                <div className="flex gap-0.5 text-primary mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-gradient grid place-items-center text-primary-foreground font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold">Perguntas frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="rounded-3xl bg-primary-gradient text-primary-foreground p-10 md:p-16 text-center relative overflow-hidden shadow-elevated">
            <FloatingBlob className="bg-petal/50 w-[300px] h-[300px] -top-20 -left-10" />
            <FloatingBlob className="bg-blush/40 w-[300px] h-[300px] -bottom-20 -right-10" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-display font-bold">Pronta pra ter seu catálogo profissional?</h2>
              <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
                Crie sua loja em 1 minuto e comece a receber pedidos direto no WhatsApp ainda hoje.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Button asChild size="lg" className="rounded-full px-7 bg-foreground text-background hover:bg-foreground/90">
                  <a href="#planos">Começar agora <ArrowRight className="ml-2 w-4 h-4" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-7 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/loja/$slug" params={{ slug: "maria" }}>Ver demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-primary-gradient text-primary-foreground">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            Catálogo Inteligente
          </div>
          <div>© {new Date().getFullYear()} — Feito com carinho pra quem vende perfumes e cosméticos.</div>
        </div>
      </footer>
    </div>
  );
}
