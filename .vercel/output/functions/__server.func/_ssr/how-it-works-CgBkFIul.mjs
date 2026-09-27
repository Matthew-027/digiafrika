import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { C as Banknote, c as ShieldCheck, d as Radio, g as Link2 } from "../_libs/lucide-react.mjs";
import { t as MarketingShell } from "./marketing-shell-Ch1FMIoW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/how-it-works-CgBkFIul.js
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	{
		icon: Radio,
		title: "Pick a live offer",
		body: "Filter the marketplace by niche, cookie window, and commission. Every listing shows price, payout, and creatives from the vendor."
	},
	{
		icon: Link2,
		title: "Share a unique link",
		body: "DigiAfrika issues a tracking code per affiliate per campaign. Clicks are logged, cookies last 21–60 days, and the hop tags the vendor URL."
	},
	{
		icon: Banknote,
		title: "Commissions hit the wallet",
		body: "Sandbox sales and production pixels credit the same ledger. Referral overrides pay the person who invited you."
	},
	{
		icon: ShieldCheck,
		title: "Request settlement",
		body: "Paystack, Flutterwave, M-Pesa, or Nigerian bank transfer. Operators approve the queue. Live keys slot into the same payload."
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketingShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "bg-forest-deep text-cream",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-16 md:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-gold",
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl",
						children: "A desk for promoting African digital products — not another link shortener."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl text-cream/75",
						children: "Affiliates promote. Vendors list. Operators settle. Tracking, commissions, and payouts live in one ledger with local-rail placeholders ready for production keys."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "kente-band h-2" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-2",
			children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-border bg-cream p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 place-items-center rounded-[10px] bg-forest text-cream",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-xl font-semibold",
						children: step.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: step.body
					})
				]
			}, step.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-paper-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-forest",
						children: "Tracking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold",
						children: "Pixel-ready conversions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: [
							"Production checkouts POST to the convert endpoint with the affiliate code, order reference, amount, and the workspace pixel secret. The sandbox hop at",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
								className: "font-mono text-ink",
								children: ["/t/", "{code}"]
							}),
							" records the click first."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-xl border border-border bg-ink p-5 font-mono text-xs leading-relaxed text-cream",
					children: `POST /api/convert
{
  "code": "da••••",
  "orderRef": "ORD-1042",
  "amountNgn": 45000,
  "secret": "digiafrika_sandbox_pixel"
}`
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-forest-deep px-6 py-10 text-cream md:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-semibold",
						children: "Open a desk in a minute."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-cream/70",
						children: "First account on a new workspace is the operator. Promote a live offer or list your own."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: {
									join: "1",
									ref: void 0
								},
								children: "Join free"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "border-cream/30 text-cream hover:bg-cream/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/marketplace",
								children: "Browse offers"
							})
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { HowItWorks as component };
