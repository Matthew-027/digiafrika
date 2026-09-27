import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, Radio, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { OfferCard } from "@/components/offers/offer-card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { getMarketplace, getPlatformStats } from "@/lib/server/platform";
import { CATEGORIES, type MarketplaceOffer, type PlatformStats } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [offers, setOffers] = useState<MarketplaceOffer[] | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    void getMarketplace({ data: { page: 1, pageSize: 6, sort: "newest" } }).then((page) => setOffers(page.items));
    void getPlatformStats().then(setStats);
  }, []);

  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-forest-deep text-cream">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-gold/30" />
        <div className="pointer-events-none absolute bottom-8 left-8 h-40 w-40 rounded-full border border-cream/10" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Africa’s affiliate desk
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Promote digital products. Get paid on local rails.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
              DigiAfrika connects verified vendors and affiliates. Browse approved offers, then join an Affiliate desk to promote.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/marketplace">
                  Browse marketplace <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-cream/30 text-cream hover:bg-cream/10">
                <Link to="/vendors">Sell a product</Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-xl border border-cream/15 bg-ink/40 p-5">
              <p className="text-xs uppercase tracking-wider text-gold">Live desk</p>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <Stat label="Approved offers" value={stats ? formatNumber(stats.liveOffers) : "—"} />
                <Stat label="Affiliates" value={stats ? formatNumber(stats.affiliates) : "—"} />
                <Stat label="Avg commission" value={stats ? `${stats.avgCommission}%` : "—"} />
                <Stat label="Catalog" value="Approved only" />
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-cream/60">
                Counts are live approved products from approved vendors. Demo catalog rows are excluded.
              </p>
            </div>
          </div>
        </div>
        <div className="kente-band h-2" />
      </section>

      <section className="border-b border-border bg-paper-2">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/marketplace"
              search={{ category: c }}
              className="h-11 shrink-0 rounded-full border border-border bg-cream px-4 text-sm leading-[2.75rem]"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-forest">Marketplace</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Approved offers</h2>
          </div>
          <Link to="/marketplace" className="text-sm font-medium text-forest hover:text-ink">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers === null
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-secondary" />
              ))
            : offers.length === 0
              ? (
                <p className="col-span-full rounded-xl border border-dashed border-border bg-card px-5 py-12 text-center text-sm text-muted">
                  No approved products yet. Vendors submit offers for Admin review before they appear here.
                </p>
              )
              : offers.map((offer) => <OfferCard key={offer.slug} offer={offer} />)}
        </div>
      </section>

      <section className="bg-paper-2">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          <Step
            icon={<Radio className="size-5" />}
            title="Browse approved offers"
            body="Search by name, category, type, and commission. Only live products from verified vendors are listed."
          />
          <Step
            icon={<Banknote className="size-5" />}
            title="Inspect the terms"
            body="See price, currency, and affiliate commission before you decide to promote. Applications come next."
          />
          <Step
            icon={<ShieldCheck className="size-5" />}
            title="Admin-reviewed catalog"
            body="Draft, pending, rejected, and suspended products never reach the marketplace."
          />
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Open a desk today.</h2>
            <p className="mt-2 max-w-lg text-sm text-cream/70">
              Affiliates browse the marketplace. Vendors submit products for review. Admin stays separate.
            </p>
          </div>
          <Button asChild variant="gold" size="lg">
            <Link to="/login" search={{ join: "1", ref: undefined }}>
              Join free
            </Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-cream/55">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular">{value}</dd>
    </div>
  );
}

function Step({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-cream p-5">
      <div className="grid h-11 w-11 place-items-center rounded-[10px] bg-forest text-cream">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
