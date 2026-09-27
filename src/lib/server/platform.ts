import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { deskRoleOf, normalizeProductRole, type DeskRole } from "@/lib/roles";
import {
  applyVendorReview,
  vendorCanEdit,
  vendorCanPublish,
  vendorCanSubmit,
  type VendorStatus,
} from "@/lib/vendor";
import {
  applyProductReview,
  compatCommissionPct,
  compatPriceNgn,
  isCurrency,
  productCanEdit,
  productCanSubmit,
  productIsPublic,
  validateCommission,
  type CommissionMode,
  type CommissionType,
  type CurrencyCode,
  type ProductStatus,
  type ProductType,
} from "@/lib/product";
import { normalizeMarketplaceQuery, productIsMarketplaceLive } from "@/lib/marketplace";
import { isAllowedImageUrl, storeProductImage } from "@/lib/server/media";
import { newId, referralCode, trackingCode } from "@/lib/utils";
import type {
  Campaign,
  Commission,
  DashEnrollment,
  MarketplaceOffer,
  MarketplacePage,
  Notification,
  Payout,
  PlatformStats,
  Profile,
  SeriesPoint,
  Settings,
  VendorApplication,
  VendorProfile,
  Wallet,
} from "@/lib/types";

type Sql = Awaited<ReturnType<typeof getSql>>;

type CampaignRow = {
  id: string;
  vendor_user_id: string;
  vendor_name: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  product_type: ProductType;
  description: string;
  highlights: string;
  image_url: string | null;
  price_amount: number;
  currency: CurrencyCode;
  price_ngn: number;
  commission_type: CommissionType;
  commission_value: number;
  commission_mode: CommissionMode;
  commission_pct: number;
  cookie_days: number;
  landing_url: string;
  jv_page_url: string | null;
  creatives: string | null;
  status: ProductStatus;
  review_note: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  is_demo: boolean;
  clicks: number;
  sales: number;
  created_at: string;
  updated_at: string;
};

type ProfileRow = {
  user_id: string;
  display_name: string;
  email: string | null;
  avatar_url: string | null;
  country: string;
  phone: string | null;
  roles: string;
  is_admin: boolean;
  referral_code: string;
  referred_by: string | null;
  payout_method: string | null;
  payout_details: string | null;
  onboarded_at: string | null;
  created_at: string;
};

type EnrollmentLedger = {
  id: string;
  campaign_id: string;
  affiliate_user_id: string;
  price_ngn: number;
  commission_pct: number;
  vendor_user_id: string;
  title: string;
};

function mapCampaign(r: CampaignRow): Campaign {
  const currency = isCurrency(r.currency) ? r.currency : "NGN";
  const commissionType: CommissionType = r.commission_type === "fixed" ? "fixed" : "percent";
  const productType = (r.product_type || "digital") as ProductType;
  const priceAmount = Number(r.price_amount ?? r.price_ngn ?? 0);
  const commissionValue = Number(r.commission_value ?? r.commission_pct ?? 0);
  return {
    id: r.id,
    vendorUserId: r.vendor_user_id,
    vendorName: r.vendor_name,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    category: r.category,
    productType,
    description: r.description,
    highlights: (r.highlights || "").split("\n").filter(Boolean),
    imageUrl: r.image_url,
    priceAmount,
    currency,
    priceNgn: Number(r.price_ngn ?? 0),
    commissionType,
    commissionValue,
    commissionMode: (r.commission_mode || "one_time") as CommissionMode,
    commissionPct: Number(r.commission_pct ?? (commissionType === "percent" ? commissionValue : 0)),
    cookieDays: Number(r.cookie_days),
    landingUrl: r.landing_url,
    jvPageUrl: r.jv_page_url,
    creatives: r.creatives,
    status: r.status,
    reviewNote: r.review_note,
    submittedAt: r.submitted_at ? String(r.submitted_at) : null,
    reviewedAt: r.reviewed_at ? String(r.reviewed_at) : null,
    isDemo: Boolean(r.is_demo),
    clicks: Number(r.clicks),
    sales: Number(r.sales),
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at ?? r.created_at),
  };
}

type PublicOfferRow = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  product_type: ProductType;
  image_url: string | null;
  price_amount: number;
  currency: string;
  commission_type: string;
  commission_value: number;
  cookie_days: number;
  highlights: string | null;
  created_at: string;
  store_name: string;
  status: ProductStatus;
  is_demo: boolean;
  vendor_status: VendorStatus;
};

function mapPublicOffer(r: PublicOfferRow): MarketplaceOffer {
  const currency = isCurrency(r.currency) ? r.currency : "NGN";
  const commissionType: CommissionType = r.commission_type === "fixed" ? "fixed" : "percent";
  return {
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    description: r.description,
    category: r.category,
    productType: (r.product_type || "digital") as ProductType,
    imageUrl: r.image_url,
    priceAmount: Number(r.price_amount ?? 0),
    currency,
    commissionType,
    commissionValue: Number(r.commission_value ?? 0),
    storeName: r.store_name,
    cookieDays: Number(r.cookie_days ?? 30),
    highlights: (r.highlights || "").split("\n").filter(Boolean),
    listedAt: String(r.created_at),
  };
}

function mapProfile(r: ProfileRow): Profile {
  return {
    userId: r.user_id,
    displayName: r.display_name,
    email: r.email,
    avatarUrl: r.avatar_url,
    country: r.country,
    phone: r.phone,
    roles: [normalizeProductRole(r.roles)],
    deskRole: deskRoleOf(Boolean(r.is_admin), r.roles),
    isAdmin: Boolean(r.is_admin),
    referralCode: r.referral_code,
    referredBy: r.referred_by,
    payoutMethod: r.payout_method,
    payoutDetails: r.payout_details,
    onboardedAt: r.onboarded_at ? String(r.onboarded_at) : null,
    createdAt: String(r.created_at),
  };
}

