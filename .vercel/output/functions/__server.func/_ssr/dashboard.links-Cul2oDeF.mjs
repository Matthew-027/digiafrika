import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { a as formatNumber, c as trackingUrl, i as formatNgn } from "./format-DUFBhTUp.mjs";
import { b as Copy, v as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.links-Cul2oDeF.js
var import_jsx_runtime = require_jsx_runtime();
function LinksRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "affiliate",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinksPage, {})
	});
}
function LinksPage() {
	const { data } = useDash();
	async function copy(code) {
		await navigator.clipboard.writeText(trackingUrl(code));
		toast.success("Tracking link copied");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Tracking",
		title: "Your links",
		description: "Each enrollment has a unique hop. Conversions will post through the production pixel later — simulated sales are disabled."
	}), data.enrollments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No links yet",
		body: "Enroll in a live campaign. Your hop records clicks and waits for the conversion pixel.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard/offers",
				children: "Choose an offer"
			})
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: data.enrollments.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: "rounded-xl border border-border bg-card p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: e.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 break-all font-mono text-xs text-muted-foreground",
						children: trackingUrl(e.trackingCode)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							formatNumber(Number(e.clicks)),
							" clicks · ",
							formatNumber(Number(e.sales)),
							" sales ·",
							" ",
							formatNgn(Number(e.earnedNgn)),
							" earned · ",
							e.commissionPct,
							"% split"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => void copy(e.trackingCode),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/t/$code",
							params: { code: e.trackingCode },
							children: ["Preview hop ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })]
						})
					})]
				})]
			})
		}, e.id))
	})] });
}
//#endregion
export { LinksRoute as component };
