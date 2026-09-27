import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { n as UserButton } from "./gates-B9YfLDZP.mjs";
import { t as Logo } from "./logo-JHktN6y8.mjs";
import { m as Menu } from "../_libs/lucide-react.mjs";
import { i as SheetTrigger, n as SheetContent, r as SheetTitle, t as Sheet } from "./sheet-BIitNTKU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketing-shell-Ch1FMIoW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-ink text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "text-cream" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-sm leading-relaxed text-cream/70",
							children: "The affiliate desk for African digital products. Vendors list campaigns. Affiliates track, earn, and get paid on local rails."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-gold",
						children: "Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/marketplace",
								className: "hover:text-gold",
								children: "Marketplace"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/how-it-works",
								className: "hover:text-gold",
								children: "How it works"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/vendors",
								className: "hover:text-gold",
								children: "Vendors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: {
									join: void 0,
									ref: void 0
								},
								className: "hover:text-gold",
								children: "Sign in"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-gold",
						children: "Rails"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-cream/70",
						children: "Paystack, Flutterwave, and M-Pesa placeholders are wired for sandbox settlement. Swap in live keys before production payouts."
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "kente-band h-1.5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl justify-between px-4 py-4 text-xs text-cream/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" DigiAfrika"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lagos · Nairobi · Accra" })]
			})
		]
	});
}
function AuthSlot({ dark }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-24 animate-pulse rounded-[10px] bg-secondary" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard",
			className: dark ? "text-sm font-medium text-cream/80 hover:text-gold" : "text-sm font-medium text-forest hover:text-ink",
			children: "Desk"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			search: {
				join: void 0,
				ref: void 0
			},
			className: dark ? "inline-flex h-11 items-center rounded-[10px] px-3 text-sm font-medium text-cream" : "inline-flex h-11 items-center rounded-[10px] px-3 text-sm font-medium",
			children: "Sign in"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			search: {
				join: "1",
				ref: void 0
			},
			className: "inline-flex h-11 items-center rounded-[10px] bg-gold px-4 text-sm font-semibold text-ink",
			children: "Join free"
		})]
	});
}
var links = [
	{
		to: "/marketplace",
		label: "Marketplace"
	},
	{
		to: "/how-it-works",
		label: "How it works"
	},
	{
		to: "/vendors",
		label: "For vendors"
	}
];
function SiteHeader({ inverted }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: inverted ? "border-b border-cream/10 bg-forest-deep text-cream" : "border-b border-border bg-paper/90 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex min-w-0 items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: inverted ? "text-cream" : "" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "ml-auto hidden items-center gap-6 md:flex",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: inverted ? "text-sm font-medium text-cream/80 hover:text-gold" : "text-sm font-medium text-muted hover:text-ink",
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, { dark: inverted })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTrigger, {
						className: "ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-[10px] md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Open menu"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "DigiAfrika" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							onClick: () => setOpen(false),
							className: "flex h-11 items-center rounded-[10px] px-2 text-sm font-medium",
							children: l.label
						}, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})]
					})] })]
				})
			]
		})
	});
}
function MarketingShell({ children, invertedHeader }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { inverted: invertedHeader }),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { MarketingShell as t };
