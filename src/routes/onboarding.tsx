import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { DESK_HOME, type ProductRole } from "@/lib/roles";
import { completeOnboarding, getMyProfile } from "@/lib/server/platform";
import { COUNTRIES } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const CHOICES: Array<{ id: ProductRole; title: string; body: string }> = [
  {
    id: "vendor",
    title: "I want to sell products",
    body: "Open a vendor desk. You will submit a store profile for Admin review before listing offers.",
  },
  {
    id: "affiliate",
    title: "I want to promote products and earn commissions",
    body: "Open an affiliate desk. Track links and commissions. You will not get the vendor or admin desks.",
  },
];

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("NG");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<ProductRole>("affiliate");
  const [referral, setReferral] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("da_ref");
    if (stored) setReferral(stored);
  }, []);

  useEffect(() => {
    if (isPending || !user) return;
    setDisplayName((prev) => prev || user.displayName || "");
    void getMyProfile()
      .then((profile) => {
        if (profile?.onboardedAt) {
          void navigate({ to: DESK_HOME[profile.deskRole] });
          return;
        }
        if (profile?.displayName) setDisplayName(profile.displayName);
        if (profile?.country) setCountry(profile.country);
      })
      .finally(() => setChecking(false));
  }, [isPending, user, navigate]);

  if (isPending || checking) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper">
        <div className="h-12 w-48 animate-pulse rounded-xl bg-secondary" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const profile = await completeOnboarding({
        data: {
          displayName: displayName.trim(),
          country,
          role,
          phone: phone.trim() || undefined,
          referralCode: referral.trim() || undefined,
          email: user?.primaryEmail,
        },
      });
      sessionStorage.removeItem("da_ref");
      await navigate({ to: DESK_HOME[profile.deskRole] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not finish setup");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-paper px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <Logo />
        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-forest">Onboarding</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Choose your desk</h1>
        <p className="mt-2 text-sm text-muted">
          Pick one account type. Admin is not available here — operator access is granted separately.
        </p>
        <form className="mt-8 space-y-5" onSubmit={(e) => void onSubmit(e)}>
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              minLength={2}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234…"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Account type</Label>
            <div className="grid gap-2">
              {CHOICES.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setRole(choice.id)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left",
                    role === choice.id ? "border-forest bg-forest/10" : "border-border bg-cream",
                  )}
                >
                  <p className="font-medium">{choice.title}</p>
                  <p className="text-xs text-muted">{choice.body}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="referral">Referral code (optional)</Label>
            <Input
              id="referral"
              value={referral}
              onChange={(e) => setReferral(e.target.value.toUpperCase())}
              placeholder="AF••••"
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Opening desk…" : role === "vendor" ? "Enter vendor desk" : "Enter affiliate desk"}
          </Button>
        </form>
      </div>
    </main>
  );
}
