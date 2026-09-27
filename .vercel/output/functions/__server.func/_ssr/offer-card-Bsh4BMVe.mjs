import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatMoney } from "./format-DUFBhTUp.mjs";
import { w as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { a as PRODUCT_TYPE_LABEL } from "./product-CDkg8sUW.mjs";
import { t as Badge } from "./badge-BflTX_CK.mjs";
import { r as commissionPayout } from "./marketplace-BI8vvxl1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/offer-card-Bsh4BMVe.js
var import_jsx_runtime = require_jsx_runtime();
var tones = {
	Finance: "from-forest to-forest-deep",
	Education: "from-gold-deep to-ink",
	Software: "from-ink-soft to-forest-deep",
	Health: "from-leaf to-forest-deep",
	Commerce: "from-gold to-forest",
	Creative: "from-forest-deep to-ink",
	AI: "from-ink to-leaf",
	Career: "from-leaf to-ink",
	Business: "from-forest to-ink",
	Lifestyle: "from-gold to-ink",
	Services: "from-leaf to-forest"
};
function OfferCard({ offer }) {
	const payout = commissionPayout(offer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/offers/$slug",
		params: { slug: offer.slug },
		className: "group flex flex-col overflow-hidden rounded-xl border border-border bg-cream shadow-[var(--shadow-soft)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `relative h-28 overflow-hidden bg-linear-to-br ${tones[offer.category] ?? "from-forest to-ink"}`,
			children: [
				offer.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: offer.imageUrl,
					alt: "",
					className: "absolute inset-0 h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(135deg,transparent_0_10px,rgb(255_255_255/0.12)_10px_12px)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "gold",
					className: "absolute left-3 top-3",
					children: offer.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute bottom-3 right-3 font-mono text-xs text-cream/90",
					children: offer.commissionType === "fixed" ? formatMoney(offer.commissionValue, offer.currency) : `${offer.commissionValue}%`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold leading-snug group-hover:text-forest",
					children: offer.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: offer.tagline
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						PRODUCT_TYPE_LABEL[offer.productType],
						" · ",
						offer.storeName
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between border-t border-border pt-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "You earn"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular font-semibold",
							children: formatMoney(payout, offer.currency)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted",
								children: "Price"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "tabular text-sm",
								children: formatMoney(offer.priceAmount, offer.currency)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 text-forest" })
					]
				})
			]
		})]
	});
}
//#endregion
export { OfferCard as t };