async function loadAuthedProfile(sql: Sql, userId: string): Promise<ProfileRow | null> {
  const [row] = await sql<ProfileRow>`select * from profiles where user_id = ${userId} limit 1`;
  if (!row) return null;
  const { syncPlatformOwnerFlag } = await import("./platform-owner.server");
  return syncPlatformOwnerFlag(sql, row);
}

async function requireDesk(sql: Sql, userId: string, desk: DeskRole) {
  const row = await loadAuthedProfile(sql, userId);
  if (!row || deskRoleOf(Boolean(row.is_admin), row.roles) !== desk) {
    throw new Error("Access denied");
  }
  return row;
}

type VendorProfileRow = {
  user_id: string;
  store_name: string;
  description: string;
  country: string;
  contact_email: string | null;
  contact_phone: string | null;
  category: string;
  website_url: string | null;
  status: VendorStatus;
  review_note: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
};

function mapVendorProfile(r: VendorProfileRow): VendorProfile {
  return {
    userId: r.user_id,
    storeName: r.store_name,
    description: r.description,
    country: r.country,
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    category: r.category,
    websiteUrl: r.website_url,
    status: r.status,
    reviewNote: r.review_note,
    submittedAt: r.submitted_at ? String(r.submitted_at) : null,
    reviewedAt: r.reviewed_at ? String(r.reviewed_at) : null,
    createdAt: String(r.created_at),
  };
}

async function ensureVendorProfile(sql: Sql, userId: string, seed?: { country?: string; email?: string | null; phone?: string | null; name?: string }) {
  await sql`
    insert into vendor_profiles (user_id, store_name, country, contact_email, contact_phone, status)
    values (
      ${userId},
      ${seed?.name ?? ""},
      ${seed?.country ?? "NG"},
      ${seed?.email ?? null},
      ${seed?.phone ?? null},
      'incomplete'
    )
    on conflict (user_id) do nothing`;
}

async function loadVendorProfile(sql: Sql, userId: string): Promise<VendorProfileRow | null> {
  const [row] = await sql<VendorProfileRow>`
    select * from vendor_profiles where user_id = ${userId} limit 1`;
  return row ?? null;
}

async function requireApprovedVendor(sql: Sql, userId: string): Promise<VendorProfileRow> {
  await requireDesk(sql, userId, "vendor");
  const row = await loadVendorProfile(sql, userId);
  if (!row || !vendorCanPublish(row.status)) {
    throw new Error("Vendor account is not approved");
  }
  return row;
}

async function requireAdminProfile(sql: Sql, userId: string): Promise<ProfileRow> {
  const { assertPlatformAdmin } = await import("./platform-owner.server");
  return assertPlatformAdmin<ProfileRow>(sql, userId);
}

export const assertDeskAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ desk: z.enum(["admin", "vendor", "affiliate"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.desk === "admin") {
      await requireAdminProfile(sql, context.userId);
      return { ok: true as const };
    }
    await requireDesk(sql, context.userId, data.desk);
    return { ok: true as const };
  });


function mapSettings(row?: {
  min_payout_ngn?: number;
  cookie_days?: number;
  referral_pct?: number;
  platform_fee_pct?: number;
  pixel_secret?: string | null;
}): Settings {
  return {
    minPayoutNgn: Number(row?.min_payout_ngn ?? 5000),
    cookieDays: Number(row?.cookie_days ?? 30),
    referralPct: Number(row?.referral_pct ?? 5),
    platformFeePct: Number(row?.platform_fee_pct ?? 5),
    pixelSecret: row?.pixel_secret || "digiafrika_sandbox_pixel",
  };
}

async function notify(
  sql: Sql,
  userId: string,
  title: string,
  body: string,
  kind: string,
  href?: string | null,
) {
  await sql`insert into notifications (id, user_id, title, body, kind, href)
    values (${newId("nt")}, ${userId}, ${title}, ${body}, ${kind}, ${href ?? null})`;
}

async function ensureWallet(sql: Sql, userId: string) {
  await sql`insert into wallets (user_id) values (${userId})
    on conflict (user_id) do nothing`;
}

async function loadSettings(sql: Sql) {
  const [row] = await sql`
    select min_payout_ngn, cookie_days, referral_pct, platform_fee_pct, pixel_secret
    from platform_settings where id = 1`;
  return mapSettings(row);
}

async function creditConversion(sql: Sql, en: EnrollmentLedger, amount: number, orderRef: string) {
  const settings = await loadSettings(sql);
  const commission = Math.round((amount * Number(en.commission_pct)) / 100);
  const convId = newId("cv");
  await sql`insert into conversions (id, enrollment_id, order_ref, amount_ngn)
    values (${convId}, ${en.id}, ${orderRef}, ${amount})`;
  await sql`insert into commissions (id, conversion_id, affiliate_user_id, vendor_user_id, campaign_id, amount_ngn, status)
    values (${newId("cm")}, ${convId}, ${en.affiliate_user_id}, ${en.vendor_user_id}, ${en.campaign_id}, ${commission}, 'approved')`;
  await sql`update enrollments set sales = sales + 1, earned_ngn = earned_ngn + ${commission} where id = ${en.id}`;
  await sql`update campaigns set sales = sales + 1 where id = ${en.campaign_id}`;
  await ensureWallet(sql, en.affiliate_user_id);
  await sql`update wallets set
    available_ngn = available_ngn + ${commission},
    lifetime_ngn = lifetime_ngn + ${commission}
    where user_id = ${en.affiliate_user_id}`;
  const vendorShare = Math.max(
    0,
    amount - commission - Math.round((amount * settings.platformFeePct) / 100),
  );
  if (!en.vendor_user_id.startsWith("platform-")) {
    await ensureWallet(sql, en.vendor_user_id);
    await sql`update wallets set
      available_ngn = available_ngn + ${vendorShare},
      lifetime_ngn = lifetime_ngn + ${vendorShare}
      where user_id = ${en.vendor_user_id}`;
  }
  const [aff] = await sql<{ referred_by: string | null }>`
    select referred_by from profiles where user_id = ${en.affiliate_user_id}`;
  if (aff?.referred_by) {
    const bonus = Math.round((commission * settings.referralPct) / 100);
    if (bonus > 0) {
      await ensureWallet(sql, aff.referred_by);
      await sql`update wallets set
        available_ngn = available_ngn + ${bonus},
        lifetime_ngn = lifetime_ngn + ${bonus}
        where user_id = ${aff.referred_by}`;
      await notify(
        sql,
        aff.referred_by,
        "Referral override",
        `You earned ₦${bonus.toLocaleString()} from a referred affiliate sale.`,
        "referral",
        "/dashboard/referrals",
      );
    }
  }
  await notify(
    sql,
    en.affiliate_user_id,
    "Commission approved",
    `₦${commission.toLocaleString()} from ${en.title} is now available.`,
    "conversion",
    "/dashboard/commissions",
  );
  return { amount, commission };
}

