import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { n as formatDateTime } from "./format-DUFBhTUp.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
import { v as markNotificationsRead } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.notifications-DggHKOJA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InboxPage() {
	const { data, reload } = useDash();
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function markAll() {
		setBusy(true);
		try {
			await markNotificationsRead();
			await reload();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not mark as read");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Inbox",
		title: "Notifications",
		description: "Commissions, payouts, referrals, and campaign events.",
		action: data.unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			disabled: busy,
			onClick: () => void markAll(),
			children: busy ? "Updating…" : "Mark all read"
		}) : null
	}), data.notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Inbox is empty",
		body: "Activity from tracking, sales, and settlement lands here."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: data.notifications.map((n) => {
			const unread = !n.readAt;
			const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: unread ? "rounded-xl border border-gold/40 bg-card p-4" : "rounded-xl border border-border bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: n.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: n.body
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "shrink-0 text-xs text-muted-foreground",
						children: formatDateTime(n.createdAt)
					})]
				})
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: n.href,
				className: "block",
				children: inner
			}) : inner }, n.id);
		})
	})] });
}
//#endregion
export { InboxPage as component };
