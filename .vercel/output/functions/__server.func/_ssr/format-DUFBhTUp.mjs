//#region node_modules/.nitro/vite/services/ssr/assets/format-DUFBhTUp.js
function formatNgn(amount) {
	return formatMoney(amount, "NGN");
}
function formatMoney(amount, currency = "NGN") {
	try {
		return new Intl.NumberFormat("en", {
			style: "currency",
			currency,
			maximumFractionDigits: 0
		}).format(amount);
	} catch {
		return `${currency} ${Math.round(amount).toLocaleString("en")}`;
	}
}
function formatNumber(n) {
	return new Intl.NumberFormat("en-NG").format(n);
}
function formatDate(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(d);
}
function formatDateTime(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	}).format(d);
}
function trackingUrl(code) {
	if (typeof window === "undefined") return `/t/${code}`;
	return `${window.location.origin}/t/${code}`;
}
function referralUrl(code) {
	if (typeof window === "undefined") return `/login?join=1&ref=${code}`;
	return `${window.location.origin}/login?join=1&ref=${code}`;
}
function payoutMethodLabel(method) {
	if (method === "paystack") return "Paystack";
	if (method === "flutterwave") return "Flutterwave";
	if (method === "mpesa") return "M-Pesa";
	if (method === "bank_ng") return "Bank transfer";
	return method;
}
//#endregion
export { formatNumber as a, trackingUrl as c, formatNgn as i, formatDateTime as n, payoutMethodLabel as o, formatMoney as r, referralUrl as s, formatDate as t };