export async function ingestConversionCore(data: {
  code: string;
  orderRef?: string;
  amountNgn?: number;
  secret: string;
}) {
  const sql = await getSql();
  const settings = await loadSettings(sql);
  if (data.secret !== settings.pixelSecret) throw new Error("Invalid pixel secret");
  const [en] = await sql<EnrollmentLedger>`
    select e.id, e.campaign_id, e.affiliate_user_id, c.price_ngn, c.commission_pct,
           c.vendor_user_id, c.title
    from enrollments e join campaigns c on c.id = e.campaign_id
    where e.tracking_code = ${data.code}`;
  if (!en) throw new Error("Unknown tracking code");
  const amount = data.amountNgn ?? Number(en.price_ngn);
  return creditConversion(sql, en, amount, data.orderRef || `PX-${Date.now()}`);
}

export const getMarketplace = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        q: z.string().max(80).optional(),
        category: z.string().max(32).optional(),
        productType: z.enum(["digital", "physical", "service", "course", "software", "subscription"]).optional(),
        commissionType: z.enum(["percent", "fixed"]).optional(),
        minPrice: z.number().int().nonnegative().optional(),
        maxPrice: z.number().int().nonnegative().optional(),
        sort: z.enum(["newest", "price_asc", "price_desc", "commission"]).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(50).optional(),
      })
      .optional(),
  )
  .handler(async ({ data }): Promise<MarketplacePage> => {
    const sql = await getSql();
    const query = normalizeMarketplaceQuery(data);
    const q = query.q ? `%${query.q.toLowerCase()}%` : null;
    const category = query.category ?? null;
    const productType = query.productType ?? null;
    const commissionType = query.commissionType ?? null;
    const minPrice = query.minPrice ?? null;
    const maxPrice = query.maxPrice ?? null;
    const offset = (query.page - 1) * query.pageSize;
    const [countRow] = await sql<{ n: number }>`
      select count(*)::int as n
      from campaigns c
      join vendor_profiles vp on vp.user_id = c.vendor_user_id
      where c.status = 'approved'
        and coalesce(c.is_demo, false) = false
        and vp.status = 'approved'
        and (${category}::text is null or c.category = ${category})
        and (${productType}::text is null or c.product_type = ${productType})
        and (${commissionType}::text is null or c.commission_type = ${commissionType})
        and (${minPrice}::int is null or c.price_amount >= ${minPrice})
        and (${maxPrice}::int is null or c.price_amount <= ${maxPrice})
        and (
          ${q}::text is null
          or lower(c.title) like ${q}
          or lower(c.tagline) like ${q}
          or lower(c.description) like ${q}
          or lower(c.category) like ${q}
          or lower(c.product_type) like ${q}
          or lower(coalesce(nullif(vp.store_name, ''), c.vendor_name)) like ${q}
        )`;
    const order = query.sort;
    const rows = await sql<PublicOfferRow>`
      select
        c.slug, c.title, c.tagline, c.description, c.category, c.product_type,
        c.image_url, c.price_amount, c.currency, c.commission_type, c.commission_value,
        c.cookie_days, c.highlights, c.created_at, c.status, coalesce(c.is_demo, false) as is_demo,
        coalesce(nullif(vp.store_name, ''), c.vendor_name) as store_name,
        vp.status as vendor_status
      from campaigns c
      join vendor_profiles vp on vp.user_id = c.vendor_user_id
      where c.status = 'approved'
        and coalesce(c.is_demo, false) = false
        and vp.status = 'approved'
        and (${category}::text is null or c.category = ${category})
        and (${productType}::text is null or c.product_type = ${productType})
        and (${commissionType}::text is null or c.commission_type = ${commissionType})
        and (${minPrice}::int is null or c.price_amount >= ${minPrice})
        and (${maxPrice}::int is null or c.price_amount <= ${maxPrice})
        and (
          ${q}::text is null
          or lower(c.title) like ${q}
          or lower(c.tagline) like ${q}
          or lower(c.description) like ${q}
          or lower(c.category) like ${q}
          or lower(c.product_type) like ${q}
          or lower(coalesce(nullif(vp.store_name, ''), c.vendor_name)) like ${q}
        )
      order by
        case when ${order} = 'price_asc' then c.price_amount end asc,
        case when ${order} = 'price_desc' then c.price_amount end desc,
        case when ${order} = 'commission' then
          case when c.commission_type = 'fixed' then c.commission_value
               else (c.price_amount * c.commission_value) / 100 end
        end desc,
        c.created_at desc
      limit ${query.pageSize} offset ${offset}`;
    return {
      items: rows.map(mapPublicOffer),
      page: query.page,
      pageSize: query.pageSize,
      total: Number(countRow?.n ?? 0),
    };
  });

