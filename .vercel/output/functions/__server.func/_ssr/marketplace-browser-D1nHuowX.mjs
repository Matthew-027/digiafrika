import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-CmheKJRZ.mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { u as Search } from "../_libs/lucide-react.mjs";
import { a as PRODUCT_TYPE_LABEL, i as PRODUCT_TYPES, t as COMMISSION_TYPES } from "./product-CDkg8sUW.mjs";
import { n as Label, t as Input } from "./label-C70zC-P-.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
import { t as Select } from "./select-D2moOl-H.mjs";
import { t as CATEGORIES } from "./types-BgG5KufT.mjs";
import { i as isProductTypeFilter, t as MARKETPLACE_SORTS } from "./marketplace-BI8vvxl1.mjs";
import { t as OfferCard } from "./offer-card-Bsh4BMVe.mjs";
import { p as getMarketplace } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-browser-D1nHuowX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toQuery(search) {
	const min = search.minPrice ? Number(search.minPrice) : void 0;
	const max = search.maxPrice ? Number(search.maxPrice) : void 0;
	return {
		q: search.q,
		category: search.category,
		productType: isProductTypeFilter(search.productType) ? search.productType : void 0,
		commissionType: search.commissionType === "percent" || search.commissionType === "fixed" ? search.commissionType : void 0,
		minPrice: Number.isFinite(min) ? min : void 0,
		maxPrice: Number.isFinite(max) ? max : void 0,
		sort: search.sort ?? "newest",
		page: search.page ?? 1
	};
}
function MarketplaceBrowser({ value, onChange, tone = "public" }) {
	const [pageData, setPageData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const query = toQuery(value);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		getMarketplace({ data: query }).then((next) => {
			if (cancelled) return;
			setPageData(next);
			setLoading(false);
		}).catch((err) => {
			if (cancelled) return;
			setError(err instanceof Error ? err.message : "Could not load marketplace");
			setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		query.q,
		query.category,
		query.productType,
		query.commissionType,
		query.minPrice,
		query.maxPrice,
		query.sort,
		query.page
	]);
	const items = pageData?.items ?? [];
	const total = pageData?.total ?? 0;
	const page = pageData?.page ?? query.page ?? 1;
	const pageSize = pageData?.pageSize ?? 20;
	const pages = Math.max(1, Math.ceil(total / pageSize));
	const filtered = Boolean(query.q || query.category || query.productType || query.commissionType || query.minPrice != null || query.maxPrice != null);
	const pillOn = tone === "dash" ? "h-11 shrink-0 rounded-full bg-gold px-4 text-sm text-ink" : "h-11 shrink-0 rounded-full bg-ink px-4 text-sm text-cream";
	const pillOff = "h-11 shrink-0 rounded-full border border-border px-4 text-sm";
	function patch(partial) {
		onChange({
			...value,
			page: 1,
			...partial
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "relative flex-1",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					patch({ q: String(fd.get("q") ?? "").trim() || void 0 });
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "q",
					className: "pl-9",
					placeholder: "Search name, category, type, or description",
					defaultValue: value.q ?? ""
				}, value.q ?? "")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: ["All", ...CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch({ category: c === "All" ? void 0 : c }),
					className: !value.category && c === "All" || value.category === c ? pillOn : pillOff,
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mpType",
							children: "Product type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							id: "mpType",
							value: value.productType ?? "",
							onChange: (e) => patch({ productType: e.target.value || void 0 }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "All types"
							}), PRODUCT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t,
								children: PRODUCT_TYPE_LABEL[t]
							}, t))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mpCommission",
							children: "Commission"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							id: "mpCommission",
							value: value.commissionType ?? "",
							onChange: (e) => patch({ commissionType: e.target.value || void 0 }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "All commissions"
							}), COMMISSION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t,
								children: t === "percent" ? "Percentage" : "Fixed amount"
							}, t))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mpMin",
							children: "Min price"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mpMin",
							type: "number",
							min: 0,
							placeholder: "Any",
							value: value.minPrice ?? "",
							onChange: (e) => patch({ minPrice: e.target.value || void 0 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mpMax",
							children: "Max price"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mpMax",
							type: "number",
							min: 0,
							placeholder: "Any",
							value: value.maxPrice ?? "",
							onChange: (e) => patch({ maxPrice: e.target.value || void 0 })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: loading ? "Loading offers…" : `${total} approved offer${total === 1 ? "" : "s"}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					"aria-label": "Sort offers",
					className: "w-full sm:w-56",
					value: value.sort ?? "newest",
					onChange: (e) => patch({ sort: e.target.value }),
					children: MARKETPLACE_SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.label
					}, s.id))
				})]
			})
		]
	}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Could not load marketplace",
			body: error
		})
	}) : loading && !pageData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"),
		children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-secondary" }, i))
	}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: filtered ? "No offers match" : "No products yet",
			body: filtered ? "Try another search, category, or filter. Only approved products from approved vendors appear here." : "Approved vendor products will show here after Admin review. There are no demo listings."
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: items.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfferCard, { offer }, offer.slug))
	}), pages > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 flex items-center justify-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: page <= 1,
				onClick: () => onChange({
					...value,
					page: page - 1
				}),
				children: "Previous"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Page ",
					page,
					" of ",
					pages
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: page >= pages,
				onClick: () => onChange({
					...value,
					page: page + 1
				}),
				children: "Next"
			})
		]
	}) : null] })] });
}
//#endregion
export { MarketplaceBrowser as t };
