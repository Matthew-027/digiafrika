import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { s as referralUrl, t as formatDate } from "./format-DUFBhTUp.mjs";
import { b as Copy } from "../_libs/lucide-react.mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
import { t as StatCard } from "./stat-card-CgLHJCvr.mjs";
import { _ as getReferrals } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.referrals-Dqpl965J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReferralsRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "affiliate",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralsPage, {})
	});
}
function ReferralsPage() {
	const { data } = useDash();
	const [info, setInfo] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getReferrals().then(setInfo);
	}, [data.referralCount]);
	const code = info?.code ?? data.profile.referralCode;
	const percent = info?.percent ?? data.settings.referralPct;
	const people = info?.people ?? [];
	async function copy() {
		await navigator.clipboard.writeText(referralUrl(code));
		toast.success("Referral link copied");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Growth",
			title: "Referrals",
			description: `You earn a ${percent}% override on commissions from affiliates who join with your code.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Your code",
				value: code,
				hint: "Share with new affiliates and vendors"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Joined",
				value: String(people.length),
				hint: `${percent}% override on their sales`
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "break-all font-mono text-xs text-muted-foreground",
				children: referralUrl(code)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => void copy(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy link"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-lg font-semibold",
			children: "People you invited"
		}),
		people.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No referrals yet",
				body: "Share your code. When they sell, a percentage of their commission credits your wallet."
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
			children: people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: p.displayName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: p.country
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: formatDate(p.createdAt)
				})]
			}, `${p.displayName}-${p.createdAt}`))
		})
	] });
}
//#endregion
export { ReferralsRoute as component };