export const getPlatformStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlatformStats> => {
    const sql = await getSql();
    const [row] = await sql<{
      live: number;
      affiliates: number;
      gmv: number;
      avg_comm: number;
    }>`
      select
        (select count(*)::int
           from campaigns c
           join vendor_profiles vp on vp.user_id = c.vendor_user_id
          where c.status = 'approved' and coalesce(c.is_demo, false) = false and vp.status = 'approved') as live,
        (select count(*)::int from profiles where roles = 'affiliate') as affiliates,
        0 as gmv,
        coalesce((
          select avg(c.commission_value)::int
            from campaigns c
            join vendor_profiles vp on vp.user_id = c.vendor_user_id
           where c.status = 'approved' and coalesce(c.is_demo, false) = false
             and vp.status = 'approved' and c.commission_type = 'percent'
        ), 0) as avg_comm
    `;
    return {
      liveOffers: Number(row?.live ?? 0),
      affiliates: Number(row?.affiliates ?? 0),
      gmvNgn: 0,
      avgCommission: Number(row?.avg_comm ?? 0),
    };
  },
);

export const getCampaignBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(80) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const [row] = await sql<PublicOfferRow>`
      select
        c.slug, c.title, c.tagline, c.description, c.category, c.product_type,
        c.image_url, c.price_amount, c.currency, c.commission_type, c.commission_value,
        c.cookie_days, c.highlights, c.created_at, c.status, coalesce(c.is_demo, false) as is_demo,
        coalesce(nullif(vp.store_name, ''), c.vendor_name) as store_name,
        vp.status as vendor_status
      from campaigns c
      join vendor_profiles vp on vp.user_id = c.vendor_user_id
      where c.slug = ${data.slug}
        and c.status = 'approved'
        and coalesce(c.is_demo, false) = false
        and vp.status = 'approved'
      limit 1`;
    if (!row) return null;
    return mapPublicOffer(row);
  });

export const recordClick = createServerFn({ method: "POST" })
  .validator(z.object({ code: z.string() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const [en] = await sql<{
      id: string;
      campaign_id: string;
      landing_url: string;
      title: string;
      vendor_name: string;
      cookie_days: number;
    }>`
      select e.id, e.campaign_id, c.landing_url, c.title, c.vendor_name, c.cookie_days
      from enrollments e
      join campaigns c on c.id = e.campaign_id
      where e.tracking_code = ${data.code}
      limit 1`;
    if (!en) return { ok: false as const, url: "/marketplace" };
    const [offer] = await sql<{ status: string; is_demo: boolean }>`
      select status, coalesce(is_demo, false) as is_demo from campaigns where id = ${en.campaign_id}`;
    if (!offer || !productIsPublic(offer.status as ProductStatus, Boolean(offer.is_demo))) {
      return { ok: false as const, url: "/marketplace" };
    }
    await sql`insert into clicks (enrollment_id) values (${en.id})`;
    await sql`update enrollments set clicks = clicks + 1 where id = ${en.id}`;
    await sql`update campaigns set clicks = clicks + 1 where id = ${en.campaign_id}`;
    const sep = en.landing_url.includes("?") ? "&" : "?";
    return {
      ok: true as const,
      url: `${en.landing_url}${sep}via=digiafrika&aff=${data.code}`,
      title: en.title,
      vendor: en.vendor_name,
      code: data.code,
      cookieDays: Number(en.cookie_days),
    };
  });

export const ingestConversion = createServerFn({ method: "POST" })
  .validator(
    z.object({
      code: z.string().min(4),
      orderRef: z.string().max(80).optional(),
      amountNgn: z.number().int().positive().optional(),
      secret: z.string().min(4),
    }),
  )
  .handler(async ({ data }) => ingestConversionCore(data));

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const row = await loadAuthedProfile(sql, context.userId);
    if (!row) return null;
    await ensureWallet(sql, context.userId);
    return mapProfile(row);
  });

