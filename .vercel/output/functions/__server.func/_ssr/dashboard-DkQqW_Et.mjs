import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as DESK_LABEL, t as DESK_HOME } from "./roles-DLM0LukR.mjs";
import { n as cn } from "./utils-CmheKJRZ.mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as UserButton } from "./gates-B9YfLDZP.mjs";
import { n as useDash, t as DashboardGate } from "./dash-context-B75R4djK.mjs";
import { i as formatNgn } from "./format-DUFBhTUp.mjs";
import { t as Logo } from "./logo-JHktN6y8.mjs";
import { S as Bell, _ as LayoutDashboard, a as Store, g as Link2, h as Megaphone, l as Settings, n as Wallet, o as Shield, r as Users, y as CreditCard } from "../_libs/lucide-react.mjs";
import { i as SheetTrigger, n as SheetContent, r as SheetTitle, t as Sheet } from "./sheet-BIitNTKU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DkQqW_Et.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var navByDesk = {
	admin: [
		{
			to: "/dashboard/admin",
			label: "Admin Dashboard",
			icon: Shield
		},
		{
			to: "/dashboard/notifications",
			label: "Inbox",
			icon: Bell
		},
		{
			to: "/dashboard/settings",
			label: "Settings",
			icon: Settings
		}
	],
	vendor: [
		{
			to: "/dashboard/vendor",
			label: "Vendor Dashboard",
			icon: LayoutDashboard
		},
		{
			to: "/dashboard/campaigns",
			label: "Products",
			icon: Megaphone
		},
		{
			to: "/dashboard/notifications",
			label: "Inbox",
			icon: Bell
		},
		{
			to: "/dashboard/settings",
			label: "Settings",
			icon: Settings
		}
	],
	affiliate: [
		{
			to: "/dashboard/affiliate",
			label: "Affiliate Dashboard",
			icon: LayoutDashboard
		},
		{
			to: "/dashboard/offers",
			label: "Marketplace",
			icon: Store
		},
		{
			to: "/dashboard/links",
			label: "Links",
			icon: Link2
		},
		{
			to: "/dashboard/commissions",
			label: "Commissions",
			icon: Wallet
		},
		{
			to: "/dashboard/payouts",
			label: "Payouts",
			icon: CreditCard
		},
		{
			to: "/dashboard/referrals",
			label: "Referrals",
			icon: Users
		},
		{
			to: "/dashboard/notifications",
			label: "Inbox",
			icon: Bell
		},
		{
			to: "/dashboard/settings",
			label: "Settings",
			icon: Settings
		}
	]
};
function Nav({ onGo }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { data } = useDash();
	const visible = navByDesk[data.profile.deskRole];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: visible.map((item) => {
			const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onGo,
				className: cn("flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-medium", active ? "bg-gold text-ink" : "text-cream/80 hover:bg-secondary hover:text-cream"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
					item.label,
					item.to === "/dashboard/notifications" && data.unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto tabular text-xs",
						children: data.unread
					}) : null
				]
			}, item.to);
		})
	});
}
function DashboardShell({ children }) {
	const { data } = useDash();
	const [open, setOpen] = (0, import_react.useState)(false);
	const desk = data.profile.deskRole;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dash-shell min-h-dvh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh max-w-[1400px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border p-4 lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "text-cream" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto rounded-[12px] border border-border bg-secondary p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Available"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular font-display text-xl",
							children: formatNgn(Number(data.wallet.availableNgn))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-16 items-center justify-between gap-3 border-b border-border px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								className: "grid h-11 w-11 place-items-center rounded-[10px] lg:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { markOnly: true })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								className: "dash-shell bg-paper text-cream",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "text-cream",
									children: "Desk"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, { onGo: () => setOpen(false) })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular text-sm lg:hidden",
							children: formatNgn(Number(data.wallet.availableNgn))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden text-sm text-muted-foreground lg:block",
							children: [
								data.profile.displayName,
								" · ",
								DESK_LABEL[desk]
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: DESK_HOME[desk],
									children: DESK_LABEL[desk]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 md:p-6",
					children
				})]
			})]
		})
	});
}
function DashboardLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) });
}
//#endregion
export { DashboardLayout as component };
