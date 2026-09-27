import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatMoney } from "@/lib/format";
import { commissionLabel, commissionPayout } from "@/lib/marketplace";
import { PRODUCT_TYPE_LABEL } from "@/lib/product";
import { getCampaignBySlug, getMyProfile } from "@/lib/server/platform";
import type { DeskRole } from "@/lib/roles";
import type { MarketplaceOffer } from "@/lib/types";

export const Route = createFileRoute("/offers/$slug")({ component: OfferPage });

function OfferPage() {
  const { slug } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [offer, setOffer] = useState<MarketplaceOffer | null | undefined>(undefined);
  const [desk, setDesk] = useState<DeskRole | null>(null);

  useEffect(() => {
    void getCampaignBySlug({ data: { slug } }).then(setOffer);
  }, [slug]);

  useEffect(() => {
    if (isPending || !user) {
      setDesk(null);
      return;
    }
    void getMyProfile().then((profile) => setDesk(profile?.deskRole ?? null));
  }, [user, isPending]);

  if (offer === undefined) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-4xl p-8">
          <div className="h-64 animate-pulse rounded-xl bg-secondary" />
        </div>
      </MarketingShell>
    );
  }
  if (!offer) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold">Offer not available</h1>
          <p className="mt-2 text-sm text-muted">
            This product is not an active marketplace offer. It may be pending review, rejected, suspended, or removed.
          </p>
          <Button asChild className="mt-6" variant="gold">
            <Link to="/marketplace">Back to marketplace</Link>
          </Button>
        </div>
      </MarketingShell>
    );
  }

  const payout = commissionPayout(offer);

  return (
    <MarketingShell>
      <article className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {offer.imageUrl ? (
            <img src={offer.imageUrl} alt="" className="mb-6 h-56 w-full rounded-xl object-cover" />
          ) : null}
          <Badge>{offer.category}</Badge>
          <h1 className="mt-3 font-display text-4xl font-semibold">{offer.title}</h1>
          <p className="mt-2 text-lg text-muted">{offer.tagline}</p>
          <p className="mt-6 leading-relaxed">{offer.description}</p>
          {offer.highlights.length > 0 ? (
            <ul className="mt-6 grid gap-2">
              {offer.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 text-forest" />
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8 rounded-xl border border-border bg-cream p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-forest">Affiliate terms</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              <li>Commission: {commissionLabel(offer)} on the listed price.</li>
              <li>Cookie window: {offer.cookieDays} days after a tracked click.</li>
              <li>Only approved, active vendor products stay listed. If Admin suspends this offer, it leaves the marketplace.</li>
            </ul>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="rounded-xl border border-border bg-cream p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Vendor</p>
            <p className="font-medium">{offer.storeName}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase text-muted">Price</dt>
                <dd className="tabular font-semibold">{formatMoney(offer.priceAmount, offer.currency)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted">You earn</dt>
                <dd className="tabular font-semibold text-forest">{formatMoney(payout, offer.currency)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted">Commission</dt>
                <dd>{commissionLabel(offer)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted">Type</dt>
                <dd>{PRODUCT_TYPE_LABEL[offer.productType]}</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-2">
              {isPending || (user && desk === null) ? (
                <div className="h-11 animate-pulse rounded-[10px] bg-secondary" />
              ) : desk === "affiliate" ? (
                <>
                  <Button asChild className="w-full" variant="gold">
                    <Link to="/dashboard/offers">Open affiliate marketplace</Link>
                  </Button>
                  <p className="text-xs leading-relaxed text-muted">
                    Tracking links and applications open in the next step. Review the offer here first.
                  </p>
                </>
              ) : desk === "vendor" ? (
                <p className="text-sm text-muted">Vendors list products from the Vendor desk. Affiliate tools are separate.</p>
              ) : desk === "admin" ? (
                <Button asChild className="w-full" variant="outline">
                  <Link to="/dashboard/admin">Review in Admin</Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="w-full" variant="gold">
                    <Link to="/login" search={{ join: "1", ref: undefined }}>
                      Join as affiliate to promote
                    </Link>
                  </Button>
                  <p className="text-xs leading-relaxed text-muted">
                    Sign in with an Affiliate desk to continue. Applications and tracking links are not live yet.
                  </p>
                </>
              )}
            </div>
          </div>
        </aside>
      </article>
    </MarketingShell>
  );
}
