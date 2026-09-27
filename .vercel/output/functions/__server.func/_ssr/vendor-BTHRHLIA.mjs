//#region node_modules/.nitro/vite/services/ssr/assets/vendor-BTHRHLIA.js
function vendorCanEdit(status) {
	return status !== "suspended";
}
function vendorCanSubmit(status) {
	return status === "incomplete" || status === "rejected";
}
function vendorCanPublish(status) {
	return status === "approved";
}
function applyVendorReview(status, action) {
	if (action === "approve") {
		if (status === "pending_review" || status === "suspended") return "approved";
		throw new Error("This application cannot be approved");
	}
	if (action === "reject") {
		if (status === "pending_review") return "rejected";
		throw new Error("Only pending applications can be rejected");
	}
	if (action === "suspend") {
		if (status === "approved") return "suspended";
		throw new Error("Only approved vendors can be suspended");
	}
	throw new Error("Unknown review action");
}
var VENDOR_STATUS_COPY = {
	incomplete: {
		label: "Incomplete",
		message: "Complete your store profile and submit it for review."
	},
	pending_review: {
		label: "Pending review",
		message: "Your Vendor application is currently under review."
	},
	approved: {
		label: "Approved",
		message: "Your Vendor account has been approved."
	},
	rejected: {
		label: "Rejected",
		message: "Your Vendor application was rejected. Review the reason and update your information."
	},
	suspended: {
		label: "Suspended",
		message: "Your Vendor account is currently suspended."
	}
};
//#endregion
export { vendorCanSubmit as a, vendorCanPublish as i, applyVendorReview as n, vendorCanEdit as r, VENDOR_STATUS_COPY as t };
