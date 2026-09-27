import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MarketplaceBrowser, type MarketplaceSearch } from "@/components/offers/marketplace-browser";
import { MarketingShell } from "@/components/layout/marketing-shell";

type Search = MarketplaceSearch;

export const Route = createFileRoute("/marketplace")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    q: typeof raw.q === "string" ? raw.q : undefined,
    category: typeof raw.category === "string" ? raw.category : undefined,
    productType: typeof raw.productType === "string" ? raw.productType : undefined,
    commissionType: typeof raw.commissionType === "string" ? raw.commissionType : undefined,
    minPrice: typeof raw.minPrice === "string" || typeof raw.minPrice === "number" ? String(raw.minPrice) : undefined,
    maxPrice: typeof raw.maxPrice === "string" || typeof raw.maxPrice === "number" ? String(raw.maxPrice) : undefined,
    sort: typeof raw.sort === "string" ? raw.sort : undefined,
    page: typeof raw.page === "number" ? raw.page : typeof raw.page === "string" ? Number(raw.page) || undefined : undefined,
  }),
  component: Marketplace,
});

function Marketplace() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  return (
    <MarketingShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest">Marketplace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Approved offers from verified vendors</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Browse live products Affiliates can promote. Draft, pending, rejected, and suspended offers never appear here.
        </p>
        <div className="mt-6">
          <MarketplaceBrowser
            value={search}
            onChange={(next) => void navigate({ to: "/marketplace", search: next })}
            tone="public"
          />
        </div>
      </div>
    </MarketingShell>
  );
}
