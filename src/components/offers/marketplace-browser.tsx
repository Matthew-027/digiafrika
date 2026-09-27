import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { OfferCard } from "@/components/offers/offer-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MARKETPLACE_SORTS, isProductTypeFilter, type MarketplaceSort } from "@/lib/marketplace";
import { COMMISSION_TYPES, PRODUCT_TYPE_LABEL, PRODUCT_TYPES } from "@/lib/product";
import { getMarketplace } from "@/lib/server/platform";
import { CATEGORIES, type MarketplaceOffer, type MarketplacePage, type MarketplaceQuery } from "@/lib/types";
import { cn } from "@/lib/utils";

export type MarketplaceSearch = {
  q?: string;
  category?: string;
  productType?: string;
  commissionType?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: number;
};

function toQuery(search: MarketplaceSearch): MarketplaceQuery {
  const min = search.minPrice ? Number(search.minPrice) : undefined;
  const max = search.maxPrice ? Number(search.maxPrice) : undefined;
  return {
    q: search.q,
    category: search.category,
    productType: isProductTypeFilter(search.productType) ? search.productType : undefined,
    commissionType: search.commissionType === "percent" || search.commissionType === "fixed" ? search.commissionType : undefined,
    minPrice: Number.isFinite(min) ? min : undefined,
    maxPrice: Number.isFinite(max) ? max : undefined,
    sort: (search.sort as MarketplaceSort | undefined) ?? "newest",
    page: search.page ?? 1,
  };
}

export function MarketplaceBrowser({
  value,
  onChange,
  tone = "public",
}: {
  value: MarketplaceSearch;
  onChange: (next: MarketplaceSearch) => void;
  tone?: "public" | "dash";
}) {
  const [pageData, setPageData] = useState<MarketplacePage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const query = toQuery(value);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void getMarketplace({ data: query })
      .then((next) => {
        if (cancelled) return;
        setPageData(next);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not load marketplace");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    query.q,
    query.category,
    query.productType,
    query.commissionType,
    query.minPrice,
    query.maxPrice,
    query.sort,
    query.page,
  ]);

  const items: MarketplaceOffer[] = pageData?.items ?? [];
  const total = pageData?.total ?? 0;
  const page = pageData?.page ?? query.page ?? 1;
  const pageSize = pageData?.pageSize ?? 20;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const filtered = Boolean(query.q || query.category || query.productType || query.commissionType || query.minPrice != null || query.maxPrice != null);
  const pillOn = tone === "dash" ? "h-11 shrink-0 rounded-full bg-gold px-4 text-sm text-ink" : "h-11 shrink-0 rounded-full bg-ink px-4 text-sm text-cream";
  const pillOff = "h-11 shrink-0 rounded-full border border-border px-4 text-sm";

  function patch(partial: Partial<MarketplaceSearch>) {
    onChange({ ...value, page: 1, ...partial });
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            patch({ q: String(fd.get("q") ?? "").trim() || undefined });
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              className="pl-9"
              placeholder="Search name, category, type, or description"
              defaultValue={value.q ?? ""}
              key={value.q ?? ""}
            />
          </div>
          <Button type="submit" variant={tone === "dash" ? "gold" : "default"}>
            Search
          </Button>
        </form>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => patch({ category: c === "All" ? undefined : c })}
              className={(!value.category && c === "All") || value.category === c ? pillOn : pillOff}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="mpType">Product type</Label>
            <Select
              id="mpType"
              value={value.productType ?? ""}
              onChange={(e) => patch({ productType: e.target.value || undefined })}
            >
              <option value="">All types</option>
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PRODUCT_TYPE_LABEL[t]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mpCommission">Commission</Label>
            <Select
              id="mpCommission"
              value={value.commissionType ?? ""}
              onChange={(e) => patch({ commissionType: e.target.value || undefined })}
            >
              <option value="">All commissions</option>
              {COMMISSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "percent" ? "Percentage" : "Fixed amount"}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mpMin">Min price</Label>
            <Input
              id="mpMin"
              type="number"
              min={0}
              placeholder="Any"
              value={value.minPrice ?? ""}
              onChange={(e) => patch({ minPrice: e.target.value || undefined })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mpMax">Max price</Label>
            <Input
              id="mpMax"
              type="number"
              min={0}
              placeholder="Any"
              value={value.maxPrice ?? ""}
              onChange={(e) => patch({ maxPrice: e.target.value || undefined })}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading offers…" : `${total} approved offer${total === 1 ? "" : "s"}`}
          </p>
          <Select
            aria-label="Sort offers"
            className="w-full sm:w-56"
            value={value.sort ?? "newest"}
            onChange={(e) => patch({ sort: e.target.value })}
          >
            {MARKETPLACE_SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error ? (
        <div className="mt-8">
          <EmptyState title="Could not load marketplace" body={error} />
        </div>
      ) : loading && !pageData ? (
        <div className={cn("mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3")}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={
              query.category && !query.q
                ? `No ${query.category} offers`
                : filtered
                  ? "No offers match"
                  : "No products yet"
            }
            body={
              query.category && !query.q && !query.productType
                ? "No approved products in this category yet. Try another category or clear the filter."
                : filtered
                  ? "Try another search, category, or filter. Only approved products from approved vendors appear here."
                  : "Approved vendor products will show here after Admin review. There are no demo listings."
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </div>
          {pages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => onChange({ ...value, page: page - 1 })}
              >
                Previous
              </Button>
              <p className="text-sm text-muted-foreground">
                Page {page} of {pages}
              </p>
              <Button
                variant="outline"
                disabled={page >= pages}
                onClick={() => onChange({ ...value, page: page + 1 })}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
