import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { D as _enum, F as object, M as literal, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as normalizeProductRole, r as deskRoleOf } from "./roles-DLM0LukR.mjs";
import { a as trackingCode, i as referralCode, r as newId, t as authMiddleware } from "./utils-CmheKJRZ.mjs";
import { r as getSql } from "./db-t0GfMRMu.mjs";
import { a as vendorCanSubmit, i as vendorCanPublish, n as applyVendorReview, r as vendorCanEdit } from "./vendor-BTHRHLIA.mjs";
import { c as compatPriceNgn, d as productCanSubmit, f as productIsPublic, l as isCurrency, o as applyProductReview, p as validateCommission, s as compatCommissionPct, u as productCanEdit } from "./product-CDkg8sUW.mjs";
import { a as normalizeMarketplaceQuery, o as productIsMarketplaceLive } from "./marketplace-BI8vvxl1.mjs";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/platform-DewdJ8c9.js
var MAX_BYTES = 4e5;
var TYPES = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp"
};
function decodeDataUrl(dataUrl) {
	const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl.trim());
	if (!match) throw new Error("Upload a JPEG, PNG, or WebP image");
	return {
		mime: match[1].toLowerCase(),
		bytes: Buffer.from(match[2], "base64")
	};
}
/** Local-disk placeholder. Swap this for object storage later; do not put blobs in SQL rows. */
async function storeProductImage(dataUrl, vendorUserId) {
	const { mime, bytes } = decodeDataUrl(dataUrl);
	const ext = TYPES[mime];
	if (!ext) throw new Error("Upload a JPEG, PNG, or WebP image");
	if (bytes.length < 32) throw new Error("That image file is empty");
	if (bytes.length > MAX_BYTES) throw new Error("Image must be under 400KB");
	const dir = join(process.cwd(), "public", "uploads", "products");
	await mkdir(dir, { recursive: true });
	const name = `${vendorUserId.replace(/[^a-zA-Z0-9_-]/g, "").slice(-10) || "vendor"}-${Date.now()}.${ext}`;
	try {
		await writeFile(join(dir, name), bytes);
	} catch {
		throw new Error("Image upload is unavailable here. Paste an HTTPS image URL instead.");
	}
	return `/uploads/products/${name}`;
}
function isAllowedImageUrl(value) {
	if (!value) return true;
	if (value.startsWith("/uploads/products/")) return true;
	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:";
	} catch {
		return false;
	}
}
function mapCampaign(r) {
	const currency = isCurrency(r.currency) ? r.currency : "NGN";
	const commissionType = r.commission_type === "fixed" ? "fixed" : "percent";
	const productType = r.product_type || "digital";
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
		commissionMode: r.commission_mode || "one_time",
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
		updatedAt: String(r.updated_at ?? r.created_at)
	};
}
function mapPublicOffer(r) {
	const currency = isCurrency(r.currency) ? r.currency : "NGN";
	const commissionType = r.commission_type === "fixed" ? "fixed" : "percent";
	return {
		slug: r.slug,
		title: r.title,
		tagline: r.tagline,
		description: r.description,
		category: r.category,
		productType: r.product_type || "digital",
		imageUrl: r.image_url,
		priceAmount: Number(r.price_amount ?? 0),
		currency,
		commissionType,
		commissionValue: Number(r.commission_value ?? 0),
		storeName: r.store_name,
		cookieDays: Number(r.cookie_days ?? 30),
		highlights: (r.highlights || "").split("\n").filter(Boolean),
		listedAt: String(r.created_at)
	};
}
function mapProfile(r) {
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
		createdAt: String(r.created_at)
	};
}
async function loadAuthedProfile(sql, userId) {
	const [row] = await sql`select * from profiles where user_id = ${userId} limit 1`;
	if (!row) return null;
	const { syncPlatformOwnerFlag } = await import("./platform-owner.server-vVZzzvBf.mjs");
	return syncPlatformOwnerFlag(sql, row);
}
async function requireDesk(sql, userId, desk) {
	const row = await loadAuthedProfile(sql, userId);
	if (!row || deskRoleOf(Boolean(row.is_admin), row.roles) !== desk) throw new Error("Access denied");
	return row;
}
function mapVendorProfile(r) {
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
		createdAt: String(r.created_at)
	};
}
async function ensureVendorProfile(sql, userId, seed) {
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
async function loadVendorProfile(sql, userId) {
	const [row] = await sql`
    select * from vendor_profiles where user_id = ${userId} limit 1`;
	return row ?? null;
}
async function requireApprovedVendor(sql, userId) {
	await requireDesk(sql, userId, "vendor");
	const row = await loadVendorProfile(sql, userId);
	if (!row || !vendorCanPublish(row.status)) throw new Error("Vendor account is not approved");
	return row;
}
async function requireAdminProfile(sql, userId) {
	const { assertPlatformAdmin } = await import("./platform-owner.server-vVZzzvBf.mjs");
	return assertPlatformAdmin(sql, userId);
}
var assertDeskAccess_createServerFn_handler = createServerRpc({
	id: "4f0297e9513648bb176ef8bf6b7c1d5a3b9930a4d190af1b11961af69f2481da",
	name: "assertDeskAccess",
	filename: "src/lib/server/platform.ts"
}, (opts) => assertDeskAccess.__executeServer(opts));
var assertDeskAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ desk: _enum([
	"admin",
	"vendor",
	"affiliate"
]) })).handler(assertDeskAccess_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.desk === "admin") {
		await requireAdminProfile(sql, context.userId);
		return { ok: true };
	}
	await requireDesk(sql, context.userId, data.desk);
	return { ok: true };
});
function mapSettings(row) {
	return {
		minPayoutNgn: Number(row?.min_payout_ngn ?? 5e3),
		cookieDays: Number(row?.cookie_days ?? 30),
		referralPct: Number(row?.referral_pct ?? 5),
		platformFeePct: Number(row?.platform_fee_pct ?? 5),
		pixelSecret: row?.pixel_secret || "digiafrika_sandbox_pixel"
	};
}
async function notify(sql, userId, title, body, kind, href) {
	await sql`insert into notifications (id, user_id, title, body, kind, href)
    values (${newId("nt")}, ${userId}, ${title}, ${body}, ${kind}, ${href ?? null})`;
}
async function ensureWallet(sql, userId) {
	await sql`insert into wallets (user_id) values (${userId})
    on conflict (user_id) do nothing`;
}
async function loadSettings(sql) {
	const [row] = await sql`
    select min_payout_ngn, cookie_days, referral_pct, platform_fee_pct, pixel_secret
    from platform_settings where id = 1`;
	return mapSettings(row);
}
async function creditConversion(sql, en, amount, orderRef) {
	const settings = await loadSettings(sql);
	const commission = Math.round(amount * Number(en.commission_pct) / 100);
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
	const vendorShare = Math.max(0, amount - commission - Math.round(amount * settings.platformFeePct / 100));
	if (!en.vendor_user_id.startsWith("platform-")) {
		await ensureWallet(sql, en.vendor_user_id);
		await sql`update wallets set
      available_ngn = available_ngn + ${vendorShare},
      lifetime_ngn = lifetime_ngn + ${vendorShare}
      where user_id = ${en.vendor_user_id}`;
	}
	const [aff] = await sql`
    select referred_by from profiles where user_id = ${en.affiliate_user_id}`;
	if (aff?.referred_by) {
		const bonus = Math.round(commission * settings.referralPct / 100);
		if (bonus > 0) {
			await ensureWallet(sql, aff.referred_by);
			await sql`update wallets set
        available_ngn = available_ngn + ${bonus},
        lifetime_ngn = lifetime_ngn + ${bonus}
        where user_id = ${aff.referred_by}`;
			await notify(sql, aff.referred_by, "Referral override", `You earned ₦${bonus.toLocaleString()} from a referred affiliate sale.`, "referral", "/dashboard/referrals");
		}
	}
	await notify(sql, en.affiliate_user_id, "Commission approved", `₦${commission.toLocaleString()} from ${en.title} is now available.`, "conversion", "/dashboard/commissions");
	return {
		amount,
		commission
	};
}
async function ingestConversionCore(data) {
	const sql = await getSql();
	const settings = await loadSettings(sql);
	if (data.secret !== settings.pixelSecret) throw new Error("Invalid pixel secret");
	const [en] = await sql`
    select e.id, e.campaign_id, e.affiliate_user_id, c.price_ngn, c.commission_pct,
           c.vendor_user_id, c.title
    from enrollments e join campaigns c on c.id = e.campaign_id
    where e.tracking_code = ${data.code}`;
	if (!en) throw new Error("Unknown tracking code");
	return creditConversion(sql, en, data.amountNgn ?? Number(en.price_ngn), data.orderRef || `PX-${Date.now()}`);
}
var getMarketplace_createServerFn_handler = createServerRpc({
	id: "94625ecd2abca922102a22d451c44e3c17002153dbbbc1e9a9bd56f50de01cc3",
	name: "getMarketplace",
	filename: "src/lib/server/platform.ts"
}, (opts) => getMarketplace.__executeServer(opts));
var getMarketplace = createServerFn({ method: "GET" }).validator(object({
	q: string().max(80).optional(),
	category: string().max(32).optional(),
	productType: _enum([
		"digital",
		"physical",
		"service",
		"course",
		"software",
		"subscription"
	]).optional(),
	commissionType: _enum(["percent", "fixed"]).optional(),
	minPrice: number().int().nonnegative().optional(),
	maxPrice: number().int().nonnegative().optional(),
	sort: _enum([
		"newest",
		"price_asc",
		"price_desc",
		"commission"
	]).optional(),
	page: number().int().min(1).optional(),
	pageSize: number().int().min(1).max(50).optional()
}).optional()).handler(getMarketplace_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const query = normalizeMarketplaceQuery(data);
	const q = query.q ? `%${query.q.toLowerCase()}%` : null;
	const category = query.category ?? null;
	const productType = query.productType ?? null;
	const commissionType = query.commissionType ?? null;
	const minPrice = query.minPrice ?? null;
	const maxPrice = query.maxPrice ?? null;
	const offset = (query.page - 1) * query.pageSize;
	const [countRow] = await sql`
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
	return {
		items: (await sql`
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
      limit ${query.pageSize} offset ${offset}`).map(mapPublicOffer),
		page: query.page,
		pageSize: query.pageSize,
		total: Number(countRow?.n ?? 0)
	};
});
var getPlatformStats_createServerFn_handler = createServerRpc({
	id: "1342d390d4e5ea7fc6ecc9d29f292e5293ea6c9911e3674a7302b51572a8ab10",
	name: "getPlatformStats",
	filename: "src/lib/server/platform.ts"
}, (opts) => getPlatformStats.__executeServer(opts));
var getPlatformStats = createServerFn({ method: "GET" }).handler(getPlatformStats_createServerFn_handler, async () => {
	const [row] = await (await getSql())`
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
		avgCommission: Number(row?.avg_comm ?? 0)
	};
});
var getCampaignBySlug_createServerFn_handler = createServerRpc({
	id: "9d59f48c66ce4ebf9e1e6f0a4cc3602609a8cea50806c2b82e3c0aa5dcfe1164",
	name: "getCampaignBySlug",
	filename: "src/lib/server/platform.ts"
}, (opts) => getCampaignBySlug.__executeServer(opts));
var getCampaignBySlug = createServerFn({ method: "GET" }).validator(object({ slug: string().min(1).max(80) })).handler(getCampaignBySlug_createServerFn_handler, async ({ data }) => {
	const [row] = await (await getSql())`
      select
        c.slug, c.title, c.tagline, c.description, c.category, c.product_type,
        c.image_url, c.price_amount, c.currency, c.commission_type, c.commission_value,
        c.cookie_days, c.highlights, c.created_at, c.status, coalesce(c.is_demo, false) as is_demo,
        coalesce(nullif(vp.store_name, ''), c.vendor_name) as store_name,
        vp.status as vendor_status
      from campaigns c
      join vendor_profiles vp on vp.user_id = c.vendor_user_id
      where c.slug = ${data.slug}
      limit 1`;
	if (!row) return null;
	if (!productIsMarketplaceLive(row.status, Boolean(row.is_demo), row.vendor_status)) return null;
	return mapPublicOffer(row);
});
var recordClick_createServerFn_handler = createServerRpc({
	id: "733d3af2a826112eab543a5bc778915beacee3db35f4a378e10e140d5cd450ff",
	name: "recordClick",
	filename: "src/lib/server/platform.ts"
}, (opts) => recordClick.__executeServer(opts));
var recordClick = createServerFn({ method: "POST" }).validator(object({ code: string() })).handler(recordClick_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const [en] = await sql`
      select e.id, e.campaign_id, c.landing_url, c.title, c.vendor_name, c.cookie_days
      from enrollments e
      join campaigns c on c.id = e.campaign_id
      where e.tracking_code = ${data.code}
      limit 1`;
	if (!en) return {
		ok: false,
		url: "/marketplace"
	};
	const [offer] = await sql`
      select status, coalesce(is_demo, false) as is_demo from campaigns where id = ${en.campaign_id}`;
	if (!offer || !productIsPublic(offer.status, Boolean(offer.is_demo))) return {
		ok: false,
		url: "/marketplace"
	};
	await sql`insert into clicks (enrollment_id) values (${en.id})`;
	await sql`update enrollments set clicks = clicks + 1 where id = ${en.id}`;
	await sql`update campaigns set clicks = clicks + 1 where id = ${en.campaign_id}`;
	const sep = en.landing_url.includes("?") ? "&" : "?";
	return {
		ok: true,
		url: `${en.landing_url}${sep}via=digiafrika&aff=${data.code}`,
		title: en.title,
		vendor: en.vendor_name,
		code: data.code,
		cookieDays: Number(en.cookie_days)
	};
});
var ingestConversion_createServerFn_handler = createServerRpc({
	id: "b31e0a97b5546772aaed209fd62a58078501eac47191c898718f025168c4231b",
	name: "ingestConversion",
	filename: "src/lib/server/platform.ts"
}, (opts) => ingestConversion.__executeServer(opts));
var ingestConversion = createServerFn({ method: "POST" }).validator(object({
	code: string().min(4),
	orderRef: string().max(80).optional(),
	amountNgn: number().int().positive().optional(),
	secret: string().min(4)
})).handler(ingestConversion_createServerFn_handler, async ({ data }) => ingestConversionCore(data));
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "3b261862a7922eb85a547500bc4afc99d66e3ac9e2f22b13308428f4fee92445",
	name: "getMyProfile",
	filename: "src/lib/server/platform.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const row = await loadAuthedProfile(sql, context.userId);
	if (!row) return null;
	await ensureWallet(sql, context.userId);
	return mapProfile(row);
});
var onboardingSchema = object({
	displayName: string().min(2).max(80),
	country: string().min(2).max(4),
	role: _enum(["affiliate", "vendor"]),
	phone: string().max(24).optional(),
	referralCode: string().max(16).optional(),
	email: string().email().optional().nullable()
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "ecde2186689c7bc3629a98ad2843c8ac3a8856e5c288ba709eae5e7ec5e89223",
	name: "completeOnboarding",
	filename: "src/lib/server/platform.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(onboardingSchema).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await loadAuthedProfile(sql, context.userId);
	if (existing?.onboarded_at) return mapProfile(existing);
	const roles = normalizeProductRole(data.role);
	let referredBy = null;
	const ref = data.referralCode?.trim().toUpperCase();
	if (ref) {
		const [refRow] = await sql`
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
	if (row && (normalizeProductRole(row.roles) === "vendor" || data.role === "vendor") && !row.is_admin) await ensureVendorProfile(sql, context.userId, {
		country: data.country,
		email: data.email ?? row.email,
		phone: data.phone ?? row.phone,
		name: data.displayName.trim()
	});
	await notify(sql, context.userId, "Welcome to DigiAfrika", row?.is_admin ? "Your operator desk is live. Admin is separate from vendor and affiliate desks." : data.role === "vendor" ? "Your vendor desk is live. Submit your store profile for review before listing offers." : "Your affiliate desk is live. Promote an offer to get a tracking link.", "system", "/dashboard");
	if (referredBy) await notify(sql, referredBy, "New referral joined", `${data.displayName.trim()} signed up with your code.`, "referral", "/dashboard/referrals");
	return mapProfile(row);
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "e5802fe2350cb3923b46a3ad3879ac83a5c3f39ca1f876f3a0d639a2f605fb66",
	name: "getDashboard",
	filename: "src/lib/server/platform.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const profileRow = await loadAuthedProfile(sql, context.userId);
	if (!profileRow) return { profile: null };
	await ensureWallet(sql, context.userId);
	const [wallet] = await sql`
      select user_id as "userId", available_ngn as "availableNgn", pending_ngn as "pendingNgn",
             paid_ngn as "paidNgn", lifetime_ngn as "lifetimeNgn"
      from wallets where user_id = ${context.userId}`;
	const profile = mapProfile(profileRow);
	const desk = profile.deskRole;
	const enrollments = desk === "affiliate" ? await sql`
      select e.id, e.campaign_id as "campaignId", e.affiliate_user_id as "affiliateUserId",
             e.tracking_code as "trackingCode", e.created_at::text as "createdAt",
             e.clicks, e.sales, e.earned_ngn as "earnedNgn",
             c.title, c.slug, c.commission_pct as "commissionPct"
      from enrollments e join campaigns c on c.id = e.campaign_id
      where e.affiliate_user_id = ${context.userId}
      order by e.created_at desc` : [];
	const commissions = desk === "affiliate" ? await sql`
      select cm.id, cm.conversion_id as "conversionId", cm.affiliate_user_id as "affiliateUserId",
             cm.vendor_user_id as "vendorUserId", cm.campaign_id as "campaignId",
             c.title as "campaignTitle", cm.amount_ngn as "amountNgn", cm.status,
             cm.created_at::text as "createdAt"
      from commissions cm join campaigns c on c.id = cm.campaign_id
      where cm.affiliate_user_id = ${context.userId}
      order by cm.created_at desc limit 20` : [];
	const notifications = await sql`
      select id, user_id as "userId", title, body, kind, href,
             read_at::text as "readAt", created_at::text as "createdAt"
      from notifications where user_id = ${context.userId}
      order by created_at desc limit 12`;
	const series = desk === "affiliate" ? await sql`
      select to_char(d::date, 'MM-DD') as day,
        coalesce((select sum(amount_ngn) from commissions
                  where affiliate_user_id = ${context.userId}
                    and created_at::date = d::date), 0)::int as amount,
        coalesce((select count(*) from clicks cl
                  join enrollments e on e.id = cl.enrollment_id
                  where e.affiliate_user_id = ${context.userId}
                    and cl.created_at::date = d::date), 0)::int as clicks
      from generate_series(current_date - 13, current_date, interval '1 day') as d` : [];
	const vendorCampaigns = desk === "vendor" ? await sql`select * from campaigns where vendor_user_id = ${context.userId} order by created_at desc` : [];
	let vendorProfile = null;
	if (desk === "vendor") {
		await ensureVendorProfile(sql, context.userId, {
			country: profileRow.country,
			email: profileRow.email,
			phone: profileRow.phone,
			name: profileRow.display_name
		});
		const vendorRow = await loadVendorProfile(sql, context.userId);
		vendorProfile = vendorRow ? mapVendorProfile(vendorRow) : null;
	}
	const [unread] = await sql`
      select count(*)::int as n from notifications where user_id = ${context.userId} and read_at is null`;
	const [refs] = await sql`
      select count(*)::int as n from profiles where referred_by = ${context.userId}`;
	const settings = await loadSettings(sql);
	return {
		profile,
		wallet: wallet ?? {
			userId: context.userId,
			availableNgn: 0,
			pendingNgn: 0,
			paidNgn: 0,
			lifetimeNgn: 0
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
			pixelSecret: desk === "vendor" && vendorProfile?.status === "approved" ? settings.pixelSecret : ""
		}
	};
});
var enrollInCampaign_createServerFn_handler = createServerRpc({
	id: "e48a928303f3a50a71aa0a113af1ce4d36eb113ac668100cd9547f7d9c7e8fa9",
	name: "enrollInCampaign",
	filename: "src/lib/server/platform.ts"
}, (opts) => enrollInCampaign.__executeServer(opts));
var enrollInCampaign = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ campaignId: string() })).handler(enrollInCampaign_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireDesk(sql, context.userId, "affiliate");
	const [camp] = await sql`
      select * from campaigns
      where id = ${data.campaignId}
        and status = 'approved'
        and coalesce(is_demo, false) = false`;
	if (!camp) throw new Error("Offer is not live");
	const [already] = await sql`
      select tracking_code from enrollments
      where campaign_id = ${data.campaignId} and affiliate_user_id = ${context.userId}`;
	if (already) return {
		trackingCode: already.tracking_code,
		created: false
	};
	const code = trackingCode();
	await sql`
      insert into enrollments (id, campaign_id, affiliate_user_id, tracking_code)
      values (${newId("en")}, ${data.campaignId}, ${context.userId}, ${code})`;
	await notify(sql, context.userId, "Tracking link ready", `You can now promote ${camp.title}.`, "campaign", "/dashboard/links");
	return {
		trackingCode: code,
		created: true
	};
});
var simulateSale_createServerFn_handler = createServerRpc({
	id: "0d0c73835c143e0787b2c4d1aeaa66a96ada7394111e84495423382714425c07",
	name: "simulateSale",
	filename: "src/lib/server/platform.ts"
}, (opts) => simulateSale.__executeServer(opts));
var simulateSale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	trackingCode: string(),
	amountNgn: number().int().positive().optional()
})).handler(simulateSale_createServerFn_handler, async () => {
	throw new Error("Simulated sales are not part of production");
});
var productInput = object({
	title: string().min(2).max(80),
	tagline: string().min(8).max(160),
	category: string().min(2).max(32),
	productType: _enum([
		"digital",
		"physical",
		"service",
		"course",
		"software",
		"subscription"
	]),
	description: string().min(20).max(8e3),
	priceAmount: number().positive(),
	currency: _enum([
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
		"EUR"
	]),
	commissionType: _enum(["percent", "fixed"]),
	commissionValue: number().min(0),
	commissionMode: _enum([
		"one_time",
		"recurring",
		"lifetime"
	]).optional(),
	imageUrl: string().max(500).optional().or(literal("")),
	landingUrl: string().max(500).optional().or(literal(""))
});
function assertProductRules(data) {
	if (!(data.priceAmount > 0)) throw new Error("Price must be greater than zero");
	const commissionError = validateCommission(data.commissionType, data.commissionValue);
	if (commissionError) throw new Error(commissionError);
	const image = data.imageUrl?.trim() || "";
	if (image && !isAllowedImageUrl(image)) throw new Error("Image URL is not valid");
	const landing = data.landingUrl?.trim() || "";
	if (landing) try {
		const url = new URL(landing);
		if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("invalid");
	} catch {
		throw new Error("Product URL must be a valid http(s) link");
	}
}
function toSlug(title) {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 64);
}
async function loadOwnedProduct(sql, userId, productId) {
	const [row] = await sql`
    select * from campaigns where id = ${productId} and vendor_user_id = ${userId} limit 1`;
	if (!row) throw new Error("Product not found");
	return row;
}
async function writeOwnedProduct(sql, userId, data) {
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
var createProduct_createServerFn_handler = createServerRpc({
	id: "bb194bd72bcad3befcb327cd3f825660fab7b6f605c75e7d7938afe4abdc6d5c",
	name: "createProduct",
	filename: "src/lib/server/platform.ts"
}, (opts) => createProduct.__executeServer(opts));
var createProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput).handler(createProduct_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await requireApprovedVendor(sql, context.userId);
	assertProductRules(data);
	const profile = await loadAuthedProfile(sql, context.userId);
	let slug = toSlug(data.title) || newId("p");
	const [clash] = await sql`select id from campaigns where slug = ${slug}`;
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
	await notify(sql, context.userId, "Product draft saved", `${data.title.trim()} is saved as a draft. Submit it for review when ready.`, "campaign", "/dashboard/campaigns");
	return mapCampaign(await loadOwnedProduct(sql, context.userId, id));
});
var saveProduct_createServerFn_handler = createServerRpc({
	id: "05ddd7e0a048a1bee0865d6adc9a33c16a72bedec3d2b4cac54e0583f3a5e0ec",
	name: "saveProduct",
	filename: "src/lib/server/platform.ts"
}, (opts) => saveProduct.__executeServer(opts));
var saveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput.extend({ id: string().min(1) })).handler(saveProduct_createServerFn_handler, async ({ context, data }) => {
	return mapCampaign(await writeOwnedProduct(await getSql(), context.userId, data));
});
var submitProduct_createServerFn_handler = createServerRpc({
	id: "839ff46eafbe4f146c990a46c58522b7635524b1bd526f7e8637f0387ae941ea",
	name: "submitProduct",
	filename: "src/lib/server/platform.ts"
}, (opts) => submitProduct.__executeServer(opts));
var submitProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput.extend({ id: string().min(1) })).handler(submitProduct_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const current = await writeOwnedProduct(sql, context.userId, data);
	if (!productCanSubmit(current.status)) throw new Error("This product is already under review or approved");
	await sql`
      update campaigns set
        status = 'pending_review',
        submitted_at = now(),
        updated_at = now()
      where id = ${data.id} and vendor_user_id = ${context.userId}`;
	await notify(sql, context.userId, "Product submitted", `${current.title} is waiting for Admin review.`, "campaign", "/dashboard/campaigns");
	const admins = await sql`select user_id from profiles where is_admin = true`;
	for (const admin of admins) await notify(sql, admin.user_id, "Product pending review", `${current.title} was submitted for review.`, "campaign", "/dashboard/admin");
	return mapCampaign(await loadOwnedProduct(sql, context.userId, data.id));
});
var reviewProduct_createServerFn_handler = createServerRpc({
	id: "ccd5c621ccc1fd9b3274e3be594e0f9e45e346cfda290bded303108d4acc90cc",
	name: "reviewProduct",
	filename: "src/lib/server/platform.ts"
}, (opts) => reviewProduct.__executeServer(opts));
var reviewProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().min(1),
	action: _enum([
		"approve",
		"reject",
		"suspend"
	]),
	reason: string().max(500).optional()
})).handler(reviewProduct_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdminProfile(sql, context.userId);
	const [current] = await sql`select * from campaigns where id = ${data.id} limit 1`;
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
	const copy = next === "approved" ? {
		title: "Product approved",
		body: `${current.title} is approved.`
	} : next === "rejected" ? {
		title: "Product rejected",
		body: note ? `${current.title} was rejected. ${note}` : `${current.title} was rejected.`
	} : {
		title: "Product suspended",
		body: note ? `${current.title} is suspended. ${note}` : `${current.title} is no longer publicly available.`
	};
	await notify(sql, current.vendor_user_id, copy.title, copy.body, "campaign", "/dashboard/campaigns");
	const [row] = await sql`select * from campaigns where id = ${data.id}`;
	return mapCampaign(row);
});
var uploadProductImage_createServerFn_handler = createServerRpc({
	id: "d6e340b7ad527b93bdf684438a9166bfd3c7ad31a07cd36dcb4da41b203a9223",
	name: "uploadProductImage",
	filename: "src/lib/server/platform.ts"
}, (opts) => uploadProductImage.__executeServer(opts));
var uploadProductImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ dataUrl: string().min(32).max(8e5) })).handler(uploadProductImage_createServerFn_handler, async ({ context, data }) => {
	await requireApprovedVendor(await getSql(), context.userId);
	return { url: await storeProductImage(data.dataUrl, context.userId) };
});
var updateCampaignStatus_createServerFn_handler = createServerRpc({
	id: "2979e281e732231f868fc5f39ca13cfa0f06f4876014bca8511b5c331ed67c0a",
	name: "updateCampaignStatus",
	filename: "src/lib/server/platform.ts"
}, (opts) => updateCampaignStatus.__executeServer(opts));
var updateCampaignStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	status: _enum([
		"live",
		"paused",
		"rejected",
		"pending"
	])
})).handler(updateCampaignStatus_createServerFn_handler, async () => {
	throw new Error("Product status is set by Admin review");
});
var requestPayout_createServerFn_handler = createServerRpc({
	id: "ff7d1939a250e4485d0802c9c40448d2bfb0aadb474b13ef22bccec661de788b",
	name: "requestPayout",
	filename: "src/lib/server/platform.ts"
}, (opts) => requestPayout.__executeServer(opts));
var requestPayout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	amountNgn: number().int().positive(),
	method: _enum([
		"paystack",
		"flutterwave",
		"mpesa",
		"bank_ng"
	]),
	details: string().min(4).max(240)
})).handler(requestPayout_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireDesk(sql, context.userId, "affiliate");
	await ensureWallet(sql, context.userId);
	const settings = await loadSettings(sql);
	if (data.amountNgn < settings.minPayoutNgn) throw new Error(`Minimum payout is ₦${settings.minPayoutNgn.toLocaleString()}`);
	const [wallet] = await sql`select available_ngn from wallets where user_id = ${context.userId}`;
	if (Number(wallet?.available_ngn ?? 0) < data.amountNgn) throw new Error("Insufficient available balance");
	await sql`update wallets set available_ngn = available_ngn - ${data.amountNgn} where user_id = ${context.userId}`;
	const id = newId("po");
	await sql`
      insert into payouts (id, user_id, amount_ngn, method, details, status)
      values (${id}, ${context.userId}, ${data.amountNgn}, ${data.method}, ${data.details}, 'processing')`;
	await sql`update profiles set payout_method = ${data.method}, payout_details = ${data.details} where user_id = ${context.userId}`;
	await notify(sql, context.userId, "Payout submitted", `₦${data.amountNgn.toLocaleString()} via ${data.method} is in the sandbox settlement queue.`, "payout", "/dashboard/payouts");
	return { id };
});
var getPayouts_createServerFn_handler = createServerRpc({
	id: "1e8d8e4cf0439ac89c3e8a8c1403732523554d4ba24428450da6ecb7744280af",
	name: "getPayouts",
	filename: "src/lib/server/platform.ts"
}, (opts) => getPayouts.__executeServer(opts));
var getPayouts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getPayouts_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireDesk(sql, context.userId, "affiliate");
	return sql`
      select id, user_id as "userId", amount_ngn as "amountNgn", method, details, status,
             admin_note as "adminNote", created_at::text as "createdAt", processed_at::text as "processedAt"
      from payouts where user_id = ${context.userId} order by created_at desc`;
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "b36a007133165dcee424f67bc8882f3e3486060a04957f814e0363dd313dac21",
	name: "markNotificationsRead",
	filename: "src/lib/server/platform.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql())`update notifications set read_at = now() where user_id = ${context.userId} and read_at is null`;
	return { ok: true };
});
var getReferrals_createServerFn_handler = createServerRpc({
	id: "186fbf6d137aacce7e6bf5949f0e4f9514eb9f6b394329f80f5b52a11289f983",
	name: "getReferrals",
	filename: "src/lib/server/platform.ts"
}, (opts) => getReferrals.__executeServer(opts));
var getReferrals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getReferrals_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireDesk(sql, context.userId, "affiliate");
	const people = await sql`
      select display_name as "displayName", country, created_at::text as "createdAt"
      from profiles where referred_by = ${context.userId} order by created_at desc`;
	const me = await loadAuthedProfile(sql, context.userId);
	const settings = await loadSettings(sql);
	return {
		code: me?.referral_code ?? "",
		percent: settings.referralPct,
		people
	};
});
var enableVendorRole_createServerFn_handler = createServerRpc({
	id: "49fa43ff9438252273d11a3deaf023c85ad76c3fc4956c25c9715e45fcac91ba",
	name: "enableVendorRole",
	filename: "src/lib/server/platform.ts"
}, (opts) => enableVendorRole.__executeServer(opts));
var enableVendorRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(enableVendorRole_createServerFn_handler, async () => {
	throw new Error("Access denied");
});
var vendorProfileInput = object({
	storeName: string().min(2).max(80),
	description: string().min(20).max(2e3),
	country: string().min(2).max(4),
	contactEmail: string().email().optional().or(literal("")),
	contactPhone: string().max(24).optional(),
	category: string().min(2).max(32),
	websiteUrl: string().url().optional().or(literal(""))
});
async function writeOwnVendorProfile(sql, userId, data) {
	const me = await requireDesk(sql, userId, "vendor");
	await ensureVendorProfile(sql, userId, {
		country: me.country,
		email: me.email,
		phone: me.phone,
		name: me.display_name
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
var saveVendorProfile_createServerFn_handler = createServerRpc({
	id: "b0d15a9de0efb156bf5663a79e630aa5f750ec74a6b367b6774662e2ccd30c9f",
	name: "saveVendorProfile",
	filename: "src/lib/server/platform.ts"
}, (opts) => saveVendorProfile.__executeServer(opts));
var saveVendorProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(vendorProfileInput).handler(saveVendorProfile_createServerFn_handler, async ({ context, data }) => {
	return mapVendorProfile(await writeOwnVendorProfile(await getSql(), context.userId, data));
});
var submitVendorApplication_createServerFn_handler = createServerRpc({
	id: "1d7a09bad49e9837fc7ab7e5dec40253fc78abe237124347cca30a92a9ddad68",
	name: "submitVendorApplication",
	filename: "src/lib/server/platform.ts"
}, (opts) => submitVendorApplication.__executeServer(opts));
var submitVendorApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(vendorProfileInput).handler(submitVendorApplication_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await writeOwnVendorProfile(sql, context.userId, data);
	const current = await loadVendorProfile(sql, context.userId);
	if (!current) throw new Error("Vendor profile not found");
	if (!vendorCanSubmit(current.status)) throw new Error("This application is already under review or approved");
	await sql`
      update vendor_profiles set
        status = 'pending_review',
        submitted_at = now(),
        updated_at = now()
      where user_id = ${context.userId}`;
	await notify(sql, context.userId, "Application submitted", "Your Vendor application is currently under review.", "vendor", "/dashboard/vendor");
	const admins = await sql`select user_id from profiles where is_admin = true`;
	for (const admin of admins) await notify(sql, admin.user_id, "Vendor application pending", `${data.storeName.trim()} submitted a store profile for review.`, "vendor", "/dashboard/admin");
	return mapVendorProfile(await loadVendorProfile(sql, context.userId));
});
var reviewVendorApplication_createServerFn_handler = createServerRpc({
	id: "5b59c360368ec299262b436aa8c517a865ec83c670d0542302be78f97bad44b5",
	name: "reviewVendorApplication",
	filename: "src/lib/server/platform.ts"
}, (opts) => reviewVendorApplication.__executeServer(opts));
var reviewVendorApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	action: _enum([
		"approve",
		"reject",
		"suspend"
	]),
	reason: string().max(500).optional()
})).handler(reviewVendorApplication_createServerFn_handler, async ({ context, data }) => {
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
	if (next === "suspended") await sql`update campaigns set status = 'suspended', updated_at = now() where vendor_user_id = ${data.userId} and status = 'approved'`;
	const copy = next === "approved" ? {
		title: "Application approved",
		body: "Your Vendor account has been approved."
	} : next === "rejected" ? {
		title: "Application rejected",
		body: note ? `Your Vendor application was rejected. ${note}` : "Your Vendor application was rejected. Review the reason and update your information."
	} : {
		title: "Vendor account suspended",
		body: note ? `Your Vendor account is currently suspended. ${note}` : "Your Vendor account is currently suspended."
	};
	await notify(sql, data.userId, copy.title, copy.body, "vendor", "/dashboard/vendor");
	return mapVendorProfile(await loadVendorProfile(sql, data.userId));
});
var getAdminDesk_createServerFn_handler = createServerRpc({
	id: "f2a9a7b03457a552c96a6fb65cada2c850c1a76dca046f87e18b640bef197e93",
	name: "getAdminDesk",
	filename: "src/lib/server/platform.ts"
}, (opts) => getAdminDesk.__executeServer(opts));
var getAdminDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminDesk_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdminProfile(sql, context.userId);
	const users = await sql`
      select user_id as "userId", display_name as "displayName", roles, country,
             created_at::text as "createdAt"
      from profiles order by created_at desc limit 50`;
	const campaigns = await sql`select * from campaigns order by created_at desc`;
	const payouts = await sql`
      select id, user_id as "userId", amount_ngn as "amountNgn", method, details, status,
             admin_note as "adminNote", created_at::text as "createdAt", processed_at::text as "processedAt"
      from payouts order by created_at desc limit 40`;
	const vendorApplications = await sql`
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
			email: row.email
		})),
		settings
	};
});
var adminSettlePayout_createServerFn_handler = createServerRpc({
	id: "b988c45cc551ff00e3c43744157ae38f0bd08c9eabe56a6a22027a6564add5c1",
	name: "adminSettlePayout",
	filename: "src/lib/server/platform.ts"
}, (opts) => adminSettlePayout.__executeServer(opts));
var adminSettlePayout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	status: _enum(["paid", "rejected"]),
	note: string().optional()
})).handler(adminSettlePayout_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdminProfile(sql, context.userId);
	const [p] = await sql`
      select user_id, amount_ngn, status from payouts where id = ${data.id}`;
	if (!p) throw new Error("Payout not found");
	if (p.status === "paid") return { ok: true };
	await sql`update payouts set status = ${data.status}, admin_note = ${data.note ?? null}, processed_at = now() where id = ${data.id}`;
	if (data.status === "paid") {
		await sql`update wallets set paid_ngn = paid_ngn + ${p.amount_ngn} where user_id = ${p.user_id}`;
		await notify(sql, p.user_id, "Payout sent", `₦${Number(p.amount_ngn).toLocaleString()} marked as paid (sandbox rail).`, "payout", "/dashboard/payouts");
	} else {
		await sql`update wallets set available_ngn = available_ngn + ${p.amount_ngn} where user_id = ${p.user_id}`;
		await notify(sql, p.user_id, "Payout returned", "The request was rejected and the balance restored.", "payout", "/dashboard/payouts");
	}
	return { ok: true };
});
var savePlatformSettings_createServerFn_handler = createServerRpc({
	id: "83bc975b7e451a4a812e9f57fde97f9a01174b8746dd3147efdb561fa9f7cba0",
	name: "savePlatformSettings",
	filename: "src/lib/server/platform.ts"
}, (opts) => savePlatformSettings.__executeServer(opts));
var savePlatformSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	minPayoutNgn: number().int().min(0),
	cookieDays: number().int().min(1).max(90),
	referralPct: number().int().min(0).max(50),
	platformFeePct: number().int().min(0).max(40)
})).handler(savePlatformSettings_createServerFn_handler, async ({ context, data }) => {
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
var savePayoutProfile_createServerFn_handler = createServerRpc({
	id: "ef0f9857eb30ad1e38c8d8c6a35da04e8ebe5e4e9df91d10347fe413a54342db",
	name: "savePayoutProfile",
	filename: "src/lib/server/platform.ts"
}, (opts) => savePayoutProfile.__executeServer(opts));
var savePayoutProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	displayName: string().min(2).max(80),
	phone: string().max(24).optional(),
	country: string().min(2).max(4),
	payoutMethod: string().optional(),
	payoutDetails: string().max(240).optional()
})).handler(savePayoutProfile_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`update profiles set
      display_name = ${data.displayName},
      phone = ${data.phone ?? null},
      country = ${data.country},
      payout_method = ${data.payoutMethod ?? null},
      payout_details = ${data.payoutDetails ?? null}
      where user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { adminSettlePayout_createServerFn_handler, assertDeskAccess_createServerFn_handler, completeOnboarding_createServerFn_handler, createProduct_createServerFn_handler, enableVendorRole_createServerFn_handler, enrollInCampaign_createServerFn_handler, getAdminDesk_createServerFn_handler, getCampaignBySlug_createServerFn_handler, getDashboard_createServerFn_handler, getMarketplace_createServerFn_handler, getMyProfile_createServerFn_handler, getPayouts_createServerFn_handler, getPlatformStats_createServerFn_handler, getReferrals_createServerFn_handler, ingestConversion_createServerFn_handler, markNotificationsRead_createServerFn_handler, recordClick_createServerFn_handler, requestPayout_createServerFn_handler, reviewProduct_createServerFn_handler, reviewVendorApplication_createServerFn_handler, savePayoutProfile_createServerFn_handler, savePlatformSettings_createServerFn_handler, saveProduct_createServerFn_handler, saveVendorProfile_createServerFn_handler, simulateSale_createServerFn_handler, submitProduct_createServerFn_handler, submitVendorApplication_createServerFn_handler, updateCampaignStatus_createServerFn_handler, uploadProductImage_createServerFn_handler };
