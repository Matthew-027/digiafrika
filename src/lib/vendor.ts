export const VENDOR_STATUSES = [
  "incomplete",
  "pending_review",
  "approved",
  "rejected",
  "suspended",
] as const;

export type VendorStatus = (typeof VENDOR_STATUSES)[number];

export type VendorReviewAction = "approve" | "reject" | "suspend";

export function isVendorStatus(value: string | null | undefined): value is VendorStatus {
  return Boolean(value && (VENDOR_STATUSES as readonly string[]).includes(value));
}

export function vendorCanEdit(status: VendorStatus): boolean {
  return status !== "suspended";
}

export function vendorCanSubmit(status: VendorStatus): boolean {
  return status === "incomplete" || status === "rejected";
}

export function vendorCanPublish(status: VendorStatus): boolean {
  return status === "approved";
}

export function applyVendorReview(status: VendorStatus, action: VendorReviewAction): VendorStatus {
  if (action === "approve") {
    if (status === "pending_review" || status === "suspended") return "approved";
    throw new Error("This application cannot be approved");
  }
  if (action === "reject") {
    if (status === "pending_review") return "rejected";
    throw new Error("Only pending applications can be rejected");
  }
  if (action === "suspend") {
    if (status === "approved") return "suspended";
    throw new Error("Only approved vendors can be suspended");
  }
  throw new Error("Unknown review action");
}

export const VENDOR_STATUS_COPY: Record<
  VendorStatus,
  { label: string; message: string }
> = {
  incomplete: {
    label: "Incomplete",
    message: "Complete your store profile and submit it for review.",
  },
  pending_review: {
    label: "Pending review",
    message: "Your Vendor application is currently under review.",
  },
  approved: {
    label: "Approved",
    message: "Your Vendor account has been approved.",
  },
  rejected: {
    label: "Rejected",
    message: "Your Vendor application was rejected. Review the reason and update your information.",
  },
  suspended: {
    label: "Suspended",
    message: "Your Vendor account is currently suspended.",
  },
};
