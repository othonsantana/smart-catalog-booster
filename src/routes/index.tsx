import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles,
  Smartphone,
  MessageCircle,
  Zap,
  Check,
  ArrowRight,
  Star,
  ShoppingBag,
  Palette,
  BarChart3,
  Heart,
  Quote,
  LogIn,
  Instagram,
  Mail,
  PlayCircle,
} from "lucide-react";
import perfumeFloral from "@/assets/perfume-floral.jpg";
import bodyCream from "@/assets/body-cream.jpg";
import hairCare from "@/assets/hair-care.jpg";
import bodyOil from "@/assets/body-oil.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo Inteligente — Catálogo profissional para revendedores de perfumes e cosméticos" },
      { name: "description", content: "Crie em minutos um catálogo profissional de perfumes e cosméticos. Pedidos direto no WhatsApp. A partir de R$ 99/ano." },
      { property: "og:title", content: "Catálogo Inteligente — Catálogo profissional em 1 clique" },
      { property: "og:description", content: "Plataforma SaaS para revendedores: catálogo lindo, pedidos no WhatsApp, gestão simples." },
      { property: "og:url", content: "https://smart-catalog-booster.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://smart-catalog-booster.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Catálogo Inteligente",
          description: "SaaS de catálogos para revendedores de perfumes e cosméticos.",
          brand: { "@type": "Brand", name: "Catálogo Inteligente" },
          offers: [
            { "@type": "Offer", name: "Profissional", price: "99.00", priceCurrency: "BRL" },
            { "@type": "Offer", name: "Time", price: "199.00", priceCurrency: "BRL" },
          ],
        }),
      },
    ],
  }),
  component: LandingPage,
});

const BENEFITS = [
  { icon: Smartphone, title: "Mobile-first", desc: "Cada detalhe pensado pra brilhar no celular da sua cliente." },
  { icon: MessageCircle, title: "Pedidos no WhatsApp", desc: "Cliente finaliza e o pedido cai direto no seu WhatsApp." },
  { icon: Palette, title: "Visual premium", desc: "Banner, paleta e produtos com cara de marca de verdade." },
  { icon: Zap, title: "Pronto em minutos", desc: "Cadastre seus produtos e compartilhe o link. Simples." },
  { icon: BarChart3, title: "Você no controle", desc: "Adicione, edite e organize produtos sem depender de ninguém." },
  { icon: Heart, title: "Feito pra revenda", desc: "Perfumes, linha corporal e capilar — o nicho que entende você." },
];

const STEPS = [
  { n: "01", title: "Cadastre seus produtos", desc: "Nome, preço, foto e categoria. Em poucos minutos seu catálogo está pronto." },
  { n: "02", title: "Compartilhe seu link", desc: "Coloque no Instagram, status do WhatsApp e bio. Cliente abre direto no celular." },
  { n: "03", title: "Receba pedidos no WhatsApp", desc: "Cliente escolhe, finaliza e o pedido chega formatado no seu WhatsApp." },
];

const PLANS = [
  {
    name: "Profissional",
    price: "R$ 99",
    period: "/ano",
    desc: "Pra revendedora individual que quer vender com cara de marca.",
    features: [
      "Catálogo ilimitado de produtos",
      "Pedidos diretos no WhatsApp",
      "Banner e identidade personalizados",
      "Categorias por linha (corporal, capilar, perfumes)",
      "Suporte por WhatsApp",
    ],
    cta: "Começar agora",
    highlight: false,
  },
  {
    name: "Time",
    price: "R$ 199",
    period: "/ano",
    desc: "Pra quem tem equipe de revenda e quer escalar com 1 clique.",
    features: [
      "Tudo do plano Profissional",
      "Até 10 catálogos de revendedores",
      "Duplicar modelo de catálogo em 1 clique",
      "Painel admin centralizado",
      "Suporte prioritário",
    ],
    cta: "Falar com vendas",
    highlight: true,
  },
];

