import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { i as formatNgn, n as formatDateTime, o as payoutMethodLabel } from "./format-DUFBhTUp.mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { t as Badge } from "./badge-BflTX_CK.mjs";
import { n as Label, t as Input } from "./label-C70zC-P-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
import { t as Select } from "./select-D2moOl-H.mjs";
import { r as PAYOUT_METHODS } from "./types-BgG5KufT.mjs";
import { t as StatCard } from "./stat-card-CgLHJCvr.mjs";
import { h as getPayouts, y as requestPayout } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.payouts-CvKdyQMy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PayoutsRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "affiliate",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutsPage, {})
	});
}
function PayoutsPage() {
	const { data, reload } = useDash();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("paystack");
	const [details, setDetails] = (0, import_react.useState)(data.profile.payoutDetails ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getPayouts().then(setRows);
	}, [data.wallet.availableNgn, data.wallet.paidNgn]);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await requestPayout({ data: {
				amountNgn: Number(amount),
				method,
				details: details.trim()
			} });
			toast.success("Payout queued on the sandbox rail");
			setAmount("");
			await reload();
			const next = await getPayouts();
			setRows(next);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not request payout");
		} finally {
			setBusy(false);
		}
	}
	const min = data.settings.minPayoutNgn;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Settlement",
			title: "Payouts",
			description: `Minimum ${formatNgn(min)}. Paystack, Flutterwave, and M-Pesa accept the same payload — swap live keys before production.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Available",
					value: formatNgn(Number(data.wallet.availableNgn))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Paid",
					value: formatNgn(Number(data.wallet.paidNgn))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Lifetime",
					value: formatNgn(Number(data.wallet.lifetimeNgn))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2",
			onSubmit: (e) => void onSubmit(e),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "amount",
						children: "Amount (NGN)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "amount",
						type: "number",
						min,
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "method",
						children: "Rail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "method",
						value: method,
						onChange: (e) => setMethod(e.target.value),
						children: PAYOUT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m.id,
							children: m.label
						}, m.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "details",
						children: "Destination"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "details",
						value: details,
						onChange: (e) => setDetails(e.target.value),
						placeholder: "Paystack customer code, M-Pesa MSISDN, or bank + account",
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Submitting…" : "Request payout"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-lg font-semibold",
			children: "History"
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No payouts yet",
				body: "Earn commissions, then request settlement on a sandbox rail."
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 overflow-x-auto rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "min-w-[640px] w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Amount"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Rail"
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular",
							children: formatNgn(Number(p.amountNgn))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: payoutMethodLabel(p.method)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: p.status === "paid" ? "ok" : p.status === "rejected" ? "warn" : "muted",
								children: p.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: formatDateTime(p.createdAt)
						})
					]
				}, p.id)) })]
			})
		})
	] });
}
//#endregion
export { PayoutsRoute as component };
