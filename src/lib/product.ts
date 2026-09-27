export const PRODUCT_STATUSES = [
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "suspended",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_TYPES = [
  "digital",
  "physical",
  "service",
  "course",
  "software",
  "subscription",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export const CURRENCIES = [
  "NGN",
  "USD",
  "GHS",
  "KES",
  "ZAR",
  "EGP",
  "TZS",
  "UGX",
  "RWF",
  "XOF",
  "EUR",
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];

export const COMMISSION_TYPES = ["percent", "fixed"] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

export const COMMISSION_MODES = ["one_time", "recurring", "lifetime"] as const;
export type CommissionMode = (typeof COMMISSION_MODES)[number];

export type ProductReviewAction = "approve" | "reject" | "suspend";

export function isProductStatus(value: string | null | undefined): value is ProductStatus {
  return Boolean(value && (PRODUCT_STATUSES as readonly string[]).includes(value));
}

export function isCurrency(value: string | null | undefined): value is CurrencyCode {
  return Boolean(value && (CURRENCIES as readonly string[]).includes(value));
}

export function productCanEdit(status: ProductStatus): boolean {
  return status === "draft" || status === "rejected";
}

export function productCanSubmit(status: ProductStatus): boolean {
  return status === "draft" || status === "rejected";
}

export function productIsPublic(status: ProductStatus, isDemo = false): boolean {
  return status === "approved" && !isDemo;
}

export function applyProductReview(status: ProductStatus, action: ProductReviewAction): ProductStatus {
  if (action === "approve") {
    if (status === "pending_review" || status === "suspended") return "approved";
    throw new Error("This product cannot be approved");
  }
  if (action === "reject") {
    if (status === "pending_review") return "rejected";
    throw new Error("Only products under review can be rejected");
  }
  if (action === "suspend") {
    if (status === "approved") return "suspended";
    throw new Error("Only approved products can be suspended");
  }
  throw new Error("Unknown review action");
}

export function validateCommission(type: CommissionType, value: number): string | null {
  if (!Number.isFinite(value) || value < 0) return "Commission cannot be negative";
  if (type === "percent" && value > 100) return "Percentage commission cannot be above 100%";
  return null;
}

export function compatPriceNgn(amount: number, currency: string): number {
  return currency === "NGN" ? Math.round(amount) : 0;
}

export function compatCommissionPct(type: CommissionType, value: number): number {
  return type === "percent" ? Math.round(value) : 0;
}

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  digital: "Digital product",
  physical: "Physical product",
  service: "Service",
  course: "Course",
  software: "Software / tool",
  subscription: "Subscription",
};

export const PRODUCT_STATUS_COPY: Record<ProductStatus, { label: string; message: string }> = {
  draft: {
    label: "Draft",
    message: "Saved privately. Submit it for Admin review when you are ready.",
  },
  pending_review: {
    label: "Pending review",
    message: "This product is waiting for Admin review.",
  },
  approved: {
    label: "Approved",
    message: "Approved. This offer can appear in the marketplace.",
  },
  rejected: {
    label: "Rejected",
    message: "Rejected. Update the product and resubmit it.",
  },
  suspended: {
    label: "Suspended",
    message: "Suspended. This offer is not publicly available.",
  },
};
