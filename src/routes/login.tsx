import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { join?: "1"; ref?: string } => {
    const search: { join?: "1"; ref?: string } = {};
    if (s.join === "1") search.join = "1";
    if (typeof s.ref === "string" && s.ref) search.ref = s.ref;
    return search;
  },
  component: Login,
});

function Login() {
  const { join, ref } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">(join ? "up" : "in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ref) sessionStorage.setItem("da_ref", ref);
  }, [ref]);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/dashboard" });
    }
  }, [isPending, user, navigate]);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0] || "Member",
          callbackURL: "/onboarding",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });
        if (err) throw new Error(err.message);
      }
      await navigate({ to: mode === "up" ? "/onboarding" : "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  if (isPending || user) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper">
        <div className="h-12 w-48 animate-pulse rounded-xl bg-secondary" />
      </main>
    );
  }

  return (
    <main className="grid min-h-dvh bg-paper md:grid-cols-2">
      <section className="hidden flex-col justify-between bg-forest-deep p-10 text-cream md:flex">
        <Link to="/">
          <Logo className="text-cream" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">The desk is open</p>
          <h1 className="mt-3 max-w-sm font-display text-4xl font-semibold leading-tight">
            One login for affiliates, vendors, and operators.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Track unique links, settle commissions in Naira and M-Pesa, and list digital products
            with cookie windows you control.
          </p>
        </div>
        <p className="text-sm text-cream/60">
          Google, X, or email. Affiliate and vendor desks share this login.
          Operator access is granted separately by the platform owner.
        </p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-5">
          <Link to="/" className="md:hidden">
            <Logo />
          </Link>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {mode === "up" ? "Create your desk" : "Sign in"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {mode === "up" ? "Already have an account?" : "New here?"}{" "}
              <button
                type="button"
                className="font-medium text-forest"
                onClick={() => setMode(mode === "up" ? "in" : "up")}
              >
                {mode === "up" ? "Sign in" : "Join free"}
              </button>
            </p>
          </div>
          {authEnabled ? (
            <div className="space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/onboarding" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
            <span className="h-px flex-1 bg-border" />
            or email
            <span className="h-px flex-1 bg-border" />
          </div>
          <form className="space-y-3" onSubmit={(e) => void onEmail(e)}>
            {mode === "up" ? (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