const onboardingSchema = z.object({
  displayName: z.string().min(2).max(80),
  country: z.string().min(2).max(4),
  role: z.enum(["affiliate", "vendor"]),
  phone: z.string().max(24).optional(),
  referralCode: z.string().max(16).optional(),
  email: z.string().email().optional().nullable(),
});

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(onboardingSchema)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await loadAuthedProfile(sql, context.userId);
    if (existing?.onboarded_at) return mapProfile(existing);

    const roles = normalizeProductRole(data.role);
    let referredBy: string | null = null;
    const ref = data.referralCode?.trim().toUpperCase();
    if (ref) {
      const [refRow] = await sql<{ user_id: string }>`
        select user_id from profiles where referral_code = ${ref} limit 1`;
      if (refRow && refRow.user_id !== context.userId) referredBy = refRow.user_id;
    }

    const code = referralCode();
    await sql`
      insert into profiles (
        user_id, display_name, email, country, phone, roles, is_admin, referral_code, referred_by, onboarded_at
      ) values (
        ${context.userId}, ${data.displayName.trim()}, ${data.email ?? null}, ${data.country},
        ${data.phone ?? null}, ${roles}, false, ${code}, ${referredBy}, now()
      )
      on conflict (user_id) do update set
        display_name = excluded.display_name,
        email = coalesce(excluded.email, profiles.email),
        country = excluded.country,
        phone = excluded.phone,
        roles = excluded.roles,
        onboarded_at = now(),
        referred_by = coalesce(profiles.referred_by, excluded.referred_by)`;
    await ensureWallet(sql, context.userId);
    const row = await loadAuthedProfile(sql, context.userId);
    if (row && (normalizeProductRole(row.roles) === "vendor" || data.role === "vendor") && !row.is_admin) {
      await ensureVendorProfile(sql, context.userId, {
        country: data.country,
        email: data.email ?? row.email,
        phone: data.phone ?? row.phone,
        name: data.displayName.trim(),
      });
    }
    await notify(
      sql,
      context.userId,
      "Welcome to DigiAfrika",
      row?.is_admin
        ? "Your operator desk is live. Admin is separate from vendor and affiliate desks."
        : data.role === "vendor"
          ? "Your vendor desk is live. Submit your store profile for review before listing offers."
          : "Your affiliate desk is live. Promote an offer to get a tracking link.",
      "system",
      "/dashboard",
    );
    if (referredBy) {
      await notify(
        sql,
        referredBy,
        "New referral joined",
        `${data.displayName.trim()} signed up with your code.`,
        "referral",
        "/dashboard/referrals",
      );
    }
    return mapProfile(row!);
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profileRow = await loadAuthedProfile(sql, context.userId);
    if (!profileRow) return { profile: null as Profile | null };
    await ensureWallet(sql, context.userId);
    const [wallet] = await sql<Wallet & { user_id: string }>`
      select user_id as "userId", available_ngn as "availableNgn", pending_ngn as "pendingNgn",
             paid_ngn as "paidNgn", lifetime_ngn as "lifetimeNgn"
      from wallets where user_id = ${context.userId}`;
    const profile = mapProfile(profileRow);
    const desk = profile.deskRole;
    const enrollments =
      desk === "affiliate"
        ? await sql<DashEnrollment>`
      select e.id, e.campaign_id as "campaignId", e.affiliate_user_id as "affiliateUserId",
             e.tracking_code as "trackingCode", e.created_at::text as "createdAt",
             e.clicks, e.sales, e.earned_ngn as "earnedNgn",
             c.title, c.slug, c.commission_pct as "commissionPct"
      from enrollments e join campaigns c on c.id = e.campaign_id
      where e.affiliate_user_id = ${context.userId}
      order by e.created_at desc`
        : [];
    const commissions =
      desk === "affiliate"
        ? await sql<Commission>`
      select cm.id, cm.conversion_id as "conversionId", cm.affiliate_user_id as "affiliateUserId",
             cm.vendor_user_id as "vendorUserId", cm.campaign_id as "campaignId",
             c.title as "campaignTitle", cm.amount_ngn as "amountNgn", cm.status,
             cm.created_at::text as "createdAt"
      from commissions cm join campaigns c on c.id = cm.campaign_id
      where cm.affiliate_user_id = ${context.userId}
      order by cm.created_at desc limit 20`
        : [];
    const notifications = await sql<Notification>`
      select id, user_id as "userId", title, body, kind, href,
             read_at::text as "readAt", created_at::text as "createdAt"
      from notifications where user_id = ${context.userId}
      order by created_at desc limit 12`;
    const series =
      desk === "affiliate"
        ? await sql<SeriesPoint>`
      select to_char(d::date, 'MM-DD') as day,
        coalesce((select sum(amount_ngn) from commissions
                  where affiliate_user_id = ${context.userId}
                    and created_at::date = d::date), 0)::int as amount,
        coalesce((select count(*) from clicks cl
                  join enrollments e on e.id = cl.enrollment_id
                  where e.affiliate_user_id = ${context.userId}
                    and cl.created_at::date = d::date), 0)::int as clicks
      from generate_series(current_date - 13, current_date, interval '1 day') as d`
        : [];
    const vendorCampaigns =
      desk === "vendor"
        ? await sql<CampaignRow>`select * from campaigns where vendor_user_id = ${context.userId} order by created_at desc`
        : [];
    let vendorProfile: VendorProfile | null = null;
    if (desk === "vendor") {
      await ensureVendorProfile(sql, context.userId, {
        country: profileRow.country,
        email: profileRow.email,
        phone: profileRow.phone,
        name: profileRow.display_name,
      });
      const vendorRow = await loadVendorProfile(sql, context.userId);
      vendorProfile = vendorRow ? mapVendorProfile(vendorRow) : null;
    }
    const [unread] = await sql<{ n: number }>`
      select count(*)::int as n from notifications where user_id = ${context.userId} and read_at is null`;
    const [refs] = await sql<{ n: number }>`
      select count(*)::int as n from profiles where referred_by = ${context.userId}`;
    const settings = await loadSettings(sql);
    return {
      profile,
      wallet: wallet ?? {
        userId: context.userId,
        availableNgn: 0,
        pendingNgn: 0,
        paidNgn: 0,
        lifetimeNgn: 0,
      },
      enrollments: desk === "affiliate" ? enrollments : [],
      commissions: desk === "affiliate" ? commissions : [],
      notifications,
      series: desk === "affiliate" ? series : [],
      vendorCampaigns: desk === "vendor" ? vendorCampaigns.map(mapCampaign) : [],
      vendorProfile,
      unread: Number(unread?.n ?? 0),
      referralCount: Number(refs?.n ?? 0),
      settings: {
        ...settings,
        pixelSecret: desk === "vendor" && vendorProfile?.status === "approved" ? settings.pixelSecret : "",
      },
    };
  });

export const enrollInCampaign = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ campaignId: z.string() }))
  .handler(async () => {
    throw new Error("Affiliate applications and tracking links open in a later step");
  });

export const simulateSale = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ trackingCode: z.string(), amountNgn: z.number().int().positive().optional() }))
  .handler(async () => {
    throw new Error("Simulated sales are not part of production");
  });

const productInput = z.object({
  title: z.string().min(2).max(80),
  tagline: z.string().min(8).max(160),
  category: z.string().min(2).max(32),
  productType: z.enum(["digital", "physical", "service", "course", "software", "subscription"]),
  description: z.string().min(20).max(8000),
  priceAmount: z.number().positive(),
  currency: z.enum(["NGN", "USD", "GHS", "KES", "ZAR", "EGP", "TZS", "UGX", "RWF", "XOF", "EUR"]),
  commissionType: z.enum(["percent", "fixed"]),
  commissionValue: z.number().min(0),
  commissionMode: z.enum(["one_time", "recurring", "lifetime"]).optional(),
  imageUrl: z.string().max(500).optional().or(z.literal("")),
  landingUrl: z.string().max(500).optional().or(z.literal("")),
});

