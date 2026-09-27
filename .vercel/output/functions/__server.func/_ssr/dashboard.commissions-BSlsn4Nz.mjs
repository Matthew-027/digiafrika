import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { i as formatNgn, n as formatDateTime } from "./format-DUFBhTUp.mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { t as Badge } from "./badge-BflTX_CK.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.commissions-BSlsn4Nz.js
var import_jsx_runtime = require_jsx_runtime();
function CommissionsRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "affiliate",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommissionsPage, {})
	});
}
function CommissionsPage() {
	const { data } = useDash();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Ledger",
		title: "Commissions",
		description: "Approved commissions credit available balance immediately in this sandbox."
	}), data.commissions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No commissions yet",
		body: "Promote a link and simulate a sale, or wait for a production pixel POST."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "min-w-[640px] w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Campaign"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Amount"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "When"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.commissions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: c.campaignTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 tabular font-medium",
						children: formatNgn(Number(c.amountNgn))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: c.status === "approved" || c.status === "paid" ? "ok" : "muted",
							children: c.status
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: formatDateTime(c.createdAt)
					})
				]
			}, c.id)) })]
		})
	})] });
}
//#endregion
export { CommissionsRoute as component };
