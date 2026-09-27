import type { DeskRole, ProductRole } from "@/lib/roles";
import type {
  CommissionMode,
  CommissionType,
  CurrencyCode,
  ProductStatus,
  ProductType,
} from "@/lib/product";
import type { VendorStatus } from "@/lib/vendor";

export type Role = ProductRole | "admin";

export type CampaignStatus = ProductStatus;

export type CommissionStatus = "pending" | "approved" | "paid" | "clawback";

export type PayoutStatus = "requested" | "processing" | "paid" | "rejected";

export type Profile = {
  userId: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  country: string;
  phone: string | null;
  roles: Role[];
  deskRole: DeskRole;
  isAdmin: boolean;
  referralCode: string;
  referredBy: string | null;
  payoutMethod: string | null;
  payoutDetails: string | null;
  onboardedAt: string | null;
  createdAt: string;
};

export type VendorProfile = {
  userId: string;
  storeName: string;
  description: string;
  country: string;
  contactEmail: string | null;
  contactPhone: string | null;
  category: string;
  websiteUrl: string | null;
  status: VendorStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type VendorApplication = VendorProfile & {
  displayName: string;
  email: string | null;
};

export type Campaign = {
  id: string;
  vendorUserId: string;
  vendorName: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  productType: ProductType;
  description: string;
  highlights: string[];
  imageUrl: string | null;
  priceAmount: number;
  currency: CurrencyCode;
  priceNgn: number;
  commissionType: CommissionType;
  commissionValue: number;
  commissionMode: CommissionMode;
  commissionPct: number;
  cookieDays: number;
  landingUrl: string;
  jvPageUrl: string | null;
  creatives: string | null;
  status: CampaignStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  isDemo: boolean;
  clicks: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
};

export type Enrollment = {
  id: string;
  campaignId: string;
  affiliateUserId: string;
  trackingCode: string;
  createdAt: string;
  clicks: number;
  sales: number;
  earnedNgn: number;
  campaign?: Campaign;
};

export type DashEnrollment = Enrollment & {
  title: string;
  slug: string;
  commissionPct: number;
};

export type Wallet = {
  userId: string;
  availableNgn: number;
  pendingNgn: number;
  paidNgn: number;
  lifetimeNgn: number;
};

export type Commission = {
  id: string;
  conversionId: string;
  affiliateUserId: string;
  vendorUserId: string;
  campaignId: string;
  campaignTitle: string;
  amountNgn: number;
  status: CommissionStatus;
  createdAt: string;
};

export type Payout = {
  id: string;
  userId: string;
  amountNgn: number;
  method: string;
  details: string;
  status: PayoutStatus;
  adminNote: string | null;
  createdAt: string;
  processedAt: string | null;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  kind: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export type PlatformStats = {
  liveOffers: number;
  affiliates: number;
  gmvNgn: number;
  avgCommission: number;
};

export type Settings = {
  minPayoutNgn: number;
  cookieDays: number;
  referralPct: number;
  platformFeePct: number;
  pixelSecret: string;
};

export type SeriesPoint = {
  day: string;
  amount: number;
  clicks: number;
};

export type MarketplaceOffer = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  productType: ProductType;
  imageUrl: string | null;
  priceAmount: number;
  currency: CurrencyCode;
  commissionType: CommissionType;
  commissionValue: number;
  storeName: string;
  cookieDays: number;
  highlights: string[];
  listedAt: string;
};

export type MarketplaceQuery = {
  q?: string;
  category?: string;
  productType?: ProductType;
  commissionType?: CommissionType;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "commission";
  page?: number;
  pageSize?: number;
};

export type MarketplacePage = {
  items: MarketplaceOffer[];
  page: number;
  pageSize: number;
  total: number;
};

export const CATEGORIES = [
  "Education",
  "Business",
  "Finance",
  "Software",
  "Health",
  "Fashion",
  "Lifestyle",
  "Commerce",
  "Creative",
  "AI",
  "Career",
  "Services",
] as const;

export const COUNTRIES = [
  { code: "NG", label: "Nigeria" },
  { code: "KE", label: "Kenya" },
  { code: "GH", label: "Ghana" },
  { code: "ZA", label: "South Africa" },
  { code: "EG", label: "Egypt" },
  { code: "TZ", label: "Tanzania" },
  { code: "UG", label: "Uganda" },
  { code: "RW", label: "Rwanda" },
  { code: "CI", label: "Côte d'Ivoire" },
  { code: "SN", label: "Senegal" },
] as const;

export const PAYOUT_METHODS = [
  { id: "paystack", label: "Paystack" },
  { id: "flutterwave", label: "Flutterwave" },
  { id: "mpesa", label: "M-Pesa" },
  { id: "bank_ng", label: "Nigerian bank transfer" },
] as const;