const TESTIMONIALS = [
  { name: "Aline R.", role: "Revendedora de perfumes", text: "Meu link no Instagram parecia o de uma marca grande. As clientes elogiam toda hora." },
  { name: "Camila S.", role: "Linha capilar", text: "Triplicou meus pedidos no WhatsApp. A facilidade de finalizar fez toda a diferença." },
  { name: "Patrícia M.", role: "Líder de equipe", text: "Duplico o catálogo modelo pras meninas e cada uma personaliza. Economizei semanas." },
];

const FAQS = [
  { q: "Preciso entender de tecnologia?", a: "Não. Você cadastra produto pelo celular, compartilha o link e pronto. Zero código." },
  { q: "Como o cliente faz o pedido?", a: "Ele monta o carrinho dentro do catálogo, preenche nome e endereço, e o pedido formatado chega no seu WhatsApp." },
  { q: "Posso mudar de plano depois?", a: "Sim. Você começa no Profissional e migra pro Time quando montar sua equipe." },
  { q: "Funciona em qualquer celular?", a: "Sim. O catálogo é otimizado pra abrir rápido em qualquer smartphone, sem instalar nada." },
  { q: "Posso instalar no celular como app?", a: "Sim. Tanto você quanto suas clientes podem adicionar o catálogo na tela inicial do celular." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <NavBar />
      <Hero />
      <SocialProof />
      <Steps />
      <Benefits />
      <Showcase />
      <Plans />
      <Testimonials />
      <FAQ />
      <CTABlock />
      <Footer />
    </div>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/75 border-b border-border/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-gradient grid place-items-center text-primary-foreground shadow-glow">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg">
            Catálogo<span className="text-primary">Inteligente</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a href="#beneficios" className="hover:text-foreground transition">Benefícios</a>
          <a href="#planos" className="hover:text-foreground transition">Planos</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          <Link to="/loja/$slug" params={{ slug: "maria" }} className="hover:text-foreground transition">Ver demo</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
            <Link to="/login"><LogIn className="w-4 h-4" /> Entrar</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-primary-gradient shadow-glow font-semibold">
            <a href="#planos">Começar <ArrowRight className="w-4 h-4" /></a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-60 bg-petal" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-50 bg-orchid" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full blur-3xl opacity-30 bg-blush" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> SaaS para revendedores
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] tracking-tight">
            Seu catálogo de perfumes e cosméticos,{" "}
            <span className="bg-clip-text text-transparent bg-primary-gradient">pronto em 1 clique.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Crie um catálogo lindo, mobile-first, com pedidos que caem direto no seu WhatsApp.
            Sem mensalidade abusiva, sem complicação, sem depender de ninguém.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-6 bg-primary-gradient shadow-glow font-semibold text-base">
              <a href="#planos">Quero meu catálogo <ArrowRight className="w-4 h-4" /></a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-6 font-semibold text-base border-border/70">
              <Link to="/loja/$slug" params={{ slug: "maria" }}>
                <PlayCircle className="w-4 h-4" /> Ver demo ao vivo
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {["A", "C", "P", "L"].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full grid place-items-center text-[10px] font-bold text-primary-foreground border-2 border-background"
                  style={{ background: `linear-gradient(135deg, oklch(0.7 0.14 ${300 + i * 15}), oklch(0.55 0.16 ${290 + i * 10}))` }}>
                  {l}
                </div>
              ))}
            </div>
            <span>Revendedoras já usam diariamente</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      <div aria-hidden className="absolute -inset-8 rounded-[3rem] bg-primary-gradient opacity-25 blur-3xl" />
      <div className="relative rounded-[2.5rem] bg-foreground p-3 shadow-elevated animate-float">
        <div className="rounded-[2rem] overflow-hidden bg-background aspect-[9/19.5] flex flex-col">
          {/* Status bar */}
          <div className="h-7 bg-background flex items-center justify-between px-6 text-[10px] font-semibold text-foreground">
            <span>9:41</span>
            <div className="w-16 h-4 rounded-b-2xl bg-foreground" />
            <span>100%</span>
          </div>
          {/* Banner */}
          <div className="relative h-24 bg-primary-gradient overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            <div className="absolute bottom-2 left-3 text-[10px] font-display font-bold text-primary-foreground">
              Loja da Maria
            </div>
          </div>
          {/* Avatar overlap */}
          <div className="px-3 -mt-5 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary-gradient border-2 border-background grid place-items-center text-[11px] font-bold text-primary-foreground shadow-soft">
              MV
            </div>
          </div>
          {/* Categories */}
          <div className="px-3 mt-3 flex gap-1.5 overflow-hidden">
            {["Todos", "Perfumes", "Corporal", "Capilar"].map((c, i) => (
              <span key={c} className={`text-[9px] px-2 py-1 rounded-full whitespace-nowrap ${i === 0 ? "bg-primary-gradient text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {c}
              </span>
            ))}
          </div>
          {/* Grid */}
          <div className="px-3 mt-3 grid grid-cols-2 gap-2 flex-1">
            {[perfumeFloral, bodyCream, hairCare, bodyOil].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl bg-card overflow-hidden shadow-soft"
              >
                <div className="aspect-square">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-1.5">
                  <div className="text-[8px] font-medium truncate">Produto {i + 1}</div>
                  <div className="text-[9px] font-bold text-primary">R$ {[89, 49, 79, 59][i]}</div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Cart bar */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="m-3 rounded-full bg-foreground text-background px-3 py-2 flex items-center justify-between text-[10px] font-semibold"
          >
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-3 h-3" /> 3 itens</span>
            <span>R$ 217</span>
          </motion.div>
        </div>
      </div>

      {/* Floating WhatsApp notification */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -right-4 sm:-right-10 top-1/3 w-44 rounded-2xl bg-card shadow-elevated p-3 border border-border/50"
      >
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-full grid place-items-center shrink-0" style={{ background: "var(--whatsapp)" }}>
            <MessageCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold">Novo pedido</div>
            <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Camila quer 3 itens — R$ 217</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SocialProof() {
  return (
    <section className="border-y border-border/40 bg-soft-gradient">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
          <span className="font-medium">Usado por revendedoras de</span>
          {["Eudora", "Natura", "O Boticário", "Avon", "Mahogany"].map((b) => (
            <span key={b} className="font-display font-semibold text-foreground/70 tracking-wide">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Como funciona"
          title="Do cadastro ao pedido em minutos"
          subtitle="3 passos simples. Sem curva de aprendizado, sem dor de cabeça."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl bg-card border border-border/60 p-7 shadow-soft hover:shadow-elevated transition-shadow"
            >
              <div className="text-5xl font-display font-bold bg-clip-text text-transparent bg-primary-gradient leading-none">
                {s.n}
              </div>
              <h3 className="mt-5 text-xl font-display font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="beneficios" className="py-20 sm:py-28 bg-soft-gradient">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Benefícios"
          title="Tudo que você precisa pra vender mais"
          subtitle="Plataforma feita pro nicho de perfumes e cosméticos. Nada genérico."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl bg-card border border-border/60 p-6 hover:border-primary/40 hover:shadow-soft transition"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary grid place-items-center text-primary mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wide">
            Veja na prática
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold leading-tight">
            Catálogo lindo no celular,<br />pedidos formatados no WhatsApp.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Sua cliente abre o link, escolhe os produtos, preenche os dados e o pedido cai
            no seu WhatsApp já organizado — com nome, endereço, itens e total.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Mensagem pronta, sem precisar digitar nada",
              "Cliente já chega decidida e com endereço",
              "Você só confirma e despacha",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary-gradient grid place-items-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-7 rounded-full bg-primary-gradient shadow-glow font-semibold" size="lg">
            <Link to="/loja/$slug" params={{ slug: "maria" }}>Abrir catálogo demo <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-card border border-border/60 p-6 shadow-elevated"
        >
          <div className="text-xs font-mono text-muted-foreground mb-3">WhatsApp · novo pedido</div>
          <div className="rounded-2xl bg-secondary/60 p-4 text-sm space-y-2 font-mono">
            <p>Olá, <strong>Loja da Maria</strong>! Quero fazer um pedido:</p>
            <p>• 1x Eau de Parfum Floral — R$ 89,00</p>
            <p>• 2x Óleo Corporal Satin — R$ 118,00</p>
            <p><strong>Total: R$ 207,00</strong></p>
            <div className="pt-1 border-t border-border/60 mt-2">
              <p><em>Dados de entrega</em></p>
              <p>Nome: Camila Souza</p>
              <p>Endereço: Rua das Flores, 120 — Vila Bela</p>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white rounded-full px-3 py-1.5" style={{ background: "var(--whatsapp)" }}>
            <MessageCircle className="w-3.5 h-3.5" /> Pedido recebido
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="planos" className="py-20 sm:py-28 bg-soft-gradient">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Planos"
          title="Comece agora, sem mensalidade"
          subtitle="Pague uma vez por ano. Sem surpresas, sem letra miúda."
        />
        <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 border ${
                p.highlight
                  ? "bg-foreground text-background border-foreground shadow-elevated"
                  : "bg-card border-border/60 shadow-soft"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-gradient text-primary-foreground shadow-glow">
                  Mais escolhido
                </span>
              )}
              <div className="text-xs font-semibold uppercase tracking-wider opacity-70">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-display font-bold">{p.price}</span>
                <span className={`text-sm ${p.highlight ? "opacity-70" : "text-muted-foreground"}`}>{p.period}</span>
              </div>
              <p className={`mt-3 text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"} leading-relaxed`}>{p.desc}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <div className={`w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5 ${p.highlight ? "bg-background/15" : "bg-primary-gradient"}`}>
                      <Check className={`w-3 h-3 ${p.highlight ? "text-background" : "text-primary-foreground"}`} />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className={`mt-8 w-full rounded-full font-semibold ${p.highlight ? "bg-primary-gradient text-primary-foreground shadow-glow" : "bg-foreground text-background hover:bg-foreground/90"}`}>
                <Link to="/login">{p.cta} <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Quem usa, recomenda"
          title="Revendedoras que vendem mais"
          subtitle="Depoimentos reais de quem trocou o catálogo no caderninho pelo Catálogo Inteligente."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl bg-card border border-border/60 p-7 shadow-soft relative"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/15" />
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-5 pt-5 border-t border-border/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-gradient grid place-items-center text-primary-foreground text-xs font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-soft-gradient">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Dúvidas frequentes"
          title="Tudo o que você precisa saber"
          subtitle="Se ficou alguma dúvida, é só chamar a gente no WhatsApp."
        />
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="rounded-2xl border border-border/60 bg-card px-5 data-[state=open]:shadow-soft">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTABlock() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center bg-foreground text-background shadow-elevated"
        >
          <div aria-hidden className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-gradient opacity-30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-orchid opacity-30 blur-3xl" />
          <div className="relative">
            <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
              Pronta pra ter um catálogo de marca de verdade?
            </h2>
            <p className="mt-4 text-background/70 max-w-xl mx-auto">
              Comece hoje mesmo. Em poucos minutos suas clientes já abrem seu catálogo no celular.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-primary-gradient shadow-glow font-semibold">
                <Link to="/login">Começar agora <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full font-semibold border-background/30 text-background bg-transparent hover:bg-background/10 hover:text-background">
                <Link to="/loja/$slug" params={{ slug: "maria" }}>Ver demo</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid sm:grid-cols-[1.4fr_1fr_1fr] gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient grid place-items-center text-primary-foreground shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold">Catálogo<span className="text-primary">Inteligente</span></span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground max-w-sm leading-relaxed">
            Plataforma SaaS para revendedoras de perfumes e cosméticos venderem com cara de marca.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Produto</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#beneficios" className="hover:text-primary transition">Benefícios</a></li>
            <li><a href="#planos" className="hover:text-primary transition">Planos</a></li>
            <li><Link to="/loja/$slug" params={{ slug: "maria" }} className="hover:text-primary transition">Demo</Link></li>
            <li><Link to="/login" className="hover:text-primary transition">Entrar</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contato</div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Instagram className="w-4 h-4 text-muted-foreground" /> @catalogointeligente</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> ola@catalogointeligente.com</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 pt-6 border-t border-border/50 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} Catálogo Inteligente. Todos os direitos reservados.</span>
        <span>Feito com <Heart className="w-3 h-3 inline fill-primary text-primary" /> pro nicho de beleza.</span>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold leading-tight">{title}</h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
