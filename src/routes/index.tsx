import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, LogIn, AlertCircle, User } from "lucide-react";
import { login, isAuthenticated, getAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Login — Catálogo Inteligente" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth) navigate({ to: auth.role === "admin" ? "/admin" : `/painel/${auth.slug}` });
  }, [navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        if (result.role === "admin") navigate({ to: "/admin" });
        else navigate({ to: `/painel/${result.slug}` });
      } else {
        setError("Usuário ou senha incorretos, ou conta bloqueada.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute rounded-full blur-3xl opacity-50 bg-petal w-[500px] h-[500px] -top-40 -left-40" />
      <div aria-hidden className="pointer-events-none absolute rounded-full blur-3xl opacity-40 bg-orchid w-[600px] h-[600px] -bottom-40 -right-40" />
      <div aria-hidden className="pointer-events-none absolute rounded-full blur-3xl opacity-30 bg-blush w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <Card className="relative w-full max-w-sm mx-4 rounded-3xl shadow-elevated border-border/60 p-8 backdrop-blur-sm bg-card/90">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-gradient grid place-items-center text-primary-foreground shadow-glow">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-display font-bold">Catálogo<span className="text-primary">Inteligente</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Acesse sua conta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome de usuário</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} placeholder="seu.usuario" className="rounded-xl h-11 pl-9" autoFocus />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Senha</label>
            <Input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className="rounded-xl h-11" />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" className="w-full rounded-xl h-11 bg-primary-gradient shadow-glow font-semibold" disabled={loading || !username || !password}>
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" /> Entrar</>}
          </Button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Administradores e revendedores usam o mesmo login
        </p>
      </Card>
    </div>
  );
}
