## Objetivo

Elevar o nível visual e de UX em todas as frentes principais, sem mexer em regras de negócio nem em backend. Foco: parecer SaaS premium pronto para vender.

## 1. Reestruturação de rotas

- `/` deixa de ser login e passa a ser a **landing institucional** (já existe em versões anteriores; reconstruir com polish premium).
- Criar `src/routes/login.tsx` com o conteúdo atual do login (movido de `index.tsx`), mesmo design, só polido.
- Atualizar `auth-store` redirects e qualquer `<Link to="/">` que aponte pra login.

## 2. Landing institucional (/)

Seções, todas com animação de entrada (motion):
- **Hero**: headline forte ("Seu catálogo de perfumes e cosméticos, pronto em 1 clique"), subtítulo, dois CTAs (Ver demo → `/loja/maria`, Entrar → `/login`), mockup flutuante do catálogo em celular com glow Blush & Lavender.
- **Logos/social proof** (placeholder com nomes de marcas fictícias de revenda).
- **Como funciona** em 3 passos com ícones.
- **Benefícios** focados em perfumes/cosméticos.
- **Demonstração visual** lado-a-lado: print do catálogo + WhatsApp recebendo pedido.
- **Planos** (Profissional R$ 99/ano, Time R$ 199/ano) — manter valores atuais.
- **Depoimentos** de revendedoras.
- **FAQ**.
- **Footer** com links institucionais + login.

## 3. Polish do catálogo público (/loja/:slug)

Mantém toda a lógica atual. Mudanças só visuais:
- Hero da loja com gradient overlay mais sofisticado e badge "Loja oficial".
- Tipografia mais hierarquizada (display nos preços maiores, eyebrows em uppercase tracking).
- Cards de produto com hover sutil, sombra `shadow-elevated`, badge de desconto refinada.
- Sticky search bar com transição suave de blur.
- Bottom bar do carrinho com microanimação no contador.
- Skeleton states ao trocar de categoria.
- Empty state ilustrado.

## 4. Polish do painel do revendedor (/painel/:slug)

Mantém CRUD existente. Mudanças visuais:
- Layout com sidebar colapsável (shadcn sidebar) em desktop, tabs em mobile.
- Cards de KPI no topo (placeholders: total produtos, categorias, banner ativo).
- Tabela/lista de produtos com thumb maior, ações em hover.
- Form de produto em Sheet lateral em vez de modal central — mais fluido em mobile.
- Toasts em vez de alerts nativos.
- Botão "Ver minha loja" sempre visível.

## 5. SEO + Manifest mobile

- `head()` dinâmico por rota (já parcial em `/loja/:slug`): garantir `og:title`, `og:description`, `og:image`, `og:url` em `/`, `/login`, `/loja/:slug`.
- JSON-LD Organization no root, JSON-LD ItemList/Product no catálogo.
- Canonical em rotas folha.
- `public/manifest.webmanifest` com `display: "standalone"`, ícones, `theme_color` Blush & Lavender → loja instalável no celular **sem service worker** (só manifest, conforme política PWA).
- Link no `__root.tsx` para o manifest e apple-touch-icon.
- `public/robots.txt` já existe; atualizar `sitemap.xml` para incluir lojas demo.

## 6. Detalhes técnicos

- Toda paleta e sombras continuam vindo de `src/styles.css` (tokens existentes: `--primary-gradient`, `--shadow-elevated`, `--shadow-glow`, `bg-petal`, `bg-orchid`, `bg-blush`).
- Animações com `motion/react` já instalado.
- Sem mudanças em `auth-store`, `cart-store`, `reseller-store`, `catalog-data` além de import/redirects.
- Sem backend, sem Lovable Cloud nesta rodada.

## Fora de escopo (não mexer)

- Templates do admin com duplicação 1-clique (você deixou de fora).
- Onboarding/cadastro real / Supabase.
- Upload de imagens real.
