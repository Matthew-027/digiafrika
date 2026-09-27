import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { useDash } from "@/lib/dash-context";
import { formatDate, referralUrl } from "@/lib/format";
import { getReferrals } from "@/lib/server/platform";

export const Route = createFileRoute("/dashboard/referrals")({ component: ReferralsRoute });

function ReferralsRoute() {
  return (
    <DeskGate desk="affiliate">
      <ReferralsPage />
    </DeskGate>
  );
}

function ReferralsPage() {
  const { data } = useDash();
  const [info, setInfo] = useState<{
    code: string;
    percent: number;
    people: Array<{ displayName: string; country: string; createdAt: string }>;
  } | null>(null);

  useEffect(() => {
    void getReferrals().then(setInfo);
  }, [data.referralCount]);

  const code = info?.code ?? data.profile.referralCode;
  const percent = info?.percent ?? data.settings.referralPct;
  const people = info?.people ?? [];

  async function copy() {
    await navigator.clipboard.writeText(referralUrl(code));
    toast.success("Referral link copied");
  }

  return (
    <div>
      <PageHeader
        kicker="Growth"
        title="Referrals"
        description={`You earn a ${percent}% override on commissions from affiliates who join with your code.`}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Your code" value={code} hint="Share with new affiliates and vendors" />
        <StatCard label="Joined" value={String(people.length)} hint={`${percent}% override on their sales`} />
      </div>
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="break-all font-mono text-xs text-muted-foreground">{referralUrl(code)}</p>
        <Button size="sm" variant="outline" onClick={() => void copy()}>
          <Copy className="size-4" /> Copy link
        </Button>
      </div>
      <h2 className="mt-8 font-display text-lg font-semibold">People you invited</h2>
      {people.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="No referrals yet"
            body="Share your code. When they sell, a percentage of their commission credits your wallet."
          />
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {people.map((p) => (
            <li key={`${p.displayName}-${p.createdAt}`} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{p.displayName}</p>
                <p className="text-xs text-muted-foreground">{p.country}</p>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