type ProductInput = z.infer<typeof productInput>;

function assertProductRules(data: ProductInput) {
  if (!(data.priceAmount > 0)) throw new Error("Price must be greater than zero");
  const commissionError = validateCommission(data.commissionType, data.commissionValue);
  if (commissionError) throw new Error(commissionError);
  const image = data.imageUrl?.trim() || "";
  if (image && !isAllowedImageUrl(image)) throw new Error("Image URL is not valid");
  const landing = data.landingUrl?.trim() || "";
  if (landing) {
    try {
      const url = new URL(landing);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("invalid");
    } catch {
      throw new Error("Product URL must be a valid http(s) link");
    }
  }
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

async function loadOwnedProduct(sql: Sql, userId: string, productId: string) {
  const [row] = await sql<CampaignRow>`
    select * from campaigns where id = ${productId} and vendor_user_id = ${userId} limit 1`;
  if (!row) throw new Error("Product not found");
  return row;
}

async function writeOwnedProduct(sql: Sql, userId: string, data: ProductInput & { id: string }) {
  await requireApprovedVendor(sql, userId);
  assertProductRules(data);
  const current = await loadOwnedProduct(sql, userId, data.id);
  if (current.is_demo) throw new Error("Demo products cannot be edited");
  if (!productCanEdit(current.status)) throw new Error("This product cannot be edited");
  const priceNgn = compatPriceNgn(data.priceAmount, data.currency);
  const commissionPct = compatCommissionPct(data.commissionType, data.commissionValue);
  const mode = data.commissionMode ?? current.commission_mode ?? "one_time";
  await sql`
    update campaigns set
      title = ${data.title.trim()},
      tagline = ${data.tagline.trim()},
      category = ${data.category},
      product_type = ${data.productType},
      description = ${data.description.trim()},
      image_url = ${data.imageUrl?.trim() || null},
      price_amount = ${Math.round(data.priceAmount)},
      currency = ${data.currency},
      price_ngn = ${priceNgn},
      commission_type = ${data.commissionType},
      commission_value = ${Math.round(data.commissionValue)},
      commission_mode = ${mode},
      commission_pct = ${commissionPct},
      landing_url = ${data.landingUrl?.trim() || ""},
      updated_at = now()
    where id = ${data.id} and vendor_user_id = ${userId}`;
  return loadOwnedProduct(sql, userId, data.id);
}

export const createProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(productInput)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await requireApprovedVendor(sql, context.userId);
    assertProductRules(data);
    const profile = await loadAuthedProfile(sql, context.userId);
    let slug = toSlug(data.title) || newId("p");
    const [clash] = await sql<{ id: string }>`select id from campaigns where slug = ${slug}`;
    if (clash) slug = `${slug}-${newId("s").slice(-4)}`;
    const id = newId("prd");
    const vendorName = me.store_name || profile?.display_name || "Vendor";
    const priceNgn = compatPriceNgn(data.priceAmount, data.currency);
    const commissionPct = compatCommissionPct(data.commissionType, data.commissionValue);
    const mode = data.commissionMode ?? "one_time";
    await sql`
      insert into campaigns (
        id, vendor_user_id, vendor_name, slug, title, tagline, category, product_type, description, highlights,
        image_url, price_amount, currency, price_ngn, commission_type, commission_value, commission_mode, commission_pct,
        cookie_days, landing_url, status, is_demo, updated_at
      ) values (
        ${id}, ${context.userId}, ${vendorName}, ${slug}, ${data.title.trim()}, ${data.tagline.trim()},
        ${data.category}, ${data.productType}, ${data.description.trim()}, ${""},
        ${data.imageUrl?.trim() || null}, ${Math.round(data.priceAmount)}, ${data.currency}, ${priceNgn},
        ${data.commissionType}, ${Math.round(data.commissionValue)}, ${mode}, ${commissionPct},
        30, ${data.landingUrl?.trim() || ""}, 'draft', false, now()
      )`;
    await notify(
      sql,
      context.userId,
      "Product draft saved",
      `${data.title.trim()} is saved as a draft. Submit it for review when ready.`,
      "campaign",
      "/dashboard/campaigns",
    );
    return mapCampaign(await loadOwnedProduct(sql, context.userId, id));
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(productInput.extend({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const row = await writeOwnedProduct(sql, context.userId, data);
    return mapCampaign(row);
  });

export const submitProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(productInput.extend({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const current = await writeOwnedProduct(sql, context.userId, data);
    if (!productCanSubmit(current.status)) throw new Error("This product is already under review or approved");
    await sql`
      update campaigns set
        status = 'pending_review',
        submitted_at = now(),
        updated_at = now()
      where id = ${data.id} and vendor_user_id = ${context.userId}`;
    await notify(
      sql,
      context.userId,
      "Product submitted",
      `${current.title} is waiting for Admin review.`,
      "campaign",
      "/dashboard/campaigns",
    );
    const admins = await sql<{ user_id: string }>`select user_id from profiles where is_admin = true`;
    for (const admin of admins) {
      await notify(
        sql,
        admin.user_id,
        "Product pending review",
        `${current.title} was submitted for review.`,
        "campaign",
        "/dashboard/admin",
      );
    }
    return mapCampaign(await loadOwnedProduct(sql, context.userId, data.id));
  });

export const reviewProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().min(1),
      action: z.enum(["approve", "reject", "suspend"]),
      reason: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdminProfile(sql, context.userId);
    const [current] = await sql<CampaignRow>`select * from campaigns where id = ${data.id} limit 1`;
    if (!current) throw new Error("Product not found");
    const next = applyProductReview(current.status, data.action);
    const note = data.reason?.trim() || null;
    await sql`
      update campaigns set
        status = ${next},
        review_note = ${note},
        reviewed_at = now(),
        reviewed_by = ${context.userId},
        updated_at = now()
      where id = ${data.id}`;
    const copy =
      next === "approved"
        ? { title: "Product approved", body: `${current.title} is approved.` }
        : next === "rejected"
          ? {
              title: "Product rejected",
              body: note ? `${current.title} was rejected. ${note}` : `${current.title} was rejected.`,
            }
          : {
              title: "Product suspended",
              body: note
                ? `${current.title} is suspended. ${note}`
                : `${current.title} is no longer publicly available.`,
            };
    await notify(sql, current.vendor_user_id, copy.title, copy.body, "campaign", "/dashboard/campaigns");
    const [row] = await sql<CampaignRow>`select * from campaigns where id = ${data.id}`;
    return mapCampaign(row!);
  });

export const uploadProductImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ dataUrl: z.string().min(32).max(800_000) }))
  .handler(async ({ context, data }) => {
    await requireApprovedVendor(await getSql(), context.userId);
    const url = await storeProductImage(data.dataUrl, context.userId);
    return { url };
  });

