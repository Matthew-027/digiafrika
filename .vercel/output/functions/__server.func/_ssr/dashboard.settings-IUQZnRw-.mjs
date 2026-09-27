import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as DESK_LABEL } from "./roles-DLM0LukR.mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { n as Label, t as Input } from "./label-C70zC-P-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Select } from "./select-D2moOl-H.mjs";
import { n as COUNTRIES, r as PAYOUT_METHODS } from "./types-BgG5KufT.mjs";
import { S as savePayoutProfile } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings-IUQZnRw-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { data, reload } = useDash();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		displayName: data.profile.displayName,
		phone: data.profile.phone ?? "",
		country: data.profile.country,
		payoutMethod: data.profile.payoutMethod ?? "paystack",
		payoutDetails: data.profile.payoutDetails ?? ""
	});
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await savePayoutProfile({ data: {
				displayName: form.displayName.trim(),
				phone: form.phone.trim() || void 0,
				country: form.country,
				payoutMethod: form.payoutMethod,
				payoutDetails: form.payoutDetails.trim() || void 0
			} });
			toast.success("Profile saved");
			await reload();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Account",
			title: "Settings",
			description: data.profile.deskRole === "vendor" ? "Account details for your vendor desk. Pixel secret is for your checkout only." : "Account details for this desk. Platform settings live on the admin desk."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "max-w-xl space-y-4 rounded-xl border border-border bg-card p-5",
			onSubmit: (e) => void onSubmit(e),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "displayName",
						children: "Display name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "displayName",
						value: form.displayName,
						onChange: (e) => setForm({
							...form,
							displayName: e.target.value
						}),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "country",
							children: "Country"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							id: "country",
							value: form.country,
							onChange: (e) => setForm({
								...form,
								country: e.target.value
							}),
							children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.code,
								children: c.label
							}, c.code))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "phone",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "method",
						children: "Preferred rail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "method",
						value: form.payoutMethod,
						onChange: (e) => setForm({
							...form,
							payoutMethod: e.target.value
						}),
						children: PAYOUT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m.id,
							children: m.label
						}, m.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "details",
						children: "Destination details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "details",
						value: form.payoutDetails,
						onChange: (e) => setForm({
							...form,
							payoutDetails: e.target.value
						}),
						placeholder: "Account, MSISDN, or customer code"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Signed in as ", data.profile.email || data.profile.displayName]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Desk: ",
						DESK_LABEL[data.profile.deskRole],
						data.profile.isAdmin ? " — operator access is separate from vendor and affiliate accounts." : " — this account cannot open the other desks."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Saving…" : "Save settings"
				})
			]
		}),
		data.profile.deskRole === "vendor" && data.settings.pixelSecret ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 max-w-xl rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-gold",
					children: "Conversion pixel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						"POST conversions to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "font-mono text-foreground",
							children: "/api/convert"
						}),
						" with this sandbox secret. Replace with a rotated production secret before going live."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 break-all rounded-[10px] border border-border bg-secondary px-3 py-2 font-mono text-xs",
					children: data.settings.pixelSecret
				})
			]
		}) : null
	] });
}
//#endregion
export { SettingsPage as component };
