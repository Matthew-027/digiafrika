import { i as PRODUCT_TYPES } from "./product-CDkg8sUW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-BI8vvxl1.js
var MARKETPLACE_SORTS = [
	{
		id: "newest",
		label: "Newest"
	},
	{
		id: "price_desc",
		label: "Price: high to low"
	},
	{
		id: "price_asc",
		label: "Price: low to high"
	},
	{
		id: "commission",
		label: "Highest commission"
	}
];
function productIsMarketplaceLive(status, isDemo, vendorStatus) {
	return status === "approved" && !isDemo && vendorStatus === "approved";
}
function commissionPayout(offer) {
	if (offer.commissionType === "fixed") return offer.commissionValue;
	return Math.round(offer.priceAmount * offer.commissionValue / 100);
}
function commissionLabel(offer) {
	if (offer.commissionType === "fixed") return `${offer.commissionValue} ${offer.currency} fixed`;
	return `${offer.commissionValue}%`;
}
function isProductTypeFilter(value) {
	return Boolean(value && PRODUCT_TYPES.includes(value));
}
function isCommissionTypeFilter(value) {
	return value === "percent" || value === "fixed";
}
function isMarketplaceSort(value) {
	return Boolean(value && MARKETPLACE_SORTS.some((s) => s.id === value));
}
function normalizeMarketplaceQuery(input) {
	const page = Math.max(1, Math.floor(input?.page ?? 1));
	const pageSize = Math.min(50, Math.max(1, Math.floor(input?.pageSize ?? 20)));
	const sort = isMarketplaceSort(input?.sort) ? input.sort : "newest";
	const q = input?.q?.trim() || void 0;
	const category = input?.category?.trim() && input.category !== "All" ? input.category : void 0;
	const productType = isProductTypeFilter(input?.productType) ? input.productType : void 0;
	const commissionType = isCommissionTypeFilter(input?.commissionType) ? input.commissionType : void 0;
	let minPrice = input?.minPrice;
	let maxPrice = input?.maxPrice;
	if (minPrice != null && minPrice < 0) minPrice = void 0;
	if (maxPrice != null && maxPrice < 0) maxPrice = void 0;
	if (minPrice != null && maxPrice != null && minPrice > maxPrice) maxPrice = void 0;
	return {
		q,
		category,
		productType,
		commissionType,
		minPrice,
		maxPrice,
		sort,
		page,
		pageSize
	};
}
//#endregion
export { normalizeMarketplaceQuery as a, isProductTypeFilter as i, commissionLabel as n, productIsMarketplaceLive as o, commissionPayout as r, MARKETPLACE_SORTS as t };