export const createCampaign = createProduct;

export const updateCampaignStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), status: z.enum(["live", "paused", "rejected", "pending"]) }))
  .handler(async () => {
    throw new Error("Product status is set by Admin review");
  });

export const requestPayout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      amountNgn: z.number().int().positive(),
      method: z.enum(["paystack", "flutterwave", "mpesa", "bank_ng"]),
      details: z.string().min(4).max(240),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireDesk(sql, context.userId, "affiliate");
    await ensureWallet(sql, context.userId);
    const settings = await loadSettings(sql);
    if (data.amountNgn < settings.minPayoutNgn) {
      throw new Error(`Minimum payout is ₦${settings.minPayoutNgn.toLocaleString()}`);
    }
    const [wallet] = await sql<{ available_ngn: number }>`select available_ngn from wallets where user_id = ${context.userId}`;
    if (Number(wallet?.available_ngn ?? 0) < data.amountNgn) throw new Error("Insufficient available balance");
    await sql`update wallets set available_ngn = available_ngn - ${data.amountNgn} where user_id = ${context.userId}`;
    const id = newId("po");
    await sql`
      insert into payouts (id, user_id, amount_ngn, method, details, status)
      values (${id}, ${context.userId}, ${data.amountNgn}, ${data.method}, ${data.details}, 'processing')`;
    await sql`update profiles set payout_method = ${data.method}, payout_details = ${data.details} where user_id = ${context.userId}`;
    await notify(
      sql,
      context.userId,
      "Payout submitted",
      `₦${data.amountNgn.toLocaleString()} via ${data.method} is in the sandbox settlement queue.`,
      "payout",
      "/dashboard/payouts",
    );
    return { id };
  });

