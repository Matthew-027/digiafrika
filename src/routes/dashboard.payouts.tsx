import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useDash } from "@/lib/dash-context";
import { formatDateTime, formatNgn, payoutMethodLabel } from "@/lib/format";
import { getPayouts, requestPayout } from "@/lib/server/platform";
import { PAYOUT_METHODS, type Payout } from "@/lib/types";

export const Route = createFileRoute("/dashboard/payouts")({ component: PayoutsRoute });

function PayoutsRoute() {
  return (
    <DeskGate desk="affiliate">
      <PayoutsPage />
    </DeskGate>
  );
}

function PayoutsPage() {
  const { data, reload } = useDash();
  const [rows, setRows] = useState<Payout[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<(typeof PAYOUT_METHODS)[number]["id"]>("paystack");
  const [details, setDetails] = useState(data.profile.payoutDetails ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getPayouts().then(setRows);
  }, [data.wallet.availableNgn, data.wallet.paidNgn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await requestPayout({
        data: {
          amountNgn: Number(amount),
          method,
          details: details.trim(),
        },
      });
      toast.success("Payout queued on the sandbox rail");
      setAmount("");
      await reload();
      const next = await getPayouts();
      setRows(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not request payout");
    } finally {
      setBusy(false);
    }
  }

  const min = data.settings.minPayoutNgn;

  return (
    <div>
      <PageHeader
        kicker="Settlement"
        title="Payouts"
        description={`Minimum ${formatNgn(min)}. Paystack, Flutterwave, and M-Pesa accept the same payload — swap live keys before production.`}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Available" value={formatNgn(Number(data.wallet.availableNgn))} />
        <StatCard label="Paid" value={formatNgn(Number(data.wallet.paidNgn))} />
        <StatCard label="Lifetime" value={formatNgn(Number(data.wallet.lifetimeNgn))} />
      </div>
      <form
        className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2"
        onSubmit={(e) => void onSubmit(e)}
      >
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (NGN)</Label>
          <Input
            id="amount"
            type="number"
            min={min}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="method">Rail</Label>
          <Select id="method" value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
            {PAYOUT_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="details">Destination</Label>
          <Input
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Paystack customer code, M-Pesa MSISDN, or bank + account"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Submitting…" : "Request payout"}
          </Button>
        </div>
      </form>
      <h2 className="mt-8 font-display text-lg font-semibold">History</h2>
      {rows.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="No payouts yet"
            body="Earn commissions, then request settlement on a sandbox rail."
          />
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Rail</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 tabular">{formatNgn(Number(p.amountNgn))}</td>
                  <td className="px-4 py-3">{payoutMethodLabel(p.method)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.status === "paid" ? "ok" : p.status === "rejected" ? "warn" : "muted"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
