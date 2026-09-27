import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { f as Radar, h as Megaphone, n as Wallet, p as Percent } from "../_libs/lucide-react.mjs";
import { t as MarketingShell } from "./marketing-shell-Ch1FMIoW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendors-DER5OZZt.js
var import_jsx_runtime = require_jsx_runtime();
var points = [
	{
		icon: Megaphone,
		title: "List in minutes",
		body: "Title, price, commission, cookie window, landing URL, and creatives. Campaigns go live on the marketplace immediately."
	},
	{
		icon: Percent,
		title: "You set the split",
		body: "Commission from 0–90%. Affiliates see exactly what they earn in Naira before they promote."
	},
	{
		icon: Radar,
		title: "See who is selling",
		body: "Clicks and sales roll up on the vendor desk. Pause a campaign without deleting tracking history."
	},
	{
		icon: Wallet,
		title: "Keep the remainder",
		body: "After affiliate commission and the platform fee, vendor share credits the same wallet used for payouts."
	}
];
function Vendors() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketingShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-ink text-cream",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-gold",
						children: "For vendors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl",
						children: "Put your digital product in front of African affiliates who already know WhatsApp."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-cream/75",
						children: "Courses, software, and kits priced in Naira. DigiAfrika handles tracking links, commission math, and the settlement queue so you can stay on the product."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "gold",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: {
									join: "1",
									ref: void 0
								},
								children: "List a campaign"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							className: "border-cream/30 text-cream hover:bg-cream/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/how-it-works",
								children: "See the pixel"
							})
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "md:col-span-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-cream/15 bg-forest-deep p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-gold",
							children: "Typical split"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Customer pays",
									value: "₦45,000"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Affiliate (55%)",
									value: "₦24,750"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Platform fee (5%)",
									value: "₦2,250"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Vendor remainder",
									value: "₦18,000"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-cream/60",
							children: "Figures follow the Naira Masterclass demo offer. Your campaign sets its own commission."
						})
					]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "kente-band h-2" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2",
		children: points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl border border-border bg-cream p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(point.icon, { className: "size-5 text-forest" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-xl font-semibold",
					children: point.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: point.body
				})
			]
		}, point.title))
	})] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-cream/10 pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-cream/70",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular font-medium",
			children: value
		})]
	});
}
//#endregion
export { Vendors as component };
