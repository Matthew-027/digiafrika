import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-CmheKJRZ.mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { i as formatNgn, o as payoutMethodLabel, r as formatMoney, t as formatDate } from "./format-DUFBhTUp.mjs";
import { t as VENDOR_STATUS_COPY } from "./vendor-BTHRHLIA.mjs";
import { a as PRODUCT_TYPE_LABEL, r as PRODUCT_STATUS_COPY } from "./product-CDkg8sUW.mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { t as Badge } from "./badge-BflTX_CK.mjs";
import { n as Label, t as Input } from "./label-C70zC-P-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { C as savePlatformSettings, b as reviewProduct, o as adminSettlePayout, u as getAdminDesk, x as reviewVendorApplication } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.admin-sG34k61U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center gap-1 rounded-[12px] bg-secondary p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-9 items-center rounded-[10px] px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-cream data-[state=active]:text-foreground", className),
		...props
	});
}
var TabsContent = Content;
function AdminRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDesk, {})
	});
}
function AdminDesk() {
	const { data } = useDash();
	const [desk, setDesk] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getAdminDesk().then((next) => {
			if (cancelled) return;
			setDesk(next);
			setError(null);
		}).catch((err) => {
			if (!cancelled) setError(err instanceof Error ? err.message : "Access denied");
		});
		return () => {
			cancelled = true;
		};
	}, [data.profile.userId]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Operator",
		title: "Admin Dashboard"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: error
	})] });
	if (!desk) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Operator",
		title: "Admin Dashboard",
		description: "Vendor applications, product review, members, settlement queue, and platform knobs."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "vendors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "flex h-auto flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "vendors",
						children: "Vendors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "products",
						children: "Products"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "payouts",
						children: "Payouts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "users",
						children: "Members"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "settings",
						children: "Settings"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "vendors",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorApplications, {
					rows: desk.vendorApplications,
					onDone: () => void getAdminDesk().then(setDesk)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "products",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductReview, {
					rows: desk.campaigns,
					onDone: () => void getAdminDesk().then(setDesk)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "payouts",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutQueue, {
					rows: desk.payouts,
					onDone: () => void getAdminDesk().then(setDesk)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "users",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[640px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Roles"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Country"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Joined"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: desk.users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: u.displayName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: u.roles
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: u.country
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: formatDate(u.createdAt)
								})
							]
						}, u.userId)) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "settings",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsForm, {
					initial: desk.settings,
					onDone: () => void getAdminDesk().then(setDesk)
				})
			})
		]
	})] });
}
function VendorApplications({ rows, onDone }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const visible = rows.filter((row) => filter === "all" ? true : row.status === filter);
	async function act(userId, action) {
		setBusy(`${userId}-${action}`);
		try {
			await reviewVendorApplication({ data: {
				userId,
				action,
				reason: reason.trim() || void 0
			} });
			toast.success(action === "approve" ? "Vendor approved" : action === "reject" ? "Vendor rejected" : "Vendor suspended");
			setReason("");
			onDone();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Access denied");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				"all",
				"pending_review",
				"approved",
				"rejected",
				"suspended"
			].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: filter === key ? "gold" : "outline",
				onClick: () => setFilter(key),
				children: key === "all" ? "All" : VENDOR_STATUS_COPY[key].label
			}, key))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full sm:max-w-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "reviewReason",
				children: "Reject / suspend reason (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "reviewReason",
				className: "mt-1",
				value: reason,
				onChange: (e) => setReason(e.target.value),
				placeholder: "Shown to the vendor"
			})]
		})]
	}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No vendor applications in this filter."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "min-w-[880px] w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Vendor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Store"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Country"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Submitted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: row.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: row.email || row.userId
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: row.storeName || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: row.country
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: row.category || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: row.submittedAt ? formatDate(row.submittedAt) : "Not submitted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: row.status === "approved" ? "ok" : row.status === "pending_review" ? "gold" : row.status === "rejected" || row.status === "suspended" ? "warn" : "muted",
							children: VENDOR_STATUS_COPY[row.status].label
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								row.status === "pending_review" || row.status === "suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: busy === `${row.userId}-approve`,
									onClick: () => void act(row.userId, "approve"),
									children: "Approve"
								}) : null,
								row.status === "pending_review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: busy === `${row.userId}-reject`,
									onClick: () => void act(row.userId, "reject"),
									children: "Reject"
								}) : null,
								row.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: busy === `${row.userId}-suspend`,
									onClick: () => void act(row.userId, "suspend"),
									children: "Suspend"
								}) : null
							]
						})
					})
				]
			}, row.userId)) })]
		})
	})] });
}
function PayoutQueue({ rows, onDone }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	async function settle(id, status) {
		setBusy(id);
		try {
			await adminSettlePayout({ data: {
				id,
				status
			} });
			toast.success(status === "paid" ? "Marked paid" : "Payout returned");
			onDone();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Access denied");
		} finally {
			setBusy(null);
		}
	}
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No payout requests in the queue."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "min-w-[720px] w-full text-sm",
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
						children: "Destination"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "When"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 tabular font-medium",
						children: formatNgn(Number(p.amountNgn))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: payoutMethodLabel(p.method)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "max-w-[220px] truncate px-4 py-3 text-muted-foreground",
						children: p.details
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
						children: formatDate(p.createdAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: p.status === "processing" || p.status === "requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: busy === p.id,
								onClick: () => void settle(p.id, "paid"),
								children: "Pay"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy === p.id,
								onClick: () => void settle(p.id, "rejected"),
								children: "Reject"
							})]
						}) : null
					})
				]
			}, p.id)) })]
		})
	});
}
function ProductReview({ rows, onDone }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const visible = rows.filter((row) => !row.isDemo && (filter === "all" ? true : row.status === filter));
	async function act(id, action) {
		setBusy(`${id}-${action}`);
		try {
			await reviewProduct({ data: {
				id,
				action,
				reason: reason.trim() || void 0
			} });
			toast.success(action === "approve" ? "Product approved" : action === "reject" ? "Product rejected" : "Product suspended");
			setReason("");
			onDone();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Access denied");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				"all",
				"pending_review",
				"approved",
				"rejected",
				"suspended",
				"draft"
			].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: filter === key ? "gold" : "outline",
				onClick: () => setFilter(key),
				children: key === "all" ? "All" : PRODUCT_STATUS_COPY[key].label
			}, key))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full sm:max-w-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "productReason",
				children: "Reject / suspend reason (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "productReason",
				className: "mt-1",
				value: reason,
				onChange: (e) => setReason(e.target.value),
				placeholder: "Shown to the vendor"
			})]
		})]
	}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No products in this filter."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "min-w-[960px] w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Product"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Vendor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Price"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Commission"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Submitted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 font-medium",
						children: row.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: row.vendorName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: PRODUCT_TYPE_LABEL[row.productType]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 tabular",
						children: formatMoney(row.priceAmount, row.currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 tabular",
						children: row.commissionType === "fixed" ? formatMoney(row.commissionValue, row.currency) : `${row.commissionValue}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: row.submittedAt ? formatDate(row.submittedAt) : "Not submitted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: row.status === "approved" ? "ok" : row.status === "pending_review" ? "gold" : row.status === "rejected" || row.status === "suspended" ? "warn" : "muted",
							children: PRODUCT_STATUS_COPY[row.status].label
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								row.status === "pending_review" || row.status === "suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: busy === `${row.id}-approve`,
									onClick: () => void act(row.id, "approve"),
									children: "Approve"
								}) : null,
								row.status === "pending_review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: busy === `${row.id}-reject`,
									onClick: () => void act(row.id, "reject"),
									children: "Reject"
								}) : null,
								row.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: busy === `${row.id}-suspend`,
									onClick: () => void act(row.id, "suspend"),
									children: "Suspend"
								}) : null
							]
						})
					})
				]
			}, row.id)) })]
		})
	})] });
}
function SettingsForm({ initial, onDone }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		minPayoutNgn: String(initial.minPayoutNgn),
		cookieDays: String(initial.cookieDays),
		referralPct: String(initial.referralPct),
		platformFeePct: String(initial.platformFeePct)
	});
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await savePlatformSettings({ data: {
				minPayoutNgn: Number(form.minPayoutNgn),
				cookieDays: Number(form.cookieDays),
				referralPct: Number(form.referralPct),
				platformFeePct: Number(form.platformFeePct)
			} });
			toast.success("Platform settings saved");
			onDone();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Access denied");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "max-w-xl space-y-4 rounded-xl border border-border bg-card p-5",
		onSubmit: (e) => void onSubmit(e),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "minPayout",
						children: "Minimum payout (NGN)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "minPayout",
						type: "number",
						min: 0,
						value: form.minPayoutNgn,
						onChange: (e) => setForm({
							...form,
							minPayoutNgn: e.target.value
						}),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cookieDays",
						children: "Default cookie (days)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cookieDays",
						type: "number",
						min: 1,
						max: 90,
						value: form.cookieDays,
						onChange: (e) => setForm({
							...form,
							cookieDays: e.target.value
						}),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "referralPct",
						children: "Referral override (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "referralPct",
						type: "number",
						min: 0,
						max: 50,
						value: form.referralPct,
						onChange: (e) => setForm({
							...form,
							referralPct: e.target.value
						}),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "platformFee",
						children: "Platform fee (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "platformFee",
						type: "number",
						min: 0,
						max: 40,
						value: form.platformFeePct,
						onChange: (e) => setForm({
							...form,
							platformFeePct: e.target.value
						}),
						required: true
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			disabled: busy,
			children: busy ? "Saving…" : "Save settings"
		})]
	});
}
//#endregion
export { AdminRoute as component };
