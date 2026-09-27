import { PRODUCT_TYPES, type CommissionType, type ProductStatus } from "@/lib/product";
import type { MarketplaceOffer, MarketplaceQuery } from "@/lib/types";

export const MARKETPLACE_PAGE_SIZE = 20;

export const MARKETPLACE_SORTS = [
  { id: "newest", label: "Newest" },
  { id: "price_desc", label: "Price: high to low" },
  { id: "price_asc", label: "Price: low to high" },
  { id: "commission", label: "Highest commission" },
] as const;

export type MarketplaceSort = (typeof MARKETPLACE_SORTS)[number]["id"];

export function productIsMarketplaceLive(
  status: ProductStatus,
  isDemo: boolean,
  vendorStatus: string | null | undefined,
): boolean {
  return status === "approved" && !isDemo && vendorStatus === "approved";
}

export function commissionPayout(offer: Pick<MarketplaceOffer, "priceAmount" | "commissionType" | "commissionValue">) {
  if (offer.commissionType === "fixed") return offer.commissionValue;
  return Math.round((offer.priceAmount * offer.commissionValue) / 100);
}

export function commissionLabel(offer: Pick<MarketplaceOffer, "commissionType" | "commissionValue" | "currency">) {
  if (offer.commissionType === "fixed") return `${offer.commissionValue} ${offer.currency} fixed`;
  return `${offer.commissionValue}%`;
}

export function isProductTypeFilter(value: string | undefined): value is (typeof PRODUCT_TYPES)[number] {
  return Boolean(value && (PRODUCT_TYPES as readonly string[]).includes(value));
}

export function isCommissionTypeFilter(value: string | undefined): value is CommissionType {
  return value === "percent" || value === "fixed";
}

export function isMarketplaceSort(value: string | undefined): value is MarketplaceSort {
  return Boolean(value && MARKETPLACE_SORTS.some((s) => s.id === value));
}

export function normalizeMarketplaceQuery(input: MarketplaceQuery | undefined): Required<Pick<MarketplaceQuery, "page" | "pageSize" | "sort">> & MarketplaceQuery {
  const page = Math.max(1, Math.floor(input?.page ?? 1));
  const pageSize = Math.min(50, Math.max(1, Math.floor(input?.pageSize ?? MARKETPLACE_PAGE_SIZE)));
  const sort = isMarketplaceSort(input?.sort) ? input.sort : "newest";
  const q = input?.q?.trim() || undefined;
  const category = input?.category?.trim() && input.category !== "All" ? input.category : undefined;
  const productType = isProductTypeFilter(input?.productType) ? input.productType : undefined;
  const commissionType = isCommissionTypeFilter(input?.commissionType) ? input.commissionType : undefined;
  let minPrice = input?.minPrice;
  let maxPrice = input?.maxPrice;
  if (minPrice != null && minPrice < 0) minPrice = undefined;
  if (maxPrice != null && maxPrice < 0) maxPrice = undefined;
  if (minPrice != null && maxPrice != null && minPrice > maxPrice) maxPrice = undefined;
  return { q, category, productType, commissionType, minPrice, maxPrice, sort, page, pageSize };
}