export const getPayouts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireDesk(sql, context.userId, "affiliate");
    return sql<Payout>`
      select id, user_id as "userId", amount_ngn as "amountNgn", method, details, status,
             admin_note as "adminNote", created_at::text as "createdAt", processed_at::text as "processedAt"
      from payouts where user_id = ${context.userId} order by created_at desc`;
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update notifications set read_at = now() where user_id = ${context.userId} and read_at is null`;
    return { ok: true };
  });

export const getReferrals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireDesk(sql, context.userId, "affiliate");
    const people = await sql<{ displayName: string; country: string; createdAt: string }>`
      select display_name as "displayName", country, created_at::text as "createdAt"
      from profiles where referred_by = ${context.userId} order by created_at desc`;
    const me = await loadAuthedProfile(sql, context.userId);
    const settings = await loadSettings(sql);
    return {
      code: me?.referral_code ?? "",
      percent: settings.referralPct,
      people,
    };
  });

export const enableVendorRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    throw new Error("Access denied");
  });

const vendorProfileInput = z.object({
  storeName: z.string().min(2).max(80),
  description: z.string().min(20).max(2000),
  country: z.string().min(2).max(4),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(24).optional(),
  category: z.string().min(2).max(32),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

type VendorProfileInput = z.infer<typeof vendorProfileInput>;

async function writeOwnVendorProfile(sql: Sql, userId: string, data: VendorProfileInput) {
  const me = await requireDesk(sql, userId, "vendor");
  await ensureVendorProfile(sql, userId, {
    country: me.country,
    email: me.email,
    phone: me.phone,
    name: me.display_name,
  });
  const current = await loadVendorProfile(sql, userId);
  if (!current) throw new Error("Vendor profile not found");
  if (!vendorCanEdit(current.status)) throw new Error("Suspended vendors cannot edit this profile");
  await sql`
    update vendor_profiles set
      store_name = ${data.storeName.trim()},
      description = ${data.description.trim()},
      country = ${data.country},
      contact_email = ${data.contactEmail?.trim() || me.email},
      contact_phone = ${data.contactPhone?.trim() || me.phone},
      category = ${data.category},
      website_url = ${data.websiteUrl?.trim() || null},
      updated_at = now()
    where user_id = ${userId}`;
  const row = await loadVendorProfile(sql, userId);
  if (!row) throw new Error("Vendor profile not found");
  return row;
}

export const saveVendorProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(vendorProfileInput)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const row = await writeOwnVendorProfile(sql, context.userId, data);
    return mapVendorProfile(row);
  });

export const submitVendorApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(vendorProfileInput)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await writeOwnVendorProfile(sql, context.userId, data);
    const current = await loadVendorProfile(sql, context.userId);
    if (!current) throw new Error("Vendor profile not found");
    if (!vendorCanSubmit(current.status)) {
      throw new Error("This application is already under review or approved");
    }
    await sql`
      update vendor_profiles set
        status = 'pending_review',
        submitted_at = now(),
        updated_at = now()
      where user_id = ${context.userId}`;
    await notify(
      sql,
      context.userId,
      "Application submitted",
      "Your Vendor application is currently under review.",
      "vendor",
      "/dashboard/vendor",
    );
    const admins = await sql<{ user_id: string }>`select user_id from profiles where is_admin = true`;
    for (const admin of admins) {
      await notify(
        sql,
        admin.user_id,
        "Vendor application pending",
        `${data.storeName.trim()} submitted a store profile for review.`,
        "vendor",
        "/dashboard/admin",
      );
    }
    const row = await loadVendorProfile(sql, context.userId);
    return mapVendorProfile(row!);
  });

export const reviewVendorApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string().min(1),
      action: z.enum(["approve", "reject", "suspend"]),
      reason: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdminProfile(sql, context.userId);
    const current = await loadVendorProfile(sql, data.userId);
    if (!current) throw new Error("Vendor application not found");
    const next = applyVendorReview(current.status, data.action);
    const note = data.reason?.trim() || null;
    await sql`
      update vendor_profiles set
        status = ${next},
        review_note = ${note},
        reviewed_at = now(),
        reviewed_by = ${context.userId},
        updated_at = now()
      where user_id = ${data.userId}`;
    if (next === "suspended") {
      await sql`update campaigns set status = 'suspended', updated_at = now() where vendor_user_id = ${data.userId} and status = 'approved'`;
    }
    const copy =
      next === "approved"
        ? {
            title: "Application approved",
            body: "Your Vendor account has been approved.",
          }
        : next === "rejected"
          ? {
              title: "Application rejected",
              body: note
                ? `Your Vendor application was rejected. ${note}`
                : "Your Vendor application was rejected. Review the reason and update your information.",
            }
          : {
              title: "Vendor account suspended",
              body: note
                ? `Your Vendor account is currently suspended. ${note}`
                : "Your Vendor account is currently suspended.",
            };
    await notify(sql, data.userId, copy.title, copy.body, "vendor", "/dashboard/vendor");
    const row = await loadVendorProfile(sql, data.userId);
    return mapVendorProfile(row!);
  });

export const getAdminDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdminProfile(sql, context.userId);
    const users = await sql<{
      userId: string;
      displayName: string;
      roles: string;
      country: string;
      createdAt: string;
    }>`
      select user_id as "userId", display_name as "displayName", roles, country,
             created_at::text as "createdAt"
      from profiles order by created_at desc limit 50`;
    const campaigns = await sql<CampaignRow>`select * from campaigns order by created_at desc`;
    const payouts = await sql<Payout>`
      select id, user_id as "userId", amount_ngn as "amountNgn", method, details, status,
             admin_note as "adminNote", created_at::text as "createdAt", processed_at::text as "processedAt"
      from payouts order by created_at desc limit 40`;
    const vendorApplications = await sql<
      VendorProfileRow & { display_name: string; email: string | null }
    >`
      select v.*, p.display_name, p.email
      from vendor_profiles v
      join profiles p on p.user_id = v.user_id
      order by coalesce(v.submitted_at, v.created_at) desc`;
    const settings = await loadSettings(sql);
    return {
      users,
      campaigns: campaigns.map(mapCampaign),
      payouts,
      vendorApplications: vendorApplications.map((row) => ({
        ...mapVendorProfile(row),
        displayName: row.display_name,
        email: row.email,
      })) satisfies VendorApplication[],
      settings,
    };
  });

export const adminSettlePayout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), status: z.enum(["paid", "rejected"]), note: z.string().optional() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdminProfile(sql, context.userId);
    const [p] = await sql<{ user_id: string; amount_ngn: number; status: string }>`
      select user_id, amount_ngn, status from payouts where id = ${data.id}`;
    if (!p) throw new Error("Payout not found");
    if (p.status === "paid") return { ok: true };
    await sql`update payouts set status = ${data.status}, admin_note = ${data.note ?? null}, processed_at = now() where id = ${data.id}`;
    if (data.status === "paid") {
      await sql`update wallets set paid_ngn = paid_ngn + ${p.amount_ngn} where user_id = ${p.user_id}`;
      await notify(
        sql,
        p.user_id,
        "Payout sent",
        `₦${Number(p.amount_ngn).toLocaleString()} marked as paid (sandbox rail).`,
        "payout",
        "/dashboard/payouts",
      );
    } else {
      await sql`update wallets set available_ngn = available_ngn + ${p.amount_ngn} where user_id = ${p.user_id}`;
      await notify(sql, p.user_id, "Payout returned", "The request was rejected and the balance restored.", "payout", "/dashboard/payouts");
    }
    return { ok: true };
  });

export const savePlatformSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      minPayoutNgn: z.number().int().min(0),
      cookieDays: z.number().int().min(1).max(90),
      referralPct: z.number().int().min(0).max(50),
      platformFeePct: z.number().int().min(0).max(40),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdminProfile(sql, context.userId);
    await sql`update platform_settings set
      min_payout_ngn = ${data.minPayoutNgn},
      cookie_days = ${data.cookieDays},
      referral_pct = ${data.referralPct},
      platform_fee_pct = ${data.platformFeePct}
      where id = 1`;
    return { ok: true };
  });

export const savePayoutProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      displayName: z.string().min(2).max(80),
      phone: z.string().max(24).optional(),
      country: z.string().min(2).max(4),
      payoutMethod: z.string().optional(),
      payoutDetails: z.string().max(240).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`update profiles set
      display_name = ${data.displayName},
      phone = ${data.phone ?? null},
      country = ${data.country},
      payout_method = ${data.payoutMethod ?? null},
      payout_details = ${data.payoutDetails ?? null}
      where user_id = ${context.userId}`;
    return { ok: true };
  });
