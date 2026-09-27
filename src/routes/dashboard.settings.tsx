import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useDash } from "@/lib/dash-context";
import { DESK_LABEL } from "@/lib/roles";
import { savePayoutProfile } from "@/lib/server/platform";
import { COUNTRIES, PAYOUT_METHODS } from "@/lib/types";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

function SettingsPage() {
  const { data, reload } = useDash();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    displayName: data.profile.displayName,
    phone: data.profile.phone ?? "",
    country: data.profile.country,
    payoutMethod: data.profile.payoutMethod ?? "paystack",
    payoutDetails: data.profile.payoutDetails ?? "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await savePayoutProfile({
        data: {
          displayName: form.displayName.trim(),
          phone: form.phone.trim() || undefined,
          country: form.country,
          payoutMethod: form.payoutMethod,
          payoutDetails: form.payoutDetails.trim() || undefined,
        },
      });
      toast.success("Profile saved");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        kicker="Account"
        title="Settings"
        description={
          data.profile.deskRole === "vendor"
            ? "Account details for your vendor desk. Pixel secret is for your checkout only."
            : "Account details for this desk. Platform settings live on the admin desk."
        }
      />
      <form className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-5" onSubmit={(e) => void onSubmit(e)}>
        <div className="space-y-1.5">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Select
              id="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="method">Preferred rail</Label>
          <Select
            id="method"
            value={form.payoutMethod}
            onChange={(e) => setForm({ ...form, payoutMethod: e.target.value })}
          >
            {PAYOUT_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="details">Destination details</Label>
          <Input
            id="details"
            value={form.payoutDetails}
            onChange={(e) => setForm({ ...form, payoutDetails: e.target.value })}
            placeholder="Account, MSISDN, or customer code"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Signed in as {data.profile.email || data.profile.displayName}
        </p>
        <p className="text-sm text-muted-foreground">
          Desk: {DESK_LABEL[data.profile.deskRole]}
          {data.profile.isAdmin
            ? " — operator access is separate from vendor and affiliate accounts."
            : " — this account cannot open the other desks."}
        </p>
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </Button>
      </form>
      {data.profile.deskRole === "vendor" && data.settings.pixelSecret ? (
      <div className="mt-6 max-w-xl rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">Conversion pixel</p>
        <p className="mt-2 text-sm text-muted-foreground">
          POST conversions to <code className="font-mono text-foreground">/api/convert</code> with this sandbox
          secret. Replace with a rotated production secret before going live.
        </p>
        <p className="mt-3 break-all rounded-[10px] border border-border bg-secondary px-3 py-2 font-mono text-xs">
          {data.settings.pixelSecret}
        </p>
      </div>
      ) : null}
    </div>
  );
}
