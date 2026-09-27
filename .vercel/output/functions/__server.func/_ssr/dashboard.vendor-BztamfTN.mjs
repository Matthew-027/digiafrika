import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { a as formatNumber, r as formatMoney, t as formatDate } from "./format-DUFBhTUp.mjs";
import { a as vendorCanSubmit, i as vendorCanPublish, r as vendorCanEdit, t as VENDOR_STATUS_COPY } from "./vendor-BTHRHLIA.mjs";
import { r as PRODUCT_STATUS_COPY } from "./product-CDkg8sUW.mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { t as Badge } from "./badge-BflTX_CK.mjs";
import { n as Label, t as Input } from "./label-C70zC-P-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
import { t as Select } from "./select-D2moOl-H.mjs";
import { t as Textarea } from "./textarea-BnDEs-G6.mjs";
import { n as COUNTRIES, t as CATEGORIES } from "./types-BgG5KufT.mjs";
import { t as StatCard } from "./stat-card-CgLHJCvr.mjs";
import { D as submitVendorApplication, T as saveVendorProfile } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.vendor-BztamfTN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VendorRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "vendor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorHome, {})
	});
}
function statusTone(status) {
	if (status === "approved") return "ok";
	if (status === "rejected" || status === "suspended") return "warn";
	if (status === "pending_review") return "gold";
	return "muted";
}
function VendorHome() {
	const { data } = useDash();
	const vendor = data.vendorProfile;
	const products = data.vendorCampaigns;
	const approvedCount = products.filter((c) => c.status === "approved").length;
	const pendingCount = products.filter((c) => c.status === "pending_review").length;
	const approved = vendor ? vendorCanPublish(vendor.status) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Vendor",
			title: "Vendor Dashboard",
			description: "Verification first. Create products only after Admin approves this store."
		}),
		vendor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, { vendor }) : null,
		vendor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorApplicationForm, { vendor }) : null,
		approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Approved products",
						value: formatNumber(approvedCount),
						hint: `${products.length} total`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending review",
						value: formatNumber(pendingCount),
						hint: "Waiting on Admin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Drafts",
						value: formatNumber(products.filter((c) => c.status === "draft").length),
						hint: "Not submitted"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Your products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "gold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/campaigns",
						children: "Manage products"
					})
				})]
			}),
			products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No products yet",
					body: "Create a draft, then submit it for Admin review before it can appear in the marketplace.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "gold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/campaigns",
							children: "Create product"
						})
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: products.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: c.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							formatMoney(c.priceAmount, c.currency),
							" ·",
							" ",
							c.commissionType === "fixed" ? `${formatMoney(c.commissionValue, c.currency)} commission` : `${c.commissionValue}% commission`
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: c.status === "approved" ? "ok" : c.status === "pending_review" ? "gold" : c.status === "rejected" ? "warn" : "muted",
						children: PRODUCT_STATUS_COPY[c.status].label
					})]
				}, c.id))
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 text-sm text-muted-foreground",
			children: [
				"Product tools stay closed until this application is approved.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/campaigns",
					className: "text-gold hover:underline",
					children: "Products page"
				})
			]
		})
	] });
}
function StatusCard({ vendor }) {
	const copy = VENDOR_STATUS_COPY[vendor.status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: statusTone(vendor.status),
					children: copy.label
				}), vendor.submittedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: ["Submitted ", formatDate(vendor.submittedAt)]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-6",
				children: copy.message
			}),
			vendor.status === "rejected" && vendor.reviewNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 rounded-[10px] border border-border bg-secondary px-3 py-2 text-sm",
				children: ["Reason: ", vendor.reviewNote]
			}) : null,
			vendor.status === "suspended" && vendor.reviewNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 rounded-[10px] border border-border bg-secondary px-3 py-2 text-sm",
				children: ["Reason: ", vendor.reviewNote]
			}) : null,
			vendor.storeName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: [
					vendor.storeName,
					vendor.category ? ` · ${vendor.category}` : "",
					vendor.country ? ` · ${vendor.country}` : ""
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Next action: fill in your store profile below."
			})
		]
	});
}
function VendorApplicationForm({ vendor }) {
	const { data, reload } = useDash();
	const editable = vendorCanEdit(vendor.status);
	const canSubmit = vendorCanSubmit(vendor.status);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		storeName: vendor.storeName,
		description: vendor.description,
		country: vendor.country || data.profile.country,
		contactEmail: vendor.contactEmail || data.profile.email || "",
		contactPhone: vendor.contactPhone || data.profile.phone || "",
		category: vendor.category || "Commerce",
		websiteUrl: vendor.websiteUrl || ""
	});
	const payload = {
		storeName: form.storeName.trim(),
		description: form.description.trim(),
		country: form.country,
		contactEmail: form.contactEmail.trim(),
		contactPhone: form.contactPhone.trim() || void 0,
		category: form.category,
		websiteUrl: form.websiteUrl.trim()
	};
	async function save() {
		setBusy("save");
		try {
			await saveVendorProfile({ data: payload });
			toast.success("Store profile saved");
			await reload();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save");
		} finally {
			setBusy(null);
		}
	}
	async function submit() {
		setBusy("submit");
		try {
			await submitVendorApplication({ data: payload });
			toast.success("Application submitted for review");
			await reload();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not submit");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "rounded-xl border border-border bg-card p-5",
		onSubmit: (e) => {
			e.preventDefault();
			canSubmit ? submit() : save();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: "Store profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "No bank details, BVN, or payment credentials. Admin reviews this before you can list offers."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "storeName",
							children: "Business / store name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "storeName",
							value: form.storeName,
							disabled: !editable,
							onChange: (e) => setForm({
								...form,
								storeName: e.target.value
							}),
							required: true,
							minLength: 2
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "description",
							children: "Business description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "description",
							value: form.description,
							disabled: !editable,
							onChange: (e) => setForm({
								...form,
								description: e.target.value
							}),
							required: true,
							minLength: 20
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "country",
							children: "Country"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							id: "country",
							value: form.country,
							disabled: !editable,
							onChange: (e) => setForm({
								...form,
								country: e.target.value
							}),
							children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.code,
								children: c.label
							}, c.code))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "category",
							children: "Business category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							id: "category",
							value: form.category,
							disabled: !editable,
							onChange: (e) => setForm({
								...form,
								category: e.target.value
							}),
							children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contactEmail",
							children: "Contact email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "contactEmail",
							type: "email",
							value: form.contactEmail,
							disabled: !editable,
							onChange: (e) => setForm({
								...form,
								contactEmail: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contactPhone",
							children: "Contact phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "contactPhone",
							value: form.contactPhone,
							disabled: !editable,
							onChange: (e) => setForm({
								...form,
								contactPhone: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "websiteUrl",
							children: "Website or social link (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "websiteUrl",
							type: "url",
							placeholder: "https://",
							value: form.websiteUrl,
							disabled: !editable,
							onChange: (e) => setForm({
								...form,
								websiteUrl: e.target.value
							})
						})]
					})
				]
			}),
			editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					disabled: Boolean(busy),
					onClick: () => void save(),
					children: busy === "save" ? "Saving…" : "Save draft"
				}), canSubmit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "gold",
					disabled: Boolean(busy),
					children: busy === "submit" ? "Submitting…" : vendor.status === "rejected" ? "Resubmit for review" : "Submit application"
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "This store cannot be edited while suspended."
			})
		]
	});
}
//#endregion
export { VendorRoute as component };
