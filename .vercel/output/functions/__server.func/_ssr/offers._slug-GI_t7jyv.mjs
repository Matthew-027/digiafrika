import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { r as formatMoney } from "./format-DUFBhTUp.mjs";
import { x as Check } from "../_libs/lucide-react.mjs";
import { a as PRODUCT_TYPE_LABEL } from "./product-CDkg8sUW.mjs";
import { t as Badge } from "./badge-BflTX_CK.mjs";
import { n as commissionLabel, r as commissionPayout } from "./marketplace-BI8vvxl1.mjs";
import { t as MarketingShell } from "./marketing-shell-Ch1FMIoW.mjs";
import { d as getCampaignBySlug, m as getMyProfile, r as Route$2 } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/offers._slug-GI_t7jyv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OfferPage() {
	const { slug } = Route$2.useParams();
	const { user, isPending } = useCurrentUserState();
	const [offer, setOffer] = (0, import_react.useState)(void 0);
	const [desk, setDesk] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getCampaignBySlug({ data: { slug } }).then(setOffer);
	}, [slug]);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) {
			setDesk(null);
			return;
		}
		getMyProfile().then((profile) => setDesk(profile?.deskRole ?? null));
	}, [user, isPending]);
	if (offer === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-4xl p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-secondary" })
	}) });
	if (!offer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Offer not available"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "This product is not an active marketplace offer. It may be pending review, rejected, suspended, or removed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				variant: "gold",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/marketplace",
					children: "Back to marketplace"
				})
			})
		]
	}) });
	const payout = commissionPayout(offer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-7",
			children: [
				offer.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: offer.imageUrl,
					alt: "",
					className: "mb-6 h-56 w-full rounded-xl object-cover"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: offer.category }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl font-semibold",
					children: offer.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-lg text-muted",
					children: offer.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 leading-relaxed",
					children: offer.description
				}),
				offer.highlights.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 grid gap-2",
					children: offer.highlights.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 text-forest" }), h]
					}, h))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl border border-border bg-cream p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-forest",
						children: "Affiliate terms"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm leading-relaxed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Commission: ",
								commissionLabel(offer),
								" on the listed price."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Cookie window: ",
								offer.cookieDays,
								" days after a tracked click."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Only approved, active vendor products stay listed. If Admin suspends this offer, it leaves the marketplace." })
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "lg:col-span-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-cream p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-muted",
						children: "Vendor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: offer.storeName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 grid grid-cols-2 gap-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase text-muted",
								children: "Price"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular font-semibold",
								children: formatMoney(offer.priceAmount, offer.currency)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase text-muted",
								children: "You earn"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular font-semibold text-forest",
								children: formatMoney(payout, offer.currency)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase text-muted",
								children: "Commission"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: commissionLabel(offer) })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase text-muted",
								children: "Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: PRODUCT_TYPE_LABEL[offer.productType] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-2",
						children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 animate-pulse rounded-[10px] bg-secondary" }) : desk === "affiliate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full",
							variant: "gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/offers",
								children: "Open affiliate marketplace"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: "Tracking links and applications open in the next step. Review the offer here first."
						})] }) : desk === "vendor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Vendors list products from the Vendor desk. Affiliate tools are separate."
						}) : desk === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/admin",
								children: "Review in Admin"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full",
							variant: "gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: {
									join: "1",
									ref: void 0
								},
								children: "Join as affiliate to promote"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: "Sign in with an Affiliate desk to continue. Applications and tracking links are not live yet."
						})] })
					})
				]
			})
		})]
	}) });
}
//#endregion
export { OfferPage as component };
