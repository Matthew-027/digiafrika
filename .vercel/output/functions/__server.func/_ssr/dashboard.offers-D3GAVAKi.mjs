import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { t as MarketplaceBrowser } from "./marketplace-browser-D1nHuowX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.offers-D3GAVAKi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OffersRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "affiliate",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskOffers, {})
	});
}
function DeskOffers() {
	const [search, setSearch] = (0, import_react.useState)({});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Marketplace",
		title: "Offers to promote",
		description: "Only approved products from approved vendors. Tracking links and applications come in a later step."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketplaceBrowser, {
		value: search,
		onChange: setSearch,
		tone: "dash"
	})] });
}
//#endregion
export { OffersRoute as component };
