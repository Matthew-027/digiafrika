import { createFileRoute } from "@tanstack/react-router";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { useDash } from "@/lib/dash-context";
import { formatDateTime, formatNgn } from "@/lib/format";

export const Route = createFileRoute("/dashboard/commissions")({ component: CommissionsRoute });

function CommissionsRoute() {
  return (
    <DeskGate desk="affiliate">
      <CommissionsPage />
    </DeskGate>
  );
}

function CommissionsPage() {
  const { data } = useDash();
  return (
    <div>
      <PageHeader
        kicker="Ledger"
        title="Commissions"
        description="Approved commissions credit available balance immediately in this sandbox."
      />
      {data.commissions.length === 0 ? (
        <EmptyState
          title="No commissions yet"
          body="Promote a link and simulate a sale, or wait for a production pixel POST."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {data.commissions.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3">{c.campaignTitle}</td>
                  <td className="px-4 py-3 tabular font-medium">{formatNgn(Number(c.amountNgn))}</td>
                  <td className="px-4 py-3">
                    <Badge tone={c.status === "approved" || c.status === "paid" ? "ok" : "muted"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
