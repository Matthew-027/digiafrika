//#region node_modules/.nitro/vite/services/ssr/assets/product-CDkg8sUW.js
var PRODUCT_TYPES = [
	"digital",
	"physical",
	"service",
	"course",
	"software",
	"subscription"
];
var CURRENCIES = [
	"NGN",
	"USD",
	"GHS",
	"KES",
	"ZAR",
	"EGP",
	"TZS",
	"UGX",
	"RWF",
	"XOF",
	"EUR"
];
var COMMISSION_TYPES = ["percent", "fixed"];
function isCurrency(value) {
	return Boolean(value && CURRENCIES.includes(value));
}
function productCanEdit(status) {
	return status === "draft" || status === "rejected";
}
function productCanSubmit(status) {
	return status === "draft" || status === "rejected";
}
function productIsPublic(status, isDemo = false) {
	return status === "approved" && !isDemo;
}
function applyProductReview(status, action) {
	if (action === "approve") {
		if (status === "pending_review" || status === "suspended") return "approved";
		throw new Error("This product cannot be approved");
	}
	if (action === "reject") {
		if (status === "pending_review") return "rejected";
		throw new Error("Only products under review can be rejected");
	}
	if (action === "suspend") {
		if (status === "approved") return "suspended";
		throw new Error("Only approved products can be suspended");
	}
	throw new Error("Unknown review action");
}
function validateCommission(type, value) {
	if (!Number.isFinite(value) || value < 0) return "Commission cannot be negative";
	if (type === "percent" && value > 100) return "Percentage commission cannot be above 100%";
	return null;
}
function compatPriceNgn(amount, currency) {
	return currency === "NGN" ? Math.round(amount) : 0;
}
function compatCommissionPct(type, value) {
	return type === "percent" ? Math.round(value) : 0;
}
var PRODUCT_TYPE_LABEL = {
	digital: "Digital product",
	physical: "Physical product",
	service: "Service",
	course: "Course",
	software: "Software / tool",
	subscription: "Subscription"
};
var PRODUCT_STATUS_COPY = {
	draft: {
		label: "Draft",
		message: "Saved privately. Submit it for Admin review when you are ready."
	},
	pending_review: {
		label: "Pending review",
		message: "This product is waiting for Admin review."
	},
	approved: {
		label: "Approved",
		message: "Approved. This offer can appear in the marketplace."
	},
	rejected: {
		label: "Rejected",
		message: "Rejected. Update the product and resubmit it."
	},
	suspended: {
		label: "Suspended",
		message: "Suspended. This offer is not publicly available."
	}
};
//#endregion
export { PRODUCT_TYPE_LABEL as a, compatPriceNgn as c, productCanSubmit as d, productIsPublic as f, PRODUCT_TYPES as i, isCurrency as l, CURRENCIES as n, applyProductReview as o, validateCommission as p, PRODUCT_STATUS_COPY as r, compatCommissionPct as s, COMMISSION_TYPES as t, productCanEdit as u };
