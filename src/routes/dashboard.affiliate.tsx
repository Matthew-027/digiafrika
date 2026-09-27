import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { useDash } from "@/lib/dash-context";

export const Route = createFileRoute("/dashboard/affiliate")({ component: AffiliateRoute });

function AffiliateRoute() {
  return (
    <DeskGate desk="affiliate">
      <AffiliateHome />
    </DeskGate>
  );
}

const upcoming = [
  { label: "My applications", body: "Apply to promote a vendor’s offer." },
  { label: "My links", body: "Unique tracking links for approved promotions." },
  { label: "Clicks", body: "Hop counts on your links." },
  { label: "Sales", body: "Attributed conversions." },
  { label: "Commissions", body: "Earnings from approved sales." },
  { label: "Wallet", body: "Available balance and payouts." },
];

function AffiliateHome() {
  const { data } = useDash();

  return (
    <div>
      <PageHeader
        kicker="Affiliate"
        title={`Welcome back, ${data.profile.displayName.split(" ")[0]}`}
        description="Start with the marketplace. Applications, tracking, and payouts come in later steps."
        action={
          <Button asChild variant="gold">
            <Link to="/dashboard/offers">Open marketplace</Link>
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/dashboard/offers"
          className="rounded-xl border border-border bg-card p-5 hover:border-gold"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">Ready</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Marketplace</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse approved products, inspect commission terms, and open an offer.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm text-gold">
            Browse offers <ArrowUpRight className="size-4" />
          </span>
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Applications</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vendor approval of affiliates is not open yet. Review offers now so you are ready.
          </p>
        </div>
      </div>
      <h2 className="mt-8 font-display text-lg font-semibold">Coming later</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {upcoming.map((item) => (
          <li key={item.label} className="rounded-xl border border-border bg-card px-4 py-3">
            <p className="font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
      {data.enrollments.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No promotions yet"
            body="When applications and tracking links ship, they will show here. For now, browse approved offers."
            action={
              <Button asChild variant="gold">
                <Link to="/dashboard/offers">Go to marketplace</Link>
              </Button>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
