import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { D as _enum, F as object, M as literal, P as number, R as string, z as union } from "../_libs/@better-auth/core+[...].mjs";
import { r as newId, t as authMiddleware } from "./utils-CmheKJRZ.mjs";
import { r as getSql } from "./db-t0GfMRMu.mjs";
import { n as auth } from "./server-CK0KlVdy.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/platform-CjmuUHBH.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var assertDeskAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ desk: _enum([
	"admin",
	"vendor",
	"affiliate"
]) })).handler(createSsrRpc("4f0297e9513648bb176ef8bf6b7c1d5a3b9930a4d190af1b11961af69f2481da"));
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
}).optional()).handler(createSsrRpc("94625ecd2abca922102a22d451c44e3c17002153dbbbc1e9a9bd56f50de01cc3"));
var getPlatformStats = createServerFn({ method: "GET" }).handler(createSsrRpc("1342d390d4e5ea7fc6ecc9d29f292e5293ea6c9911e3674a7302b51572a8ab10"));
var getCampaignBySlug = createServerFn({ method: "GET" }).validator(object({ slug: string().min(1).max(80) })).handler(createSsrRpc("9d59f48c66ce4ebf9e1e6f0a4cc3602609a8cea50806c2b82e3c0aa5dcfe1164"));
var recordClick = createServerFn({ method: "POST" }).validator(object({ code: string() })).handler(createSsrRpc("733d3af2a826112eab543a5bc778915beacee3db35f4a378e10e140d5cd450ff"));
createServerFn({ method: "POST" }).validator(object({
	code: string().min(4),
	orderRef: string().max(80).optional(),
	amountNgn: number().int().positive().optional(),
	secret: string().min(4)
})).handler(createSsrRpc("b31e0a97b5546772aaed209fd62a58078501eac47191c898718f025168c4231b"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3b261862a7922eb85a547500bc4afc99d66e3ac9e2f22b13308428f4fee92445"));
var onboardingSchema = object({
	displayName: string().min(2).max(80),
	country: string().min(2).max(4),
	role: _enum(["affiliate", "vendor"]),
	phone: string().max(24).optional(),
	referralCode: string().max(16).optional(),
	email: string().email().optional().nullable()
});
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(onboardingSchema).handler(createSsrRpc("ecde2186689c7bc3629a98ad2843c8ac3a8856e5c288ba709eae5e7ec5e89223"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e5802fe2350cb3923b46a3ad3879ac83a5c3f39ca1f876f3a0d639a2f605fb66"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ campaignId: string() })).handler(createSsrRpc("e48a928303f3a50a71aa0a113af1ce4d36eb113ac668100cd9547f7d9c7e8fa9"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	trackingCode: string(),
	amountNgn: number().int().positive().optional()
})).handler(createSsrRpc("0d0c73835c143e0787b2c4d1aeaa66a96ada7394111e84495423382714425c07"));
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
var createProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput).handler(createSsrRpc("bb194bd72bcad3befcb327cd3f825660fab7b6f605c75e7d7938afe4abdc6d5c"));
var saveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput.extend({ id: string().min(1) })).handler(createSsrRpc("05ddd7e0a048a1bee0865d6adc9a33c16a72bedec3d2b4cac54e0583f3a5e0ec"));
var submitProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput.extend({ id: string().min(1) })).handler(createSsrRpc("839ff46eafbe4f146c990a46c58522b7635524b1bd526f7e8637f0387ae941ea"));
var reviewProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().min(1),
	action: _enum([
		"approve",
		"reject",
		"suspend"
	]),
	reason: string().max(500).optional()
})).handler(createSsrRpc("ccd5c621ccc1fd9b3274e3be594e0f9e45e346cfda290bded303108d4acc90cc"));
var uploadProductImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ dataUrl: string().min(32).max(8e5) })).handler(createSsrRpc("d6e340b7ad527b93bdf684438a9166bfd3c7ad31a07cd36dcb4da41b203a9223"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	status: _enum([
		"live",
		"paused",
		"rejected",
		"pending"
	])
})).handler(createSsrRpc("2979e281e732231f868fc5f39ca13cfa0f06f4876014bca8511b5c331ed67c0a"));
var requestPayout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	amountNgn: number().int().positive(),
	method: _enum([
		"paystack",
		"flutterwave",
		"mpesa",
		"bank_ng"
	]),
	details: string().min(4).max(240)
})).handler(createSsrRpc("ff7d1939a250e4485d0802c9c40448d2bfb0aadb474b13ef22bccec661de788b"));
var getPayouts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1e8d8e4cf0439ac89c3e8a8c1403732523554d4ba24428450da6ecb7744280af"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("b36a007133165dcee424f67bc8882f3e3486060a04957f814e0363dd313dac21"));
var getReferrals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("186fbf6d137aacce7e6bf5949f0e4f9514eb9f6b394329f80f5b52a11289f983"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("49fa43ff9438252273d11a3deaf023c85ad76c3fc4956c25c9715e45fcac91ba"));
var vendorProfileInput = object({
	storeName: string().min(2).max(80),
	description: string().min(20).max(2e3),
	country: string().min(2).max(4),
	contactEmail: string().email().optional().or(literal("")),
	contactPhone: string().max(24).optional(),
	category: string().min(2).max(32),
	websiteUrl: string().url().optional().or(literal(""))
});
var saveVendorProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(vendorProfileInput).handler(createSsrRpc("b0d15a9de0efb156bf5663a79e630aa5f750ec74a6b367b6774662e2ccd30c9f"));
var submitVendorApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(vendorProfileInput).handler(createSsrRpc("1d7a09bad49e9837fc7ab7e5dec40253fc78abe237124347cca30a92a9ddad68"));
var reviewVendorApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	action: _enum([
		"approve",
		"reject",
		"suspend"
	]),
	reason: string().max(500).optional()
})).handler(createSsrRpc("5b59c360368ec299262b436aa8c517a865ec83c670d0542302be78f97bad44b5"));
var getAdminDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f2a9a7b03457a552c96a6fb65cada2c850c1a76dca046f87e18b640bef197e93"));
var adminSettlePayout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	status: _enum(["paid", "rejected"]),
	note: string().optional()
})).handler(createSsrRpc("b988c45cc551ff00e3c43744157ae38f0bd08c9eabe56a6a22027a6564add5c1"));
var savePlatformSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	minPayoutNgn: number().int().min(0),
	cookieDays: number().int().min(1).max(90),
	referralPct: number().int().min(0).max(50),
	platformFeePct: number().int().min(0).max(40)
})).handler(createSsrRpc("83bc975b7e451a4a812e9f57fde97f9a01174b8746dd3147efdb561fa9f7cba0"));
var savePayoutProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	displayName: string().min(2).max(80),
	phone: string().max(24).optional(),
	country: string().min(2).max(4),
	payoutMethod: string().optional(),
	payoutDetails: string().max(240).optional()
})).handler(createSsrRpc("ef0f9857eb30ad1e38c8d8c6a35da04e8ebe5e4e9df91d10347fe413a54342db"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-9kbAl_o0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-BonK1YRR.css";
var APP_NAME = "DigiAfrika";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$23 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "DigiAfrika is the affiliate marketplace for African digital products. Promote campaigns, track commissions, and get paid on local rails."
			},
			{
				name: "theme-color",
				content: "#0D3D24"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&family=Syne:wght@500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$20 = () => import("./routes-ohDjXznc.mjs");
var Route$22 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./dashboard-DkQqW_Et.mjs");
var Route$21 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./how-it-works-CgBkFIul.mjs");
var Route$20 = createFileRoute("/how-it-works")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./login-Z6VZH9oT.mjs");
var Route$19 = createFileRoute("/login")({
	validateSearch: (s) => {
		const search = {};
		if (s.join === "1") search.join = "1";
		if (typeof s.ref === "string" && s.ref) search.ref = s.ref;
		return search;
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./marketplace-vyZLTd64.mjs");
var Route$18 = createFileRoute("/marketplace")({
	validateSearch: (raw) => ({
		q: typeof raw.q === "string" ? raw.q : void 0,
		category: typeof raw.category === "string" ? raw.category : void 0,
		productType: typeof raw.productType === "string" ? raw.productType : void 0,
		commissionType: typeof raw.commissionType === "string" ? raw.commissionType : void 0,
		minPrice: typeof raw.minPrice === "string" || typeof raw.minPrice === "number" ? String(raw.minPrice) : void 0,
		maxPrice: typeof raw.maxPrice === "string" || typeof raw.maxPrice === "number" ? String(raw.maxPrice) : void 0,
		sort: typeof raw.sort === "string" ? raw.sort : void 0,
		page: typeof raw.page === "number" ? raw.page : typeof raw.page === "string" ? Number(raw.page) || void 0 : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./onboarding-BIxU4Byd.mjs");
var Route$17 = createFileRoute("/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./vendors-DER5OZZt.mjs");
var Route$16 = createFileRoute("/vendors")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var Route$15 = createFileRoute("/api/convert")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json();
		const result = await ingestConversionCore({
			code: String(body.code ?? ""),
			orderRef: body.orderRef,
			amountNgn: body.amountNgn,
			secret: String(body.secret ?? "")
		});
		return Response.json({
			ok: true,
			...result
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Conversion failed";
		const status = message.includes("Invalid") || message.includes("Unknown") ? 400 : 500;
		return Response.json({
			ok: false,
			error: message
		}, { status });
	}
} } } });
var $$splitComponentImporter$13 = () => import("./dashboard.index-BPbmuY_N.mjs");
var Route$14 = createFileRoute("/dashboard/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./dashboard.admin-sG34k61U.mjs");
var Route$13 = createFileRoute("/dashboard/admin")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./dashboard.affiliate-BPwXCVzJ.mjs");
var Route$12 = createFileRoute("/dashboard/affiliate")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./dashboard.campaigns-kDQrhDS-.mjs");
var Route$11 = createFileRoute("/dashboard/campaigns")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./dashboard.commissions-BSlsn4Nz.mjs");
var Route$10 = createFileRoute("/dashboard/commissions")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./dashboard.links-Cul2oDeF.mjs");
var Route$9 = createFileRoute("/dashboard/links")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./dashboard.notifications-DggHKOJA.mjs");
var Route$8 = createFileRoute("/dashboard/notifications")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./dashboard.offers-D3GAVAKi.mjs");
var Route$7 = createFileRoute("/dashboard/offers")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./dashboard.payouts-CvKdyQMy.mjs");
var Route$6 = createFileRoute("/dashboard/payouts")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./dashboard.referrals-Dqpl965J.mjs");
var Route$5 = createFileRoute("/dashboard/referrals")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./dashboard.settings-IUQZnRw-.mjs");
var Route$4 = createFileRoute("/dashboard/settings")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./dashboard.vendor-BztamfTN.mjs");
var Route$3 = createFileRoute("/dashboard/vendor")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./offers._slug-GI_t7jyv.mjs");
var Route$2 = createFileRoute("/offers/$slug")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./t._code-v6q_1tdO.mjs");
var Route$1 = createFileRoute("/t/$code")({
	loader: async ({ params }) => recordClick({ data: { code: params.code } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$23
});
var DashboardRoute = Route$21.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$23
});
var HowItWorksRoute = Route$20.update({
	id: "/how-it-works",
	path: "/how-it-works",
	getParentRoute: () => Route$23
});
var LoginRoute = Route$19.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$23
});
var MarketplaceRoute = Route$18.update({
	id: "/marketplace",
	path: "/marketplace",
	getParentRoute: () => Route$23
});
var OnboardingRoute = Route$17.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$23
});
var VendorsRoute = Route$16.update({
	id: "/vendors",
	path: "/vendors",
	getParentRoute: () => Route$23
});
var ApiConvertRoute = Route$15.update({
	id: "/api/convert",
	path: "/api/convert",
	getParentRoute: () => Route$23
});
var DashboardIndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var DashboardAdminRoute = Route$13.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => DashboardRoute
});
var DashboardAffiliateRoute = Route$12.update({
	id: "/affiliate",
	path: "/affiliate",
	getParentRoute: () => DashboardRoute
});
var DashboardCampaignsRoute = Route$11.update({
	id: "/campaigns",
	path: "/campaigns",
	getParentRoute: () => DashboardRoute
});
var DashboardCommissionsRoute = Route$10.update({
	id: "/commissions",
	path: "/commissions",
	getParentRoute: () => DashboardRoute
});
var DashboardLinksRoute = Route$9.update({
	id: "/links",
	path: "/links",
	getParentRoute: () => DashboardRoute
});
var DashboardNotificationsRoute = Route$8.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DashboardRoute
});
var DashboardOffersRoute = Route$7.update({
	id: "/offers",
	path: "/offers",
	getParentRoute: () => DashboardRoute
});
var DashboardPayoutsRoute = Route$6.update({
	id: "/payouts",
	path: "/payouts",
	getParentRoute: () => DashboardRoute
});
var DashboardReferralsRoute = Route$5.update({
	id: "/referrals",
	path: "/referrals",
	getParentRoute: () => DashboardRoute
});
var DashboardSettingsRoute = Route$4.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardRoute
});
var DashboardVendorRoute = Route$3.update({
	id: "/vendor",
	path: "/vendor",
	getParentRoute: () => DashboardRoute
});
var OffersSlugRoute = Route$2.update({
	id: "/offers/$slug",
	path: "/offers/$slug",
	getParentRoute: () => Route$23
});
var TCodeRoute = Route$1.update({
	id: "/t/$code",
	path: "/t/$code",
	getParentRoute: () => Route$23
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$23
});
var DashboardRouteChildren = {
	DashboardAdminRoute,
	DashboardAffiliateRoute,
	DashboardCampaignsRoute,
	DashboardCommissionsRoute,
	DashboardLinksRoute,
	DashboardNotificationsRoute,
	DashboardOffersRoute,
	DashboardPayoutsRoute,
	DashboardReferralsRoute,
	DashboardSettingsRoute,
	DashboardVendorRoute,
	DashboardIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren),
	HowItWorksRoute,
	LoginRoute,
	MarketplaceRoute,
	OnboardingRoute,
	VendorsRoute,
	ApiConvertRoute,
	OffersSlugRoute,
	TCodeRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { savePlatformSettings as C, submitVendorApplication as D, submitProduct as E, uploadProductImage as O, savePayoutProfile as S, saveVendorProfile as T, getReferrals as _, Route$19 as a, reviewProduct as b, completeOnboarding as c, getCampaignBySlug as d, getDashboard as f, getPlatformStats as g, getPayouts as h, Route$18 as i, createProduct as l, getMyProfile as m, Route$1 as n, adminSettlePayout as o, getMarketplace as p, Route$2 as r, assertDeskAccess as s, router_exports as t, getAdminDesk as u, markNotificationsRead as v, saveProduct as w, reviewVendorApplication as x, requestPayout as y };
