//#region node_modules/.nitro/vite/services/ssr/assets/roles-DLM0LukR.js
function productRoleOf(roles) {
	return (Array.isArray(roles) ? roles : String(roles ?? "").split(",")).map((role) => role.trim()).includes("vendor") ? "vendor" : "affiliate";
}
function deskRoleOf(isAdmin, roles) {
	if (isAdmin) return "admin";
	return productRoleOf(roles);
}
function normalizeProductRole(roles) {
	return productRoleOf(roles);
}
var DESK_HOME = {
	admin: "/dashboard/admin",
	vendor: "/dashboard/vendor",
	affiliate: "/dashboard/affiliate"
};
var DESK_LABEL = {
	admin: "Admin Dashboard",
	vendor: "Vendor Dashboard",
	affiliate: "Affiliate Dashboard"
};
//#endregion
export { normalizeProductRole as i, DESK_LABEL as n, deskRoleOf as r, DESK_HOME as t };
